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
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentMethodSchema } from '@/lib/validators';
import { z } from 'zod';
import { updateUserPaymentMethod, revalidatePlaceOrder } from '@/lib/actions/user.actions';
import { PAYMENT_METHODS } from '@/lib/constatnts';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Define the type for PaymentMethod based on the schema
type PaymentMethod = z.infer<typeof paymentMethodSchema>;

const PaymentMethodEdit = ({ paymentmethod }: { paymentmethod: PaymentMethod }) => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const form = useForm<PaymentMethod>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: paymentmethod,
    });

    const handleOpenForm = () => {
        setOpen(true);
    };

    const onSubmit: SubmitHandler<PaymentMethod> = async (values) => {
        const res = await updateUserPaymentMethod(values);

        if (!res.success) {
            return toast({
                variant: 'destructive',
                description: res.message,
            });
        }

        setOpen(false);
        toast({ description: 'Payment method updated successfully' });
        await revalidatePlaceOrder();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button onClick={handleOpenForm} variant='default'>
                Edit Payment Method
            </Button>
            <DialogContent>
                <Form {...form}>
                    <DialogTitle>Update Payment Method</DialogTitle>
                    <DialogDescription>
                        <span className='text-xs font-light'>ShopDW</span>
                    </DialogDescription>
                    <form
                        method='post'
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <FormField
                            control={form.control}
                            name='type'
                            render={({ field }) => (
                                <FormItem className='space-y-3'>
                                    <FormLabel>Select Payment Method</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            className='flex flex-col space-y-2'
                                        >
                                            {PAYMENT_METHODS.map((method) => (
                                                <FormItem key={method} className='flex items-center space-x-3'>
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            value={method}
                                                            checked={field.value === method}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className='font-normal'>{method}</FormLabel>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type='submit' size='lg' className='w-full' disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentMethodEdit;
