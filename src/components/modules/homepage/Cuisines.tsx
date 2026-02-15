import Image from "next/image"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cousinesService } from "@/services/cuisines.service"
import { Cuisine } from "@/types";
import Link from "next/link";


const cuisines = await cousinesService.getAllCousines();

export default function Cuisines() {
    return (
        <>
            <div className="font-medium text-3xl mt-4">Cuisines</div>
            <ScrollArea className="w-[80vw] rounded-md border whitespace-nowrap">
                <div className="flex w-max space-x-5 p-4 text-center">
                    {/* if the message is error  */}
                    {cuisines?.error?.message ? (
                        <p className="text-red-500">{cuisines?.error?.message}</p>
                    ) : null}

                    { /*if the image_url is not empty and is_active true holei show korbo, false holei show korbo na  */}
                    {cuisines?.data?.map((cuisine: Cuisine) => {
                        if (!cuisine.icon_url || !cuisine.is_active) return null;
                        return (
                            <Link key={cuisine.slug} href={`/dishes?cuisines=${cuisine.slug}`}>
                                <figure className="shrink-0">
                                    <div className="overflow-hidden rounded-md w-28 h-28">
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
                                        <span className="text-foreground font-semibold block">
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
