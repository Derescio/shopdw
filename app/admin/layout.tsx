import { APP_NAME } from "@/lib/constatnts";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/shared/header/menu";
import MainNav from './main-nav'
import AdminSearch from "@/components/admin/admin-search";
import { auth } from "@/auth";
import { redirect } from "next/navigation";


export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    const isAdmin = session?.user.role === 'admin';
    if (!isAdmin) {
        redirect('/');
    }
    return (
        <>
            <div className='flex flex-col mt-6'>
                <div className='border-b container mx-auto border-b-slate-700 dark:border-b-slate-400'>
                    <div className='flex h-16 items-center px-4'>
                        <Link href="/" className='w-22'>
                            <Image src={"/images/SHOPDDWLogo.png"} width={64} height={64} alt={APP_NAME} className="rounded-full mb-6" />
                        </Link>

                        <MainNav className='mx-6' />

                        <div className="ml-auto items-center flex space-x-4 ">
                            <AdminSearch />
                            <Menu />
                        </div>
                    </div>
                </div>
                <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
                    {children}
                </div>
            </div>
        </>
    );
}
