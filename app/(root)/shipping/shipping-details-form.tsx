'use client';
import { ShippingAddress } from "@/types/index";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateUserAddress } from "@/lib/actions/user.actions";
import { ArrowRight, Loader } from 'lucide-react';
import { shippingAddressSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { ControllerRenderProps } from 'react-hook-form';
import { z } from "zod";
import { shippingAddressDefaultValues } from "@/lib/constatnts";




const ShippingDetailsForm = ({ address }: { address: ShippingAddress }) => {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof shippingAddressSchema>>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: address || shippingAddressDefaultValues,
    });
    const [isPending, startTransition] = useTransition();
    const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = (values) => {
        startTransition(async () => {
            const res = await updateUserAddress(values);
            if (res.success) {
                toast({
                    title: 'Success',
                    description: 'Shipping address updated successfully',
                    variant: 'default',
                    duration: 1500,
                });
                router.push('/payment-method');
            } else {
                toast({
                    title: 'Error',
                    description: res.message,
                    variant: 'destructive',
                });
                return
            }
        });
    }

    return (<>
        <div className="max-w-md mx-auto space-y-4">
            <h1 className="h2 bold mt-4">Shippping Address</h1>
            <p className="text-sm text-muted-foreground">Please enter your shipping address</p>
            <Form {...form}>
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

                    <div className='flex gap-2'>
                        <Button type='submit' disabled={isPending}>
                            {isPending ? (
                                <Loader className='animate-spin w-4 h-4' />
                            ) : (
                                <ArrowRight className='w-4 h-4' />
                            )}
                            Continue
                        </Button>
                    </div>
                </form>
            </Form  >
        </div>
    </>);
}

export default ShippingDetailsForm;