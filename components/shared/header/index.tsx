import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constatnts';
import Menu from './menu';
import CategoryDrawer from './category-drawer';
import Search from "@/components/shared/header/search";


const Header = () => {
    return <header className='w-full border-b'>
        <div className="wrapper flex-between">
            <div className="flex-start">
                <CategoryDrawer />
                <Link href='/' className='flex-start ml-4'>

                    <Image src='/images/SHOPDDWLogo.png' alt={`${APP_NAME}`} className='rounded-full'
                        width={100} height={100}
                        priority={true} />
                    <span className='hidden md:block font-bold text-2xl ml-3'>{APP_NAME}</span>
                </Link>
            </div>
            {/* To Decide Whether to show the cart and user icon in mobile view or Just the APP_NAME */}
            {/* <span className='xs:block  md:hidden font-bold text-2xl ml-3'>{APP_NAME}</span> */}

            <div className="hidden md:block">
                <Search />
            </div>
            <Menu />

        </div>
    </header>;
}

export default Header;