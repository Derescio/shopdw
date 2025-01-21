'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { USER_ROLES } from '@/lib/constatnts';
import { updateUserProfileSchema } from '@/lib/validators';
import { ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateUser } from '@/lib/actions/user.actions';

const UpdateUserForm = ({
    user,
}: {
    user: z.infer<typeof updateUserProfileSchema>;
}) => {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof updateUserProfileSchema>>({
        resolver: zodResolver(updateUserProfileSchema),
        defaultValues: user,
    });


    const onSubmit = async (values: z.infer<typeof updateUserProfileSchema>) => {
        try {
            const res = await updateUser({
                ...values,
                id: user.id,
            });

            if (!res.success)
                return toast({
                    variant: 'destructive',
                    description: res.message,
                });

            toast({
                description: res.message,
            });

            form.reset();
            router.push(`/admin/users`);
        } catch (error) {
            toast({
                variant: 'destructive',
                description: (error as Error).message,
            });
        }
    };

    return (
        <Form {...form}>
            <form
                method='post'
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
            >
                <div>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<z.infer<typeof updateUserProfileSchema>, 'email'>;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input disabled={true} placeholder='Enter user email' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<z.infer<typeof updateUserProfileSchema>, 'name'>;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter user name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div>
                    <FormField
                        control={form.control}
                        name='role'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<z.infer<typeof updateUserProfileSchema>, 'role'>;
                        }) => (
                            <FormItem className=' items-center'>
                                <FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select a role' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {USER_ROLES.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='flex-between'>
                    <Button
                        type='submit'
                        className='w-full'
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? 'Submitting...' : `Update User `}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default UpdateUserForm;