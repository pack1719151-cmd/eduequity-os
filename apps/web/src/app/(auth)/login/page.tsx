"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, ControllerRenderProps, ControllerFieldState, UseFormStateReturn, FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { authApi } from "@/lib/api-client"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      await authApi.login(data.email, data.password)
      
      // Get user role from cookie for redirect
      const roleCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user_role='))
        ?.split('=')[1]
      
      const dashboardRoutes: Record<string, string> = {
        student: "/dashboard/student",
        teacher: "/dashboard/teacher",
        principal: "/dashboard/principal",
      }
      
      const redirectUrl = dashboardRoutes[roleCookie || ''] || "/dashboard"
      router.push(redirectUrl)
      router.refresh()
    } catch (err) {
      // Show actual backend error message
      const axiosError = err as { response?: { data?: { detail?: string } }; message?: string }
      const backendError = axiosError.response?.data?.detail || axiosError.message || "Invalid email or password"
      setError(backendError)
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <FormField
                control={form.control}
                name="email"
                render={(props: { field: ControllerRenderProps<LoginFormValues, "email">; fieldState: ControllerFieldState; formState: UseFormStateReturn<LoginFormValues> }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        disabled={isLoading}
                        {...props.field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={(props: { field: ControllerRenderProps<LoginFormValues, "password">; fieldState: ControllerFieldState; formState: UseFormStateReturn<LoginFormValues> }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        disabled={isLoading}
                        {...props.field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Do not have an account?{" "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Create one
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

