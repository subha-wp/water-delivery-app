import { getCurrentUser } from "@/lib/auth"
import { CustomerDashboard } from "@/components/customer-dashboard"
import { redirect } from "next/navigation"

export default async function CustomerPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  if (user.role !== "customer") {
    redirect("/")
  }

  return <CustomerDashboard user={user} />
}
