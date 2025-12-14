import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Wrench, Gauge, ArrowLeftRight, Filter, Package, Building2, FileText } from "lucide-react";

const productCategories = [
  {
    title: "Clamps & Couplings",
    url: "/clamps-couplings",
    icon: Wrench,
  },
  {
    title: "Valves",
    url: "/valves",
    icon: Gauge,
  },
  {
    title: "Expansion Joints",
    url: "/expansion-joints",
    icon: ArrowLeftRight,
  },
  {
    title: "Strainers & Filters",
    url: "/strainers",
    icon: Filter,
  },
];

const brands = [
  { title: "Straub", url: "/brands/straub" },
  { title: "Orbit", url: "/brands/orbit" },
  { title: "Teekay", url: "/brands/teekay" },
];

const resources = [
  { title: "Price List", url: "/resources/price-list" },
  { title: "Datasheets", url: "/resources/datasheets" },
  { title: "Knowledge Hub", url: "/resources/knowledge-hub" },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Product Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {productCategories.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.startsWith(item.url)}>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Brands</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {brands.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url}>
                      <Package className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resources.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url}>
                      <FileText className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
