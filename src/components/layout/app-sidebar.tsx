"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarRail,
} from "@/components/ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Cuisines data
const cuisinesData = [
    { id: "asian", label: "Asian" },
    { id: "bakery", label: "Bakery" },
    { id: "bangladeshi", label: "Bangladeshi" },
    { id: "beverage", label: "Beverage" },
    { id: "biryani", label: "Biryani" },
    { id: "breakfast", label: "Breakfast" },
    { id: "burgers", label: "Burgers" },
    { id: "cafe", label: "Cafe" },
    { id: "cakes", label: "Cakes" },
    { id: "chinese", label: "Chinese" },
    { id: "desserts", label: "Desserts" },
    { id: "fast-food", label: "Fast Food" },
    { id: "italian", label: "Italian" },
    { id: "pizza", label: "Pizza" },
    { id: "seafood", label: "Seafood" },
];

// Sort options
const sortOptions = [
    { id: "relevance", label: "Relevance" },
    { id: "low-to-high", label: "Price: Low to High" },
    { id: "high-to-low", label: "Price: High to Low" },
    { id: "top-rated", label: "Top Rated" },
];

// Cuisines Section Component
function CuisinesSection() {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedCuisines, setSelectedCuisines] = React.useState<string[]>([]);
    const [showAll, setShowAll] = React.useState(false);

    const filteredCuisines = cuisinesData.filter((cuisine) =>
        cuisine.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedCuisines = showAll
        ? filteredCuisines
        : filteredCuisines.slice(0, 9);

    const handleCuisineChange = (cuisineId: string, checked: boolean) => {
        if (checked) {
            setSelectedCuisines((prev) => [...prev, cuisineId]);
        } else {
            setSelectedCuisines((prev) => prev.filter((id) => id !== cuisineId));
        }
    };

    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel
                    asChild
                    className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm font-semibold"
                >
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                        Cuisines
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarGroupContent className="px-2 pt-2">
                        {/* Search Input */}
                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search for cuisine"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9 text-sm"
                            />
                        </div>

                        {/* Cuisines Checkboxes */}
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                            {displayedCuisines.map((cuisine) => (
                                <div
                                    key={cuisine.id}
                                    className="flex items-center space-x-3"
                                >
                                    <Checkbox
                                        id={cuisine.id}
                                        checked={selectedCuisines.includes(cuisine.id)}
                                        onCheckedChange={(checked) =>
                                            handleCuisineChange(cuisine.id, checked as boolean)
                                        }
                                        className="rounded-[4px] border-muted-foreground/40"
                                    />
                                    <Label
                                        htmlFor={cuisine.id}
                                        className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {cuisine.label}
                                    </Label>
                                </div>
                            ))}
                        </div>

                        {/* Show More/Less Button */}
                        {filteredCuisines.length > 9 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowAll(!showAll)}
                                className="mt-3 p-0 h-auto text-sm font-normal text-muted-foreground hover:text-foreground hover:bg-transparent"
                            >
                                {showAll ? "Show less" : "Show more"}
                                <ChevronDown
                                    className={`ml-1 size-4 transition-transform ${showAll ? "rotate-180" : ""
                                        }`}
                                />
                            </Button>
                        )}
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
}

// Price Range Section Component
function PriceRangeSection() {
    const [priceRange, setPriceRange] = React.useState([0, 1000]);

    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel
                    asChild
                    className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm font-semibold"
                >
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                        Price Range
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarGroupContent className="px-2 pt-4 pb-2">
                        {/* Slider */}
                        <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={1000}
                            min={0}
                            step={10}
                            className="w-full"
                        />

                        {/* Price Labels */}
                        <div className="flex items-center justify-between mt-3">
                            <span className="text-sm text-muted-foreground">
                                ৳{priceRange[0]}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                ৳{priceRange[1]}
                            </span>
                        </div>

                        {/* Selected Range Display */}
                        <div className="mt-3 p-2 bg-muted/50 rounded-md">
                            <p className="text-xs text-center text-muted-foreground">
                                Selected: <span className="font-medium text-foreground">৳{priceRange[0]} - ৳{priceRange[1]}</span>
                            </p>
                        </div>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
}

// Sort By Section Component
function SortBySection() {
    const [selectedSort, setSelectedSort] = React.useState("relevance");

    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel
                    asChild
                    className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm font-semibold"
                >
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                        Sort By
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarGroupContent className="px-2 pt-2">
                        <RadioGroup
                            value={selectedSort}
                            onValueChange={setSelectedSort}
                            className="space-y-3"
                        >
                            {sortOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className="flex items-center space-x-3"
                                >
                                    <RadioGroupItem
                                        value={option.id}
                                        id={option.id}
                                        className="border-muted-foreground/40"
                                    />
                                    <Label
                                        htmlFor={option.id}
                                        className="text-sm font-normal cursor-pointer leading-none"
                                    >
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarContent className="gap-0 py-2">
                {/* Sort By Section */}
                <SortBySection />

                <Separator className="my-2" />

                {/* Price Range Section */}
                <PriceRangeSection />

                <Separator className="my-2" />

                {/* Cuisines Section */}
                <CuisinesSection />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
