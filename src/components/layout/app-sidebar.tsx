"use client";

import * as React from "react";
import {
    useRouter,
    useSearchParams,
    usePathname,
} from "next/navigation";
import {
    ChevronDown,
    ChevronRight,
    Search,
    RotateCcw,
} from "lucide-react";

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
import { Cuisine } from "@/types";

const INITIAL_VISIBLE = 9;

/* ─── Sort presets (maps UI label → backend query params) ─── */
const SORT_OPTIONS = [
    { id: "relevance", label: "Relevance", sortBy: "created_at", sortOrder: "desc" },
    { id: "low-to-high", label: "Price: Low to High", sortBy: "price", sortOrder: "asc" },
    { id: "high-to-low", label: "Price: High to Low", sortBy: "price", sortOrder: "desc" },
    { id: "top-rated", label: "Top Rated", sortBy: "rating_avg", sortOrder: "desc" },
] as const;

const PRICE_MIN = 0;
const PRICE_MAX = 1000;
const PRICE_STEP = 10;

/* ─── Hook: centralised URL‑param read/write ─── */
function useSidebarFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    /* ── readers ── */
    const selectedCuisines = React.useMemo(() => {
        const raw = searchParams.get("cuisine");
        return raw ? raw.split(",").filter(Boolean) : [];
    }, [searchParams]);

    const priceRange: [number, number] = React.useMemo(() => {
        const min = Number(searchParams.get("minPrice")) || PRICE_MIN;
        const max = Number(searchParams.get("maxPrice")) || PRICE_MAX;
        return [min, max];
    }, [searchParams]);

    const selectedSort = React.useMemo(() => {
        const by = searchParams.get("sortBy") ?? "created_at";
        const order = searchParams.get("sortOrder") ?? "desc";
        return (
            SORT_OPTIONS.find((o) => o.sortBy === by && o.sortOrder === order)?.id ??
            "relevance"
        );
    }, [searchParams]);

    /* ── writer (builds a fresh URLSearchParams, preserves `search`) ── */
    const pushParams = React.useCallback(
        (patch: Record<string, string | undefined>) => {
            const params = new URLSearchParams(searchParams.toString());

            for (const [key, value] of Object.entries(patch)) {
                if (value === undefined || value === "") {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            }

            const qs = params.toString();
            router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
        },
        [router, pathname, searchParams],
    );

    /* ── mutation helpers ── */
    const setCuisines = React.useCallback(
        (next: string[]) => {
            pushParams({ cuisine: next.length > 0 ? next.join(",") : undefined });
        },
        [pushParams],
    );

    const setPrice = React.useCallback(
        (min: number, max: number) => {
            pushParams({
                minPrice: min > PRICE_MIN ? String(min) : undefined,
                maxPrice: max < PRICE_MAX ? String(max) : undefined,
            });
        },
        [pushParams],
    );

    const setSort = React.useCallback(
        (optionId: string) => {
            const opt = SORT_OPTIONS.find((o) => o.id === optionId);
            if (!opt || opt.id === "relevance") {
                pushParams({ sortBy: undefined, sortOrder: undefined });
            } else {
                pushParams({ sortBy: opt.sortBy, sortOrder: opt.sortOrder });
            }
        },
        [pushParams],
    );

    const clearAll = React.useCallback(() => {
        // Preserve only the `search` param if present
        const search = searchParams.get("search");
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        const qs = params.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, [router, pathname, searchParams]);

    const hasFilters = React.useMemo(() => {
        return (
            selectedCuisines.length > 0 ||
            priceRange[0] > PRICE_MIN ||
            priceRange[1] < PRICE_MAX ||
            selectedSort !== "relevance"
        );
    }, [selectedCuisines, priceRange, selectedSort]);

    return {
        selectedCuisines,
        priceRange,
        selectedSort,
        setCuisines,
        setPrice,
        setSort,
        clearAll,
        hasFilters,
    };
}

/* ─── Cuisines Section ─── */
const CuisinesSection = React.memo(function CuisinesSection({
    cuisines,
    selectedCuisines,
    onToggle,
}: {
    cuisines: Cuisine[];
    selectedCuisines: string[];
    onToggle: (name: string, checked: boolean) => void;
}) {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [showAll, setShowAll] = React.useState(false);

    // Only show active cuisines with icons (matching Cuisines.tsx logic)
    const activeCuisines = React.useMemo(
        () => cuisines.filter((c) => c.is_active && c.icon_url),
        [cuisines],
    );

    const filteredCuisines = React.useMemo(
        () =>
            activeCuisines.filter((c) =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        [activeCuisines, searchQuery],
    );

    const displayed = showAll
        ? filteredCuisines
        : filteredCuisines.slice(0, INITIAL_VISIBLE);

    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel
                    asChild
                    className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm font-semibold"
                >
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                        Cuisines
                        {selectedCuisines.length > 0 && (
                            <span className="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                {selectedCuisines.length}
                            </span>
                        )}
                        <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent className="transition-all duration-200 data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
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

                        {/* Checkboxes */}
                        <div className="space-y-3 max-h-75 overflow-y-auto pr-1">
                            {displayed.map((cuisine) => {
                                const checked = selectedCuisines.includes(cuisine.name);
                                return (
                                    <div
                                        key={cuisine.slug}
                                        className="flex items-center space-x-3"
                                    >
                                        <Checkbox
                                            id={`cuisine-${cuisine.slug}`}
                                            checked={checked}
                                            onCheckedChange={(v) =>
                                                onToggle(cuisine.name, v as boolean)
                                            }
                                            className="rounded-lg border-muted-foreground/40 transition-colors duration-150"
                                        />
                                        <Label
                                            htmlFor={`cuisine-${cuisine.slug}`}
                                            className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {cuisine.name}
                                        </Label>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Show more / less */}
                        {filteredCuisines.length > INITIAL_VISIBLE && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowAll((p) => !p)}
                                className="mt-3 p-0 h-auto text-sm font-normal text-muted-foreground hover:text-foreground hover:bg-transparent"
                            >
                                {showAll ? "Show less" : "Show more"}
                                <ChevronDown
                                    className={`ml-1 size-4 transition-transform duration-200 ${showAll ? "rotate-180" : ""}`}
                                />
                            </Button>
                        )}
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
});

/* ─── Price Range Section ─── */
const PriceRangeSection = React.memo(function PriceRangeSection({
    priceRange,
    onCommit,
}: {
    priceRange: [number, number];
    onCommit: (min: number, max: number) => void;
}) {
    // Local draft so the slider is smooth (URL is only pushed on commit)
    const [draft, setDraft] = React.useState<[number, number]>(priceRange);

    // Sync draft when URL params change externally
    React.useEffect(() => {
        setDraft(priceRange);
    }, [priceRange]);

    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel
                    asChild
                    className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm font-semibold"
                >
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                        Price Range
                        <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent className="transition-all duration-200 data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
                    <SidebarGroupContent className="px-2 pt-4 pb-2">
                        {/* Slider */}
                        <Slider
                            value={draft}
                            onValueChange={(v) => setDraft(v as [number, number])}
                            onValueCommit={(v) => onCommit(v[0], v[1])}
                            max={PRICE_MAX}
                            min={PRICE_MIN}
                            step={PRICE_STEP}
                            className="w-full"
                        />

                        {/* Labels */}
                        <div className="flex items-center justify-between mt-3">
                            <span className="text-sm text-muted-foreground">
                                ৳{draft[0]}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                ৳{draft[1]}
                            </span>
                        </div>

                        {/* Selected Range */}
                        <div className="mt-3 p-2 bg-muted/50 rounded-md transition-colors duration-150">
                            <p className="text-xs text-center text-muted-foreground">
                                Selected:{" "}
                                <span className="font-medium text-foreground">
                                    ৳{draft[0]} – ৳{draft[1]}
                                </span>
                            </p>
                        </div>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
});

/* ─── Sort By Section ─── */
const SortBySection = React.memo(function SortBySection({
    selectedSort,
    onSelect,
}: {
    selectedSort: string;
    onSelect: (id: string) => void;
}) {
    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel
                    asChild
                    className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm font-semibold"
                >
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                        Sort By
                        <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent className="transition-all duration-200 data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
                    <SidebarGroupContent className="px-2 pt-2">
                        <RadioGroup
                            value={selectedSort}
                            onValueChange={onSelect}
                            className="space-y-3"
                        >
                            {SORT_OPTIONS.map((option) => (
                                <div
                                    key={option.id}
                                    className="flex items-center space-x-3"
                                >
                                    <RadioGroupItem
                                        value={option.id}
                                        id={`sort-${option.id}`}
                                        className="border-muted-foreground/40 transition-colors duration-150"
                                    />
                                    <Label
                                        htmlFor={`sort-${option.id}`}
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
});

/* ═══════════════════════════════════════════
   AppSidebar — the exported component
   ═══════════════════════════════════════════ */
export function AppSidebar({
    cuisines = [],
    ...props
}: React.ComponentProps<typeof Sidebar> & { cuisines?: Cuisine[] }) {
    const {
        selectedCuisines,
        priceRange,
        selectedSort,
        setCuisines,
        setPrice,
        setSort,
        clearAll,
        hasFilters,
    } = useSidebarFilters();

    const handleCuisineToggle = React.useCallback(
        (id: string, checked: boolean) => {
            const next = checked
                ? [...selectedCuisines, id]
                : selectedCuisines.filter((c) => c !== id);
            setCuisines(next);
        },
        [selectedCuisines, setCuisines],
    );

    return (
        <Sidebar {...props}>
            <SidebarContent className="gap-0 py-2">
                {/* Clear All — only visible when filters are active */}
                {hasFilters && (
                    <>
                        <div className="px-3 py-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAll}
                                className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground transition-colors duration-150"
                            >
                                <RotateCcw className="size-4" />
                                Clear all filters
                            </Button>
                        </div>
                        <Separator />
                    </>
                )}

                {/* Sort By */}
                <SortBySection
                    selectedSort={selectedSort}
                    onSelect={setSort}
                />

                <Separator className="my-2" />

                {/* Price Range */}
                <PriceRangeSection
                    priceRange={priceRange}
                    onCommit={setPrice}
                />

                <Separator className="my-2" />

                {/* Cuisines */}
                <CuisinesSection
                    cuisines={cuisines}
                    selectedCuisines={selectedCuisines}
                    onToggle={handleCuisineToggle}
                />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
