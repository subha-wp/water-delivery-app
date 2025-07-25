import { getCurrentUser } from "@/lib/auth"
import { AuthForm } from "@/components/auth-form"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const user = await getCurrentUser()

  // If no user is found, show the auth form
  if (!user) {
    return <AuthForm />
  }

  // If user exists, redirect to appropriate dashboard
  if (user.role === "customer") {
    redirect("/customer")
  } else if (user.role === "delivery_assistant") {
    redirect("/assistant")
  } else {
    // If role is invalid, clear session and show auth form
    return <AuthForm />
  }
}
