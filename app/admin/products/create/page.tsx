import { Metadata } from "next";
import ProductForm from "@/components/admin/product-form";


export const metadata: Metadata = {
    title: 'Create Product',
    description: 'Create Product',
}


const CreateProductPage = () => {


    return (<>
        <h2 className="h2-bold">
            Create Products Page
        </h2>
        <div className="my-8">
            <ProductForm type="create" />
        </div>

    </>);
}

export default CreateProductPage;