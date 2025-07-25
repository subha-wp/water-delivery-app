import { getCurrentUser } from "@/lib/auth"
import { AssistantDashboard } from "@/components/assistant-dashboard"
import { redirect } from "next/navigation"

export default async function AssistantPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  if (user.role !== "delivery_assistant") {
    redirect("/")
  }

  return <AssistantDashboard user={user} />
}
