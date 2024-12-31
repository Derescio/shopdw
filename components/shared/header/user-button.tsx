import { auth } from "@/auth";
import Link from "next/link";
import { signOutUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const UserButton = async () => {

    const session = await auth();

    if (!session) return (
        <Button asChild variant='default' >
            <Link href='/sign-in'>
                <UserIcon size={24} /> Sign-in
            </Link>
        </Button>
    );

    const firstName = session?.user?.name?.charAt(0).toUpperCase() ?? 'U';

    return (<>
        <div className='flex gap-2 items-center'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className='flex items-center'>
                        <Button
                            variant='ghost'
                            className='relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-300'
                        >
                            {firstName}
                        </Button>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end' forceMount>
                    <DropdownMenuLabel className='font-normal'>
                        <div className='flex flex-col space-y-1'>
                            <p className='text-sm font-medium leading-none'>
                                {session.user?.name}
                            </p>
                            <p className='text-xs leading-none text-muted-foreground'>
                                {session.user?.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuItem className='p-0 mb-1'>
                        <form action={signOutUser} className='w-full'>
                            <Button
                                className='w-full py-4 px-2 h-4 justify-start'
                                variant='ghost'
                            >
                                Sign Out
                            </Button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

    </>);
}

export default UserButton;