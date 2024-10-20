import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Customer } from "@/types/Customer"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import customerApi from "@/services/customerApi"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    phone: z.string().min(10, {
        message: "Phone number must be at least 10 digits.",
    }),
    address: z.string(),
    total_amount: z.number(),
    remaining_amount: z.number().optional(),
    remark: z.string().optional(),
    paid_amount: z.number().optional(),
    new_payment: z.number().optional(),
    new_order_amount: z.number().optional(),
})

export default function UpdateCustomer() {
    const { slug } = useParams()
    console.log('slug:', slug)
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            address: "",
            total_amount: 0,
            remaining_amount: 0,
            remark: "",
            new_payment: 0,
            new_order_amount: 0,
            paid_amount: 0,

        },
    })

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                setIsLoading(true)
                setError("")
                const response = await customerApi.getCustomerById(slug as string)
                console.log(response)
                if (!response) {
                    throw new Error("No response from server");
                }
                const customerData = response

                // Update form values after data is fetched
                form.reset({
                    name: customerData.name,
                    phone: customerData.phone,
                    address: customerData.address,
                    total_amount: customerData.total_amount,
                    remaining_amount: customerData.remaining_amount,
                    remark: customerData.remark,
                    new_payment: 0,
                    new_order_amount: 0,
                    paid_amount: customerData.paid_amount,
                })
            } catch (error) {
                console.error('Error fetching customer:', error)
                setError("Failed to load customer data")
            } finally {
                setIsLoading(false)
            }
        }

        if (slug) {
            fetchCustomer()
        }
    }, [slug, form])

    // 2. Define a submit handler.
    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)
            setError("")

            console.log(data)

            let newData = {
                name: data.name,
                phone: data.phone,
                address: data.address,
                total_amount: data.total_amount,
                remaining_amount: data.remaining_amount,
                remark: data.remark,
                paid_amount: data.paid_amount, 
                // new_order_amount: data.new_order_amount,
            }
            
            // Calculate new remaining amount if there is a new payment
            if (data.new_payment) {
                newData.remaining_amount = (newData.remaining_amount || 0) - data.new_payment;
                newData.paid_amount = (newData.paid_amount || 0) + data.new_payment;
            }
            
            // Update total amount and remaining amount if there is a new order amount
            if (data.new_order_amount) {
                newData.total_amount = (newData.total_amount || 0) + data.new_order_amount;
                newData.remaining_amount = (newData.remaining_amount || 0) + data.new_order_amount;
            }
            
            const response = await customerApi.updateCustomer(slug as string, newData as Customer);
            if (response?.$id) {
                console.log('Customer updated successfully')
                alert("Customer updated successfully")
                navigate("/customer")
            }

        } catch (error: any) {
            console.log(error)
            if (error.response) {
                setError(error.response.data.error)
            } else {
                setError("An error occurred. Please try again.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center">Loading...</div>
    }

    return (
        <>
            <div className='min-h-screen flex flex-col justify-center items-center'>
                <h2 className="text-4xl mr-4">
                    Update Customer
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-2">
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <FormField
                                    name="name"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="">Name</FormLabel>
                                            <Input
                                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                                                {...field}
                                            />
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="phone"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="">Phone</FormLabel>
                                            <Input
                                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                                                {...field}
                                            />
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="address"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="">Address</FormLabel>
                                            <Input
                                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                                                {...field}
                                            />
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex-1">
                                <FormField
                                    name="total_amount"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="">Total Amount</FormLabel>
                                            <Input
                                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                                                type="number"
                                                {...field}
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                disabled={true}
                                            />
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="paid_amount"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="">Paid Amount</FormLabel>
                                            <Input
                                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                                                type="number"
                                                {...field}
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                disabled={true}
                                                placeholder="money paid by customer"
                                            />
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}

                                />

                                <FormField
                                    name="remaining_amount"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="">Remaining Amount</FormLabel>
                                            <Input
                                                className="bg-red-700 border-red-600 text-white placeholder-red-400 focus:border-red-500"
                                                type="number"
                                                {...field}
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                disabled={true}
                                            />
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />





                            </div>

                            <div className="flex-1">
                                <FormField
                                    name="new_payment"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="">New Payment</FormLabel>
                                            <Input
                                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                                                type="number"
                                                {...field}
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                placeholder="money paid by customer"
                                            />
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="new_order_amount"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="">New Order Amount</FormLabel>
                                            <Input
                                                className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                                                type="number"
                                                {...field}
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                placeholder="new order amount"
                                            />
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="remark"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="">Remark</FormLabel>
                                            <Input
                                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                                                {...field}
                                            />
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" disabled={isLoading} className="mt-4">
                                    {isLoading ? "Updating..." : "Update Customer"}
                                </Button>
                                {error && <p className="text-red-400">{error}</p>}
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}
