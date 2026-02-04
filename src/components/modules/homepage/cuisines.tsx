import Image from "next/image"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export interface Artwork {
    artist: string
    art: string
}

export const works: Artwork[] = [
    {
        artist: "Pizza",
        art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
    },
    {
        artist: "Burger",
        art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
    },
    {
        artist: "Pasta",
        art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
    },
    {
        artist: "Chinese",
        art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
    },
    {
        artist: "Mexican",
        art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
    },
    {
        artist: "Indian",
        art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
    },
    {
        artist: "Bangladeshi",
        art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
    },
    {
        artist: "Biriyani",
        art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
    },
    {
        artist: "Thai",
        art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
    },
    {
        artist: "Japanese",
        art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
    },
    {
        artist: "Mediterranean",
        art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
    },
    {
        artist: "French",
        art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
    },
    {
        artist: "Korean",
        art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
    },
]

export default function Cuisines() {
    return (
        <>
            <div className="font-medium text-3xl mt-4">Cuisines</div>
            <ScrollArea className="w-[80vw] rounded-md border whitespace-nowrap">
                <div className="flex w-max space-x-5 p-4 text-center">
                    {works.map((artwork) => (
                        <figure key={artwork.artist} className="shrink-0">
                            <div className="overflow-hidden rounded-md w-28 h-28">
                                <Image
                                    src={artwork.art}
                                    alt={`Photo by ${artwork.artist}`}
                                    className="aspect-[1/1] h-fit w-fit object-cover"
                                    priority
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <figcaption className="text-muted-foreground pt-2 text-xs">
                                <span className="text-foreground font-semibold block">
                                    {artwork.artist}
                                </span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </>
    )
}
