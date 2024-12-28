import { cn } from "@/lib/utils";
const ProductPrice = ({ value, className }: { value: number, className?: string }) => {
    //Ensure two decimal places
    const formattedValue = value.toFixed(2);
    // const formattedValueWithCommas = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //Get the INT and FLOAT values of each item`s price
    const [int, float] = formattedValue.split(".");

    return (<>
        <p className={cn("text-2xl font-bold", className)}>
            <span className="text-xs align-super">$</span>
            {int}
            <span className="text-xs align-super">.{float}</span>
        </p>

    </>);
}

export default ProductPrice;

// Component Description:
// The component is used in the product-card component and the product-list component.
//This component is used to display the price of a product. The display is a special  format, where
// the dollar sign and decimal places are both displayed very small whilst the integer amount is bigger.
// It takes two parameters, the value of the price and a className to apply to the price if needed.
