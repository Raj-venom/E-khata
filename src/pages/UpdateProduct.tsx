import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Product } from "@/types/Inventory";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import productApi from "@/services/inventoryApi";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    price: z.number().min(0, {
        message: "Price must be a positive number.",
    }),
    description: z.string().optional(),
    stock: z.number().min(0, {
        message: "Stock must be a positive number.",
    }),
   
});

export default function UpdateProduct() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
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

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                setError("");
                const response = await productApi.getProductById(slug as string);
                if (!response) {
                    throw new Error("No response from server");
                }
                const productData = response;

                form.reset({
                    name: productData.name,
                    price: productData.price,
                    description: productData.description,
                    stock: productData.stock,
                });
            } catch (error) {
                console.error('Error fetching product:', error);
                setError("Failed to load product data");
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) {
            fetchProduct();
        }
    }, [slug, form]);

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            setError("");

            const response = await productApi.updateProduct(slug as string, data as Product);
            if (response?.$id) {
                alert("Product updated successfully");
                navigate("/inventory");
            }
        } catch (error: any) {
            console.log(error);
            if (error.response) {
                setError(error.response.data.error);
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    }

    return (
        <div className='min-h-screen flex flex-col justify-center items-center'>
            <h2 className="text-4xl mr-4">
                Update Product
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
                                        <FormLabel>Name</FormLabel>
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
                                        <FormLabel>Price</FormLabel>
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
                                        <FormLabel>Description</FormLabel>
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
                                name="stock"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock</FormLabel>
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

                            <Button type="submit" disabled={isLoading} className="mt-4">
                                {isLoading ? "Updating..." : "Update Product"}
                            </Button>
                            {error && <p className="text-red-400">{error}</p>}
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}