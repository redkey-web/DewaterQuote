"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  LayoutDashboard,
  FileText,
  Package,
  Truck,
  FolderTree,
  Building2,
  ArrowLeftRight,
  Files,
  Settings,
  HelpCircle,
  Plus,
  Search,
  Clock,
  Box,
} from "lucide-react"

interface SearchResult {
  type: "quote" | "product"
  id: string | number
  title: string
  subtitle: string
  url: string
}

interface RecentItem {
  type: "quote" | "product" | "page"
  id: string
  title: string
  url: string
  timestamp: number
}

const NAV_ITEMS = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/admin", shortcut: "⌘⇧D" },
  { title: "Quotes", icon: FileText, url: "/admin/quotes", shortcut: "⌘⇧Q" },
  { title: "Inventory", icon: Package, url: "/admin/inventory", shortcut: "⌘⇧I" },
  { title: "Product Pages", icon: Box, url: "/admin/products", shortcut: "⌘⇧P" },
  { title: "Logistics", icon: Truck, url: "/admin/logistics" },
  { title: "Categories", icon: FolderTree, url: "/admin/categories" },
  { title: "Brands", icon: Building2, url: "/admin/brands" },
  { title: "Redirects", icon: ArrowLeftRight, url: "/admin/redirects" },
  { title: "Files", icon: Files, url: "/admin/files" },
  { title: "Settings", icon: Settings, url: "/admin/settings", shortcut: "⌘," },
  { title: "Help", icon: HelpCircle, url: "/admin/help" },
]

const ACTIONS = [
  { title: "New Quote", icon: Plus, action: "new-quote", url: "/admin/quotes" },
  { title: "Add Product", icon: Plus, action: "new-product", url: "/admin/products/new" },
  { title: "Add Category", icon: Plus, action: "new-category", url: "/admin/categories/new" },
  { title: "Add Brand", icon: Plus, action: "new-brand", url: "/admin/brands/new" },
]

const RECENT_KEY = "admin-command-recent"
const MAX_RECENT = 5

function getRecentItems(): RecentItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(RECENT_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function addRecentItem(item: Omit<RecentItem, "timestamp">) {
  if (typeof window === "undefined") return
  try {
    const recent = getRecentItems().filter((r) => r.id !== item.id)
    recent.unshift({ ...item, timestamp: Date.now() })
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)))
  } catch {
    // Ignore localStorage errors
  }
}

export function AdminCommandPalette() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [loading, setLoading] = React.useState(false)
  const [recent, setRecent] = React.useState<RecentItem[]>([])

  // Load recent items on mount
  React.useEffect(() => {
    setRecent(getRecentItems())
  }, [open])

  // Keyboard shortcut to open
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K to open
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      // Navigation shortcuts when palette is closed
      if (!open && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case "d":
            e.preventDefault()
            router.push("/admin")
            break
          case "q":
            e.preventDefault()
            router.push("/admin/quotes")
            break
          case "i":
            e.preventDefault()
            router.push("/admin/inventory")
            break
          case "p":
            e.preventDefault()
            router.push("/admin/products")
            break
        }
      }
      // ⌘, for settings
      if (e.key === "," && (e.metaKey || e.ctrlKey) && !open) {
        e.preventDefault()
        router.push("/admin/settings")
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, router])

  // Debounced search
  React.useEffect(() => {
    if (!search || search.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/admin/search?q=" + encodeURIComponent(search))
        if (res.ok) {
          const data = await res.json()
          setResults(data.results || [])
        }
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [search])

  const handleSelect = (url: string, item?: { type: string; id: string; title: string }) => {
    if (item) {
      addRecentItem({
        type: item.type as RecentItem["type"],
        id: item.id,
        title: item.title,
        url,
      })
    }
    setOpen(false)
    setSearch("")
    router.push(url)
  }

  return (
    <>
      {/* Keyboard hint in corner */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground bg-background border border-border rounded-md shadow-sm hover:bg-accent transition-colors"
      >
        <Search className="h-3 w-3" />
        <span>Search</span>
        <kbd className="ml-1 px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">⌘K</kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search quotes, products, or type a command..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>
            {loading ? "Searching..." : "No results found."}
          </CommandEmpty>

          {/* Search Results */}
          {results.length > 0 && (
            <CommandGroup heading="Search Results">
              {results.map((result) => (
                <CommandItem
                  key={result.type + "-" + result.id}
                  value={result.title + " " + result.subtitle}
                  onSelect={() =>
                    handleSelect(result.url, {
                      type: result.type,
                      id: String(result.id),
                      title: result.title,
                    })
                  }
                >
                  {result.type === "quote" ? (
                    <FileText className="mr-2 h-4 w-4 text-blue-500" />
                  ) : (
                    <Package className="mr-2 h-4 w-4 text-green-500" />
                  )}
                  <div className="flex flex-col">
                    <span>{result.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {result.subtitle}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Recent Items */}
          {!search && recent.length > 0 && (
            <CommandGroup heading="Recent">
              {recent.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.title}
                  onSelect={() => handleSelect(item.url)}
                >
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Quick Actions */}
          {!search && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Quick Actions">
                {ACTIONS.map((action) => (
                  <CommandItem
                    key={action.action}
                    value={action.title}
                    onSelect={() => handleSelect(action.url)}
                  >
                    <action.icon className="mr-2 h-4 w-4 text-primary" />
                    <span>{action.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {/* Navigation */}
          {!search && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Go to">
                {NAV_ITEMS.map((item) => (
                  <CommandItem
                    key={item.url}
                    value={item.title}
                    onSelect={() =>
                      handleSelect(item.url, {
                        type: "page",
                        id: item.url,
                        title: item.title,
                      })
                    }
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                    {item.shortcut && (
                      <CommandShortcut>{item.shortcut}</CommandShortcut>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
