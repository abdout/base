"use client"

import { Icons } from "@/components/atom/icons"
import type { getDictionary } from "@/components/local/dictionaries"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CardsCreateAccountProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

export function CardsCreateAccount({ dictionary }: CardsCreateAccountProps) {
  return (
    <Card className="shadow-none border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{dictionary?.cards?.createAccount?.title || "Create an account"}</CardTitle>
        <CardDescription>
          {dictionary?.cards?.createAccount?.description || "Enter your email below to create your account"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6 rtl:space-x-reverse">
          <Button variant="outline">
            <Icons.gitHub />
            {dictionary?.cards?.createAccount?.github || "GitHub"}
          </Button>
          <Button variant="outline">
            <Icons.google />
            {dictionary?.cards?.createAccount?.google || "Google"}
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              {dictionary?.cards?.createAccount?.orContinue || "Or continue with"}
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">{dictionary?.cards?.createAccount?.email || "Email"}</Label>
          <Input id="email" type="email" placeholder={dictionary?.cards?.createAccount?.emailPlaceholder || "m@example.com"} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">{dictionary?.cards?.createAccount?.password || "Password"}</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">{dictionary?.cards?.createAccount?.createButton || "Create account"}</Button>
      </CardFooter>
    </Card>
  )
}
