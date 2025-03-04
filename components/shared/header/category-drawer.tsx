import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { getAllCategories } from "@/lib/actions/product.actions";
import { MenuIcon } from "lucide-react";
import { IoMdCloseCircle } from "react-icons/io";
import Link from "next/link";
// import Image from "next/image";
// import { APP_NAME } from "@/lib/constatnts";

const CategoryDrawer = async () => {
    const categories = await getAllCategories();
    //console.log(categories);
    return (<>
        <Drawer direction="left">
            <DrawerTrigger asChild>
                <Button variant='outline'>
                    <MenuIcon size={24} />
                </Button>

            </DrawerTrigger>
            <DrawerContent className="h-full max-w-72">
                <DrawerHeader>

                    <div className="flex  items-center mx-auto">
                        <DrawerTitle>Menu</DrawerTitle>
                        {/* <Link href='/' className='flex-start ml-4'>
                            <Image src='/images/SHOPDDWLogo.png' alt={`${APP_NAME}`} className='rounded-full '
                                width={30} height={30}
                                priority={true} />
                            <span className='hidden md:block font-bold text-2xl ml-3'>{APP_NAME}</span>
                        </Link> */}
                        <DrawerClose asChild>
                            <IoMdCloseCircle size={30} className="ml-6" />
                        </DrawerClose>
                    </div>
                    <div className="flex justify-between items-center">

                    </div>
                    <div className="space-y-1 mt-4">
                        {categories.map((x) => (
                            <Button key={x.category} variant='ghost' className='w-full' asChild>
                                <DrawerClose asChild>
                                    <Link href={`/search?category=${x.category}`}>
                                        {x.category} ({x._count})
                                    </Link>
                                </DrawerClose>
                            </Button>
                        ))}
                    </div>
                </DrawerHeader>
            </DrawerContent>

        </Drawer>
    </>);
}

export default CategoryDrawer;