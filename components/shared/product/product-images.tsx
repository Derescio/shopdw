'use client';
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";

const ProductImages = ({ images }: { images: string[] }) => {
    const [current, SetCurrent] = useState(0);

    return (<>
        <div className="space-y-4">
            <Image
                src={images[current]}
                alt="Product Image"
                width={500}
                height={500}
                className="object-cover object-center"
                onError={() => SetCurrent(0)}
            />
            <div className="flex gap-2">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={cn(
                            "h-16 w-16 cursor-pointer overflow-hidden rounded-md border-2 border-transparent transition-all duration-300 ease-in-out hover:border-gray-500",
                            current === index ? "border-gray-500" : ""
                        )}
                        onClick={() => SetCurrent(index)}
                    >
                        <Image
                            src={image}
                            alt="Product Image"
                            width={500}
                            height={500}
                            className="object-cover object-center"
                        />
                    </div>
                ))}
            </div>
        </div>
    </>);
}

export default ProductImages;