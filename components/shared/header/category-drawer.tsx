import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { getAllCategories } from "@/lib/actions/product.actions";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

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
            <DrawerContent className="h-full max-w-sm">
                <DrawerHeader>
                    <DrawerTitle>Categories</DrawerTitle>
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