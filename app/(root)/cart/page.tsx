import CartTable from "./cart-table";
import { getMyCart } from "@/lib/actions/cart.actions";
import DeleteCart from "@/components/shared/delete-Cart";


export const metadata = {
    title: 'Shopping Cart',
    description: 'Cart Page',
}

const CartPage = async () => {

    const cart = await getMyCart();

    return (<>
        <CartTable cart={cart} />
        {/* Disable DeleteCart is cart variable is undefined or null */}
        {cart?.items.length === 0 || cart === undefined ? (
            <div className="flex justify-center mt-10 display:none">

            </div>
        ) : (<div className="flex justify-center mt-10 display:block">
            <DeleteCart />
        </div>)}

        {/* <DeleteCart /> */}
    </>);
}

export default CartPage;