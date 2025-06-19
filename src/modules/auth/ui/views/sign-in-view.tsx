"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle } from "@/components/ui/alert";
import { 
    Form,  
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
    email: z.string().email("Invalid email address"),   
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const SignInView = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setError(null);
        setPending(true);

        const { error } = await authClient.signIn.email({
            email: data.email,
            password: data.password,
        }, {
            onSuccess: () => {
                setPending(false);
                router.push("/");
            },
            onError: (error) => {
                setError(error.error.message);
            }
        });
    };

    const onSocial = (provider: "github" | "google") => {
            setError(null);
            setPending(true);
    
            authClient.signIn.social({
                provider: provider,
                callbackURL: "/",
            }, {
                onSuccess: () => {
                    setPending(false);
                },
                onError: (error) => {
                    setError(error.error.message);
                }
            });
        };

    return (
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">
                                        Welcome back
                                    </h1>
                                    <p className="text-muted-foreground text-balance">
                                        Login to your account
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    <FormField 
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="Enter your email" 
                                                        {...field} 
                                                        type="email" 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <FormField 
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="********" 
                                                        {...field} 
                                                        type="password" 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {!!error && (
                                    <Alert className="bg-destructive/10 border-none">
                                        <OctagonAlertIcon className="h-4 w-4 mr-2 !text-destructive" />
                                        <AlertTitle className="text-sm">
                                            Error
                                        </AlertTitle>
                                    </Alert>
                                )}
                                <Button disabled={pending} type="submit" className="w-full" >
                                    Sign in
                                </Button>
                                <div className="after:border-border relative text-center text-sm after:avsolute after:insert-0 after:top-1/2 after:flex after: items-center after: border-t">
                                    <span className="bg-card px-2 text-muted-foreground relative z-10">
                                        Or continue with
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button disabled={pending} variant="outline" className="w-full" type="button"
                                        onClick = {() => onSocial("google")}
                                    >
                                        <FaGoogle />
                                        Google
                                    </Button>
                                    <Button disabled={pending} variant="outline" className="w-full" type="button"
                                        onClick = {() => onSocial("github")}
                                    >
                                        <FaGithub />
                                        GitHub
                                    </Button>
                                    
                                </div>
                                <div className="text-center text-sm"> 
                                        Don&apos;t have an account?{" "} 
                                        <Link href="/sign-up" className="underline underline-offset-4">
                                            Sign up
                                        </Link>
                                    </div>
                            </div>
                        </form>
                    </Form>
                    <div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                        <img src="/logo.svg" alt="Image" className="h-[92px] w-[92px]"/>
                        <p className="text-2xl font-semibold text-white">
                            Meet.AI
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clinking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </div>
        </div>    
    )
}