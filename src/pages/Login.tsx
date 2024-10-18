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
import authService from "@/services/auth"

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    })
})

export default function Login() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "admin@gmai.com",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(data: z.infer<typeof formSchema>) {

        try {
            setLoading(true)
            setError("")

            const response = await authService.login(data.email, data.password)

            if (response) {
                console.log('logged in ')
                navigate('/dashboard')
            }


        } catch (error: any) {
            console.log(error)
            setError(error.message)
        } finally {
            setLoading(false)
            // setError("")
        }
    }

    return (
        <div className='min-h-screen flex flex-col justify-center items-center'>

            <h2 className="text-4xl mr-4">Login Page</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-2">

                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">Username</FormLabel>
                                <Input
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                                    {...field}
                                />
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">Password</FormLabel>
                                <Input
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                                    type="password"
                                    placeholder="password"
                                    {...field}
                                />
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    {loading ? (<Button type="submit" disabled>Loading...</Button>) : (<Button type="submit">Login</Button>)}
                    {error && <p className="text-red-400">{error}</p>}
                </form>
            </Form>

        </div>
    )
}
