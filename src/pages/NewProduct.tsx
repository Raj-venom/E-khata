import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import productApi from "@/services/inventoryApi";
import { Product } from "@/types/Inventory";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    price: z.number().min(0, {
        message: "Price must be a positive number.",
    }),
    description: z.string().optional(),
    stock: z.number().min(0, {
        message: "Stock must be a non-negative number.",
    }),
});

export default function NewProduct() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            price: 0,
            description: "",
            stock: 0,
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            setError("");

            const response = await productApi.addProduct(data as Product);

            if (response?.$id) {
                console.log('Product created');
                navigate('/inventory');
            }

        } catch (error: any) {
            console.log(error);
            if (error.response) {
                setError(error.response.data.error);
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen flex flex-col justify-center items-center'>
            <h2 className="text-4xl mr-4">New Product</h2>

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
                        name="price"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">Price</FormLabel>
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
                        name="description"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">Description</FormLabel>
                                <Input
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                                    {...field}
                                />
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="stock"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">Stock</FormLabel>
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

                    <Button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Product"}
                    </Button>
                    {error && <p className="text-red-400">{error}</p>}
                </form>
            </Form>
        </div>
    );
}