'use client'
import { useRouter } from "next/navigation";
import { ControllerFieldState, ControllerRenderProps, FieldValues, SubmitHandler, useForm, UseFormStateReturn } from "react-hook-form";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { productDefaultValues } from "@/lib/constatnts";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import slugify from "slugify";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { Button } from "../ui/button";
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";


const ProductForm = ({ type, product, productId }: { type: 'create' | 'update', product?: Product, productId?: string }) => {


    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof insertProductSchema>>({
        resolver: type === 'update' ? zodResolver(updateProductSchema) : zodResolver(insertProductSchema),
        defaultValues: type === 'update' ? product : productDefaultValues,
    });

    const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
        values
    ) => {
        if (type === 'create') {
            const res = await createProduct(values);

            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message,
                });
            } else {
                toast({
                    description: res.message,
                });
                router.push(`/admin/products`);
            }
        }
        if (type === 'update') {
            if (!productId) {
                router.push(`/admin/products`);
                return;
            }

            const res = await updateProduct({ ...values, id: productId });

            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message,
                });
            } else {
                router.push(`/admin/products`);
            }
        }
    };

    const images = form.watch('images');
    const isFeatured = form.watch('isFeatured');
    const banner = form.watch('banner');


    return (<>
        <Form {...form}>
            <form className='space-y-8' method='post' onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-5 md:flex-row'>
                    {/* Name */}
                    <FormField
                        control={form.control}
                        name='name'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'name'>;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter product name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Slug */}
                    <FormField
                        control={form.control}
                        name='slug'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'slug'>;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <div className='relative'>
                                        <Input
                                            placeholder='Enter product slug'
                                            className='pl-8'
                                            {...field}
                                        />
                                        <Button
                                            type='button'
                                            className='bg-gray-700 text-white px-4 py-1 mt-2 hover:bg-gray-600'
                                            onClick={() => {
                                                form.setValue('slug', slugify(form.getValues('name'), { lower: true }));
                                            }}
                                        >
                                            Generate
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='flex flex-col gap-5 md:flex-row'>
                    {/* Category */}
                    <FormField
                        control={form.control}
                        name='category'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'category'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter category' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Brand */}
                    <FormField
                        control={form.control}
                        name='brand'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'brand'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Brand</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter product brand' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>
                <div className='flex flex-col gap-5 md:flex-row'>
                    {/* Price */}
                    <FormField
                        control={form.control}
                        name='price'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'price'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter product price' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Stock */}
                    <FormField
                        control={form.control}
                        name='stock'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'stock'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input type='number' placeholder='Enter product stock' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5 md:flex-row'>
                    {/* Price */}
                    <FormField
                        control={form.control}
                        name='sku'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'sku'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>SKU</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter product Sku' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Stock */}
                    <FormField
                        control={form.control}
                        name='costPrice'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'costPrice'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Cost Price</FormLabel>
                                <FormControl>
                                    <Input type='number' placeholder='Enter product stock' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='upload-field flex flex-col gap-5 md:flex-row'>
                    <FormField
                        control={form.control}
                        name='images'
                        render={() => (
                            <FormItem className='w-full'>
                                <FormLabel>Images</FormLabel>
                                <Card>
                                    <CardContent className='space-y-2 mt-2 min-h-48'>
                                        <div className='flex-start space-x-2'>
                                            {images.map((image: string) => (
                                                <Image
                                                    key={image}
                                                    src={image}
                                                    alt='product image'
                                                    className='w-20 h-20 object-cover object-center rounded-sm'
                                                    width={100}
                                                    height={100}
                                                />
                                            ))}
                                            <FormControl>
                                                <UploadButton
                                                    endpoint='imageUploader'
                                                    onClientUploadComplete={(res: { url: string }[]) => {
                                                        form.setValue('images', [...images, res[0].url]);
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                        toast({
                                                            variant: 'destructive',
                                                            description: `ERROR! ${error.message}`,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </div>
                                    </CardContent>
                                </Card>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='upload-field'>
                    {/* Is Featured */}
                    Featured Product
                    <Card>
                        <CardContent className='space-y-2 mt-2'>
                            <FormField
                                control={form.control}
                                name='isFeatured'
                                render={({ field }) => (
                                    <FormItem className='space-x-2 items-center'>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel>Is Featured?</FormLabel>
                                    </FormItem>
                                )}
                            />
                            {isFeatured && banner && (
                                <Image
                                    src={banner}
                                    alt='banner image'
                                    className=' w-full object-cover object-center rounded-sm'
                                    width={1920}
                                    height={680}
                                />
                            )}
                            {isFeatured && !banner && (
                                <UploadButton
                                    endpoint='imageUploader'
                                    onClientUploadComplete={(res: { url: string }[]) => {
                                        form.setValue('banner', res[0].url);
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast({
                                            variant: 'destructive',
                                            description: `ERROR! ${error.message}`,
                                        });
                                    }}
                                />
                            )}
                        </CardContent>
                    </Card>


                </div>
                <div> <FormField
                    control={form.control}
                    name='description'
                    render={({
                        field,
                    }: {
                        field: ControllerRenderProps<
                            z.infer<typeof insertProductSchema>,
                            'description'
                        >;
                    }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder='Enter product description'
                                    className='resize-none'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /></div>
                <div>
                    {/* Submit */}
                    <div className='flex justify-end'>
                        <Button
                            type='submit'
                            className='bg-primary text-white px-4 py-2 hover:bg-primary-dark '
                            disabled={form.formState.isSubmitting}
                        >
                            {type === 'create' ? 'Create' : 'Update'}
                        </Button>
                    </div>


                </div>
            </form>
        </Form>
    </>);
}

export default ProductForm;