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
import { useEffect, useState } from "react"

import axios from "axios"
// import { Party } from "@/types/Party"
import { useParams } from "react-router-dom"
import { useNavigate } from 'react-router-dom'

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
})

export default function UpdateParty() {
    const { slug } = useParams()
    // const [party, setParty] = useState<Party | null>(null)
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
            alternate_phone: "",
        },
    })

    useEffect(() => {
        const fetchParty = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get(`/api/party/details/${slug}`)
                const partyData = response.data

                // Update form values after data is fetched
                form.reset({
                    name: partyData.name,
                    phone: partyData.phone,
                    address: partyData.address,
                    total_amount: partyData.total_amount,
                    remaining_amount: partyData.remaining_amount,
                    remark: partyData.remark,
                })
            } catch (error) {
                console.error('Error fetching party:', error)
                setError("Failed to load party data")
            } finally {
                setIsLoading(false)
            }
        }

        if (slug) {
            fetchParty()
        }
    }, [slug, form.reset])

    // 2. Define a submit handler.
    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)
            setError("")

            console.log(data)

            const response = await axios.post(`/api/party/update/${slug}`, data)

            if (response.data) {
                console.log('Party updated successfully')
                alert("Party updated successfully")
                navigate("/party")
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
                    Update Party
                </h2>

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
                            name="remaining_amount"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">Remaining Amount</FormLabel>
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

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Party"}
                        </Button>
                        {error && <p className="text-red-400">{error}</p>}
                    </form>
                </Form>
            </div>
        </>
    )
}
