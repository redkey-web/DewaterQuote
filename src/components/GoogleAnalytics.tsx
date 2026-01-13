'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-6KZKZBD747';

export function GoogleAnalytics() {
  return (
    <Script id="ga-lcp-deferred" strategy="afterInteractive">
      {`
        (function(){
          var loaded = false;
          function loadGA() {
            if (loaded) return;
            loaded = true;

            // Load gtag.js
            var script = document.createElement('script');
            script.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';
            script.async = true;
            document.head.appendChild(script);

            // Initialize gtag
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          }

          // Load GA after LCP using PerformanceObserver
          if ('PerformanceObserver' in window) {
            try {
              var po = new PerformanceObserver(function(list) {
                loadGA();
                po.disconnect();
              });
              po.observe({type: 'largest-contentful-paint'}); // NO buffered:true!
            } catch(e) {
              setTimeout(loadGA, 6000);
            }
          } else {
            setTimeout(loadGA, 6000);
          }

          // Ultimate fallback - 6 seconds
          setTimeout(loadGA, 6000);
        })();
      `}
    </Script>
  );
}

// Event tracking functions
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Conversion tracking - Quote form submission
export const trackQuoteSubmission = (productName?: string, quantity?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'Quote',
      event_label: productName || 'Quote Request',
      value: quantity || 1,
    });
    // Also send as custom conversion event
    window.gtag('event', 'quote_submitted', {
      event_category: 'Conversion',
      event_label: productName,
      items_count: quantity,
    });
  }
};

// Conversion tracking - Contact form submission
export const trackContactSubmission = (subject?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'Contact',
      event_label: subject || 'Contact Form',
    });
    window.gtag('event', 'contact_submitted', {
      event_category: 'Conversion',
      event_label: subject,
    });
  }
};

// Product view tracking
export const trackProductView = (productName: string, productId?: string, category?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      event_category: 'Product',
      event_label: productName,
      items: [{
        item_id: productId,
        item_name: productName,
        item_category: category,
      }],
    });
  }
};

// Add to quote tracking
export const trackAddToQuote = (productName: string, size?: string, quantity?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      event_category: 'Quote',
      event_label: productName,
      items: [{
        item_name: productName,
        item_variant: size,
        quantity: quantity || 1,
      }],
    });
  }
};

// Category view tracking
export const trackCategoryView = (categoryName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item_list', {
      event_category: 'Category',
      event_label: categoryName,
      item_list_name: categoryName,
    });
  }
};

// Search tracking
export const trackSearch = (searchTerm: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
    });
  }
};

// Download tracking (datasheets, etc.)
export const trackDownload = (fileName: string, fileType?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'file_download', {
      event_category: 'Download',
      event_label: fileName,
      file_extension: fileType,
    });
  }
};

// Declare gtag on window
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}
