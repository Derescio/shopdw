import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toglle";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";


const Menu = () => {
    return (
        <>
            <div className="flex justify-end gap-3">

                {/* //This navigation is hidden on mobile view and displayed on desktop view. */}
                {/* //This nav is responsible for the cart and user icon as well as the theme toggle. */}
                <nav className="hidden md:flex w-ful max-w-xs gap-1">
                    <ModeToggle />
                    <Button asChild variant='outline' >
                        <Link href='/cart'>
                            <ShoppingCart size={24} /> Cart
                        </Link>
                    </Button>
                    <Button asChild variant='default' >
                        <Link href='/sign-in'>
                            <UserIcon size={24} /> Sign-in
                        </Link>
                    </Button>
                </nav>
                {/* //This navigation is hidden on desktop view and displayed on mobile view. */}
                {/* //This nav is responsible for the cart and user icon as well as the theme toggle. */}
                <nav className="md:hidden">
                    <Button asChild variant='outline' >
                        <Sheet>
                            Open
                            <span className="sr-only">Open Menu</span>
                            <SheetTrigger className="align-middle">

                                <EllipsisVertical size={24} />

                            </SheetTrigger>
                            <SheetContent className=" flex flex-col items-start">
                                <SheetTitle className="text-center">Menu</SheetTitle>
                                <ModeToggle />
                                <Button asChild variant='outline' >
                                    <Link href='/cart'>
                                        <ShoppingCart size={24} /> Cart
                                    </Link>
                                </Button>
                                <Button asChild variant='default' >
                                    <Link href='/sign-in'>
                                        <UserIcon size={24} /> Sign-in
                                    </Link>
                                </Button>
                                <SheetDescription></SheetDescription>
                            </SheetContent>

                        </Sheet>
                    </Button>
                </nav>
            </div>
        </>
    );
}

export default Menu;

//Component Description:
//This is the Menu component. It is used to display the menu on the header.
//It uses the Button component from the shadcn/ui library to display the menu icon.
//It uses the Sheet component from the shadcn/ui library to display the menu.
//It uses the Link component from the next/link library to display the links.
//It uses the ModeToggle component to display
//It has two nav elements, one for desktop view and one for mobile view.
//It is used in the Header(index.tsx) component to toggle the theme of the application.