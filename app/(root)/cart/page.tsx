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
        <DeleteCart />
    </>);
}

export default CartPage;