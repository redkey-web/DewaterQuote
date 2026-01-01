/**
 * Fetch all videos from Orbit Couplings YouTube channel
 * Usage: npx tsx scripts/fetch-youtube-videos.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) {
  console.error('Error: YOUTUBE_API_KEY environment variable is required');
  process.exit(1);
}
const CHANNEL_HANDLE = '@orbitcouplings8194';

interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  url: string;
  // Parsed fields
  sizeMatch: string | null;
  productMatch: string | null;
}

interface ChannelSearchResult {
  items: Array<{
    id: { channelId: string };
    snippet: { title: string };
  }>;
}

interface PlaylistItemsResult {
  items: Array<{
    snippet: {
      resourceId: { videoId: string };
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: {
        medium?: { url: string };
        default?: { url: string };
      };
    };
  }>;
  nextPageToken?: string;
}

interface ChannelResult {
  items: Array<{
    contentDetails: {
      relatedPlaylists: {
        uploads: string;
      };
    };
  }>;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }
  return response.json() as Promise<T>;
}

async function getChannelId(handle: string): Promise<string> {
  // First try to search for the channel by handle
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(handle)}&key=${API_KEY}`;
  const result = await fetchJson<ChannelSearchResult>(searchUrl);

  if (result.items && result.items.length > 0) {
    console.log(`Found channel: ${result.items[0].snippet.title}`);
    return result.items[0].id.channelId;
  }

  throw new Error(`Channel not found: ${handle}`);
}

async function getUploadsPlaylistId(channelId: string): Promise<string> {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`;
  const result = await fetchJson<ChannelResult>(url);

  if (result.items && result.items.length > 0) {
    return result.items[0].contentDetails.relatedPlaylists.uploads;
  }

  throw new Error(`Could not get uploads playlist for channel: ${channelId}`);
}

async function getAllVideos(playlistId: string): Promise<YouTubeVideo[]> {
  const videos: YouTubeVideo[] = [];
  let pageToken: string | undefined;

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`;
    const result = await fetchJson<PlaylistItemsResult>(url);

    for (const item of result.items) {
      const video: YouTubeVideo = {
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnailUrl: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || '',
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        sizeMatch: null,
        productMatch: null,
      };

      // Try to extract size from title (e.g., "114.3mm", "48.3mm")
      const sizeMatch = video.title.match(/(\d+(?:\.\d+)?)\s*mm/i);
      if (sizeMatch) {
        video.sizeMatch = sizeMatch[1] + 'mm';
      }

      // Try to match product type from title
      video.productMatch = matchProductType(video.title);

      videos.push(video);
    }

    pageToken = result.nextPageToken;
    console.log(`Fetched ${videos.length} videos...`);

  } while (pageToken);

  return videos;
}

function matchProductType(title: string): string | null {
  const titleLower = title.toLowerCase();

  // Product patterns to match (in order of specificity)
  const patterns: Array<{ pattern: RegExp; product: string; sku: string }> = [
    // Flex Grip variants
    { pattern: /flex\s*grip\s*2\s*p\s*long/i, product: 'Flex Grip 2P Long', sku: 'FlexGrip2PLong' },
    { pattern: /flex\s*grip\s*2\s*l/i, product: 'Flex Grip 2 L', sku: 'OCFG2-L' },
    { pattern: /flex\s*grip\s*2\s*s/i, product: 'Flex Grip 2 S', sku: 'OCFG2-S' },
    { pattern: /flex\s*grip\s*open\s*l/i, product: 'Flex Grip Open L', sku: 'OCFGO-L' },
    { pattern: /flex\s*grip\s*open\s*s/i, product: 'Flex Grip Open S', sku: 'OCFGO-S' },
    { pattern: /flex\s*grip\s*l(?:\s|$|,|\|)/i, product: 'Flex Grip L', sku: 'OCFG-L' },
    { pattern: /flex\s*grip\s*s(?:\s|$|,|\|)/i, product: 'Flex Grip S', sku: 'OCFG-S' },

    // Open Flex
    { pattern: /open\s*flex\s*400/i, product: 'Open Flex 400-L', sku: 'OCOF400-L' },
    { pattern: /open\s*flex\s*300/i, product: 'Open Flex 300-L', sku: 'OCOF300-L' },
    { pattern: /open\s*flex\s*200/i, product: 'Open Flex 200-L', sku: 'OCOF200-L' },

    // Metal Lock
    { pattern: /metal\s*lock\s*l/i, product: 'Metal Lock L', sku: 'OCML-L' },
    { pattern: /metal\s*lock\s*s/i, product: 'Metal Lock S', sku: 'OCML-S' },

    // Repair Clamps
    { pattern: /elbow\s*repair\s*clamp\s*type\s*2/i, product: 'Elbow Repair Clamp Type 2', sku: 'OCELBRC' },
    { pattern: /elbow\s*repair\s*clamp\s*type\s*1/i, product: 'Elbow Repair Clamp Type 1', sku: 'OCERC' },
    { pattern: /elbow\s*repair\s*clamp/i, product: 'Elbow Repair Clamp', sku: 'OCERC' },
    { pattern: /pipe\s*elbow\s*repair\s*clamp/i, product: 'Elbow Repair Clamp', sku: 'OCERC' },
    { pattern: /encapsulating.*clamp|d\s*-?\s*series\s*encap/i, product: 'Encapsulating Pipe Repair Clamp', sku: 'ENCAPRC-SS' },
    { pattern: /repair\s*clamp.*400\s*mm\s*wide/i, product: 'Orbit Repair Clamp 400mm', sku: 'OCRC400' },
    { pattern: /repair\s*clamp.*300\s*mm\s*(wide|long)/i, product: 'Orbit Repair Clamp 300mm', sku: 'OCRC300' },
    { pattern: /repair\s*clamp.*200\s*mm\s*(wide|long)/i, product: 'Orbit Repair Clamp 200mm', sku: 'OCRC' },
    { pattern: /repair\s*clamp.*100\s*mm\s*(wide|long)/i, product: 'Orbit Repair Clamp 100mm', sku: 'OCRC100wide' },
    { pattern: /repair\s*clamp.*55\s*mm\s*wide/i, product: 'Orbit Repair Clamp 55mm', sku: 'OCRC55' },
    { pattern: /orbit\s*repair\s*clamp|orbit\s*pipe\s*repair/i, product: 'Orbit Repair Clamp', sku: 'OCRC' },

    // Other products
    { pattern: /universal\s*dual\s*clamp/i, product: 'Universal Dual Clamp', sku: 'UDC' },
    { pattern: /plast\s*coupling/i, product: 'Plast Coupling', sku: 'OCPC' },
    { pattern: /combo\s*lock/i, product: 'Combo Lock', sku: 'OCCL' },

    // Generic pipe coupling (fallback)
    { pattern: /pipe\s*coupling/i, product: 'Pipe Coupling (generic)', sku: 'UNKNOWN' },
  ];

  for (const { pattern, product, sku } of patterns) {
    if (pattern.test(titleLower)) {
      return `${product} (${sku})`;
    }
  }

  return null;
}

async function main() {
  console.log('Fetching videos from Orbit Couplings YouTube channel...\n');

  try {
    // Get channel ID
    console.log(`Looking up channel: ${CHANNEL_HANDLE}`);
    const channelId = await getChannelId(CHANNEL_HANDLE);
    console.log(`Channel ID: ${channelId}\n`);

    // Get uploads playlist
    const playlistId = await getUploadsPlaylistId(channelId);
    console.log(`Uploads playlist: ${playlistId}\n`);

    // Fetch all videos
    const videos = await getAllVideos(playlistId);
    console.log(`\nTotal videos found: ${videos.length}\n`);

    // Group by product match
    const byProduct = new Map<string, YouTubeVideo[]>();
    const unmatched: YouTubeVideo[] = [];

    for (const video of videos) {
      if (video.productMatch) {
        const existing = byProduct.get(video.productMatch) || [];
        existing.push(video);
        byProduct.set(video.productMatch, existing);
      } else {
        unmatched.push(video);
      }
    }

    // Print summary
    console.log('=== VIDEOS BY PRODUCT ===\n');

    const sortedProducts = Array.from(byProduct.entries()).sort((a, b) => b[1].length - a[1].length);

    for (const [product, productVideos] of sortedProducts) {
      console.log(`${product}: ${productVideos.length} videos`);
      for (const v of productVideos.slice(0, 3)) {
        console.log(`  - ${v.title}`);
      }
      if (productVideos.length > 3) {
        console.log(`  ... and ${productVideos.length - 3} more`);
      }
    }

    if (unmatched.length > 0) {
      console.log(`\nUNMATCHED: ${unmatched.length} videos`);
      for (const v of unmatched) {
        console.log(`  - ${v.title}`);
      }
    }

    // Save to JSON file
    const outputPath = path.join(process.cwd(), '.planning', 'audit', 'youtube-videos.json');
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const output = {
      fetchedAt: new Date().toISOString(),
      channelId,
      totalVideos: videos.length,
      byProduct: Object.fromEntries(sortedProducts),
      unmatched,
      allVideos: videos,
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`\nSaved to: ${outputPath}`);

    // Also create a CSV for easy review
    const csvPath = path.join(outputDir, 'youtube-videos.csv');
    const csvRows = [
      'Video ID,Title,Size,Product Match,URL',
      ...videos.map(v =>
        `"${v.videoId}","${v.title.replace(/"/g, '""')}","${v.sizeMatch || ''}","${v.productMatch || ''}","${v.url}"`
      )
    ];
    fs.writeFileSync(csvPath, csvRows.join('\n'));
    console.log(`Saved CSV to: ${csvPath}`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
