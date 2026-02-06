import Image from "next/image"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export interface Artwork {
    artist: string
    art: string
}

export const works: Artwork[] = [
    {
        artist: "Pizza",
        art: "https://images.deliveryhero.io/image/foodpanda/cuisine-images/bd/73.png",
    },
    {
        artist: "Burger",
        art: "https://images.deliveryhero.io/image/foodpanda/cuisine-images/bd/85.png",
    },
    {
        artist: "Pasta",
        art: "https://images.deliveryhero.io/image/foodpanda/cuisine-images/bd/103.png",
    },
    {
        artist: "Cakes",
        art: "https://images.deliveryhero.io/image/foodpanda/cuisine-images/bd/77.png",
    },
    {
        artist: "Mexican",
        art: "https://hips.hearstapps.com/hmg-prod/images/pozole-index-655b86b9eeb3f.jpg?crop=0.502xw:1.00xh;0.0529xw,0&resize=1200",
    },
    {
        artist: "Kababs",
        art: "https://images.deliveryhero.io/image/foodpanda/cuisine-images/bd/132.png",
    },
    {
        artist: "Bangladeshi",
        art: "https://static.vecteezy.com/system/resources/thumbnails/056/737/597/small/delicious-indian-thali-feast-restaurant-food-indoor-close-up-png.png",
    },
    {
        artist: "Biryani",
        art: "https://images.deliveryhero.io/image/foodpanda/cuisine-images/bd/193.png",
    },
    {
        artist: "Breakfast",
        art: "https://images.deliveryhero.io/image/foodpanda/cuisine-images/bd/106.png",
    },
    {
        artist: "Chinese",
        art: "https://static.vecteezy.com/system/resources/thumbnails/041/646/487/small/ai-generated-pad-thai-noodles-isolated-traditional-asian-street-food-png.png",
    },
    {
        artist: "Snacks",
        art: "https://images.deliveryhero.io/image/foodpanda/cuisine-images/bd/122.png",
    },
    {
        artist: "Sweets",
        art: "https://images.deliveryhero.io/image/foodpanda/cuisine-images/bd/249.png",
    },
    {
        artist: "Chicken",
        art: "https://images.deliveryhero.io/image/foodpanda/cuisine-images/bd/100.png",
    },
    {
        artist: "Fast Food",
        art: "https://images.deliveryhero.io/image/foodpanda/cuisine-images/bd/86.png",
    }
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
