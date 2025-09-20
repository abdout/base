"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "../validation";
import { login } from "./action";
import { FormError } from "../error/form-error";
import { FormSuccess } from "../form-success";
import { Social } from "../social";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  dictionary: any;
}

export const LoginForm = ({
  dictionary,
  className,
  ...props
}: LoginFormProps) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? dictionary?.auth?.errors?.emailInUseProvider || "Email already in use with different provider!"
    : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }
          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }
          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError(dictionary?.auth?.errors?.somethingWrong || "Something went wrong"));
    });
  };

  return (
    <div className={cn("flex flex-col gap-6 min-w-[200px] md:min-w-[350px]", className)} {...props}>
      <Card className="border-none shadow-none bg-background">
        <CardHeader className="text-center">
        </CardHeader>
        <CardContent>
          <Social dictionary={dictionary} />
        </CardContent>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  {dictionary?.auth?.orContinueWith || "Or continue with"}
                </span>
              </div>

              <div className="grid gap-4">
                {showTwoFactor && (
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-1">
                            <label className="flex justify-between items-center">
                              <p className="text-sm">{dictionary?.auth?.twoFactorCode || "Two Factor Code"}</p>
                            </label>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="123456"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {!showTwoFactor && (
                  <>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="space-y-1">
                              <label className="flex justify-between items-center">
                                <p className="text-sm">{dictionary?.auth?.email || "Email"}</p>
                              </label>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder={dictionary?.auth?.enterEmail || "Enter your email"}
                                type="email"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="space-y-1">
                              <label className="flex justify-between items-center">
                                <p className="text-sm">{dictionary?.auth?.password || "Password"}</p>
                                <Link
                                  href="/reset"
                                  className="text-sm font-normal text-muted-foreground hover:text-foreground"
                                >
                                  {dictionary?.auth?.forgotPassword || "Forgot password?"}
                                </Link>
                              </label>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder={dictionary?.auth?.enterPassword || "Enter your password"}
                                type="password"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>

              <FormError message={error || urlError} />
              <FormSuccess message={success} />

              <Button disabled={isPending} type="submit" className="w-full">
                {showTwoFactor
                  ? (dictionary?.auth?.confirm || "Confirm")
                  : (dictionary?.auth?.login || "Login")
                }
              </Button>

              <div className="text-center text-sm">
                {dictionary?.auth?.dontHaveAccount || "Don't have an account?"}
                {" "}
                <Link href="/register" className="text-primary hover:underline">
                  {dictionary?.auth?.signUp || "Sign Up"}
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};