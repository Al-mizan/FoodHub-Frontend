"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2 } from "lucide-react";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentSearch = searchParams.get("search") ?? "";
    const [value, setValue] = useState(currentSearch);
    const [prevSearch, setPrevSearch] = useState(currentSearch);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync local state when URL search param changes externally
    // (e.g. clicking a cuisine clears the search param)
    // This is the recommended React pattern for derived state from props
    if (currentSearch !== prevSearch) {
        setPrevSearch(currentSearch);
        setValue(currentSearch);
    }

    const pushParams = useCallback(
        (search: string) => {
            debounceRef.current = null;
            const params = new URLSearchParams(searchParams.toString());

            if (search.trim()) {
                params.set("search", search.trim());
                // When searching, remove cuisine filter to avoid conflict
                params.delete("cuisines");
            } else {
                params.delete("search");
            }

            const qs = params.toString();
            startTransition(() => {
                router.push(qs ? `/?${qs}` : "/", { scroll: false });
            });
        },
        [router, searchParams, startTransition]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);

        // Debounce 400ms
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => pushParams(newValue), 400);
    };

    const handleClear = () => {
        setValue("");
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }
        pushParams("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            pushParams(value);
        }
    };

    return (
        <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
                placeholder="Search for dishes or cuisines..."
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="pl-10 pr-10 h-12 text-base rounded-xl border-2 transition-colors focus-visible:border-primary"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isPending ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                ) : value ? (
                    <button
                        onClick={handleClear}
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        aria-label="Clear search"
                    >
                        <X className="size-4" />
                    </button>
                ) : null}
            </div>
        </div>
    );
}
