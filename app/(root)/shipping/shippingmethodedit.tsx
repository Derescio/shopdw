'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm, SubmitHandler, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shippingAddressSchema } from "@/lib/validators";
import { z } from 'zod';
import { revalidatePlaceOrder, updateUserAddress } from "@/lib/actions/user.actions";
import { shippingAddressDefaultValues } from "@/lib/constatnts";
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';


type ShippingMethod = z.infer<typeof shippingAddressSchema>

const ShippingMethodEdit = ({ address }: { address: ShippingMethod; }) => {

    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const form = useForm<ShippingMethod>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: shippingAddressDefaultValues,
    });

    const handleOpenForm = async () => {
        form.setValue('fullName', address.fullName);
        form.setValue('streetAddress', address.streetAddress);
        form.setValue('city', address.city);
        form.setValue('country', address.country);
        form.setValue('postalCode', address.postalCode);
        setOpen(true);

    }
    const onSubmit: SubmitHandler<ShippingMethod> = async () => {
        const res = await updateUserAddress({
            fullName: form.getValues('fullName'),
            streetAddress: form.getValues('streetAddress'),
            city: form.getValues('city'),
            country: form.getValues('country'),
            postalCode: form.getValues('postalCode'),
        });

        if (!res.success) {
            return toast({
                variant: 'destructive',
                description: res.message,
            });
        }

        setOpen(false);
        toast({ description: 'Shipping method updated successfully' });
        await revalidatePlaceOrder()
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button onClick={handleOpenForm} variant='default'>
                Edit Shipping Method
            </Button>
            <DialogContent>
                <Form {...form}>
                    <DialogTitle>Update Shipping Details.</DialogTitle>
                    <DialogDescription>
                        <span className='text-xs font-light'>ShopDW</span>
                    </DialogDescription>
                    <form
                        method='post'
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        {/* Full Name */}
                        <div className='flex flex-col gap-5 md:flex-row'>
                            <FormField
                                control={form.control}
                                name='fullName'
                                render={({
                                    field,
                                }: {
                                    field: ControllerRenderProps<
                                        z.infer<typeof shippingAddressSchema>,
                                        'fullName'
                                    >;
                                }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter full name' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Street Address */}
                        <div>
                            <FormField
                                control={form.control}
                                name='streetAddress'
                                render={({
                                    field,
                                }: {
                                    field: ControllerRenderProps<
                                        z.infer<typeof shippingAddressSchema>,
                                        'streetAddress'
                                    >;
                                }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter address' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* City */}
                        <div className='flex flex-col gap-5 md:flex-row'>
                            <FormField
                                control={form.control}
                                name='city'
                                render={({
                                    field,
                                }: {
                                    field: ControllerRenderProps<
                                        z.infer<typeof shippingAddressSchema>,
                                        'city'
                                    >;
                                }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter city' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='country'
                                render={({
                                    field,
                                }: {
                                    field: ControllerRenderProps<
                                        z.infer<typeof shippingAddressSchema>,
                                        'country'
                                    >;
                                }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter country' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='postalCode'
                                render={({
                                    field,
                                }: {
                                    field: ControllerRenderProps<
                                        z.infer<typeof shippingAddressSchema>,
                                        'postalCode'
                                    >;
                                }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Postal Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter postal code' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type='submit'
                                size='lg'
                                className='w-full'
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ShippingMethodEdit;
