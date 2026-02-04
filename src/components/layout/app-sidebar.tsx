import * as React from "react"
import { ChevronRight } from "lucide-react"

import { SearchForm } from "@/components/layout/search-form"
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Sort By",
      url: "#",
      items: [
        {
          title: "lowest to highest",
          url: "#",
        },
        {
          title: "highest to lowest",
          url: "#",
        },
        {
          title: "Top Rated",
          url: "#",
        }
      ],
    },
    {
      title: "Prices",
      url: "#",
      items: [
        {
          title: "under 100TK",
          url: "#",
        },
        {
          title: "under 200TK",
          url: "#",
        },
        {
          title: "over 200TK",
          url: "#",
        },
      ],
    },
    {
      title: "Cuisines",
      url: "#",
      items: [
        {
          title: "Asian",
          url: "#",
        },
        {
          title: "Burgers",
          url: "#",
          isActive: true,
        },
        {
          title: "Chinese",
          url: "#",
        },
        {
          title: "Pizza",
          url: "#",
        },
        {
          title: "Briyani",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {item.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
