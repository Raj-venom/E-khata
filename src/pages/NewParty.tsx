import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import partyApi from "@/services/partyApi"
import { Party } from "@/types/Party"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    phone: z.string().min(10, {
        message: "Phone number must be at least 10 digits.",
    }),
    alternate_phone: z.string().optional(),
    address: z.string(),
    total_amount: z.number(),
    remaining_amount: z.number().optional(),
    remark: z.string().optional(),
    paid_amount: z.number().optional(),
})

export default function NewParty() {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            address: "",
            total_amount: 0,
            remaining_amount: 0,
            remark: "",
            alternate_phone: "",
            paid_amount: 0,
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            setLoading(true)
            setError("")

            // console.log(data)
            const newData = {
                ...data,
                remaining_amount: data.total_amount - (data.paid_amount || 0)
            }

            const response = await partyApi.createParty(newData as Party)

            if (response?.$id) {
                console.log('party created')
                navigate('/party')
            }

        } catch (error: any) {
            console.log(error)
            if (error.response) {
                setError(error.response.data.error)
            } else {
                setError("An error occurred. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className='min-h-screen flex flex-col justify-center items-center'>
                <h2 className="text-4xl mr-4">New Party</h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-2">
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
                                    />
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}

                        />

                        <FormField
                            name="alternate_phone"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">Alter Phone</FormLabel>
                                    <Input
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                                        {...field}
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

                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Party"}
                        </Button>
                        {error && <p className="text-red-400">{error}</p>}
                    </form>
                </Form>
            </div>
        </>
    )
}
