import Image from "next/image"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cousinesService } from "@/services/cuisines.service"
import { Cuisine } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UtensilsCrossed } from "lucide-react";

const cuisines = await cousinesService.getAllCousines();

interface CuisinesProps {
    activeCuisine?: string;
}

export default function Cuisines({ activeCuisine }: CuisinesProps) {
    return (
        <>
            <div className="font-medium text-3xl mt-4">Cuisines</div>
            <ScrollArea className="w-[80vw] rounded-md border whitespace-nowrap">
                <div className="flex w-max space-x-5 p-4 text-center">
                    {/* if the message is error  */}
                    {cuisines?.error?.message ? (
                        <p className="text-red-500">{cuisines?.error?.message}</p>
                    ) : null}

                    {/* "All" button to clear cuisine filter */}
                    {/* <Link href="/">
                        <figure className="shrink-0 group">
                            <div
                                className={cn(
                                    "overflow-hidden rounded-md w-28 h-28 flex items-center justify-center transition-all duration-300",
                                    !activeCuisine
                                        ? "ring-2 ring-primary bg-primary/10 scale-105"
                                        : "bg-muted hover:bg-muted/80 hover:scale-105"
                                )}
                            >
                                <UtensilsCrossed className={cn(
                                    "size-12 transition-colors",
                                    !activeCuisine ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                )} />
                            </div>
                            <figcaption className="text-muted-foreground pt-2 text-xs">
                                <span className={cn(
                                    "font-semibold block transition-colors",
                                    !activeCuisine ? "text-primary" : "text-foreground"
                                )}>
                                    All
                                </span>
                            </figcaption>
                        </figure>
                    </Link> */}

                    {/* Cuisine items — stay on homepage, toggle filter via ?cuisines=slug */}
                    {cuisines?.data?.map((cuisine: Cuisine) => {
                        if (!cuisine.icon_url || !cuisine.is_active) return null;
                        const isActive = activeCuisine === cuisine.slug;
                        // Clicking active cuisine again clears the filter
                        const href = isActive ? "/" : `/?cuisines=${cuisine.slug}`;

                        return (
                            <Link key={cuisine.slug} href={href}>
                                <figure className="shrink-0 group">
                                    <div
                                        className={cn(
                                            "overflow-hidden rounded-md w-28 h-28 transition-all duration-300",
                                            isActive
                                                ? "ring-2 ring-primary scale-105"
                                                : "hover:scale-105"
                                        )}
                                    >
                                        <Image
                                            src={cuisine.icon_url}
                                            alt={cuisine.name}
                                            className="aspect-[1/1] h-fit w-fit object-cover"
                                            priority
                                            width={100}
                                            height={100}
                                        />
                                    </div>
                                    <figcaption className="text-muted-foreground pt-2 text-xs">
                                        <span className={cn(
                                            "font-semibold block transition-colors",
                                            isActive ? "text-primary" : "text-foreground"
                                        )}>
                                            {cuisine.name}
                                        </span>
                                    </figcaption>
                                </figure>
                            </Link>
                        );
                    })}

                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </>
    )
}
