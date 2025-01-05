import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShippingAddress } from "@/types";
import { getUserById } from "@/lib/actions/user.actions";
import ShippingDetailsForm from "./shipping-details-form";


export const metadata: Metadata = {
    title: 'Shipping Address',
    description: 'Shipping Address Page',
};


const ShippingAddressPage = async () => {
    const session = await auth();
    const user = session?.user?.id;
    if (!user) {
        redirect('/sign-in')
    };

    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) redirect('/cart');
    const userData = await getUserById(user);


    return (<>
        <ShippingDetailsForm address={userData?.address as ShippingAddress} />
    </>);
}

export default ShippingAddressPage;