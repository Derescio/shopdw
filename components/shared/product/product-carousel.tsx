'use client'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Product } from "@/types";
import Autoplay from 'embla-carousel-autoplay'
import Link from "next/link";
import Image from "next/image";


const ProductCarousel = ({ data }: { data: Product[] }) => {
    return (<>
        <Carousel className="w-full " opts={{ loop: true }} plugins={[
            Autoplay({
                delay: 4000,
                stopOnMouseEnter: true,
                stopOnInteraction: true,
            })
        ]}>
            <CarouselContent>
                {data.map((product: Product) => (
                    <CarouselItem key={product.id} className="w-full md:h-96 lg:h-92">
                        <Link href={`/product/${product.slug}`}>
                            <div className="relative mx-auto">
                                <Image alt={product.name} src={product.banner!} height='0' width='0' sizes="100vw" className="w-full h-auto" />
                                <div className="absolute inset-0 flex items-end  justify-center">
                                    <div className="bg-white p-1 rounded-lg">
                                        <h1 className="text-sm font-bold bg-opacity-70 ">{product.name}</h1>

                                    </div>
                                </div>
                            </div>
                        </Link>

                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />

        </Carousel>

    </>);
}

export default ProductCarousel;