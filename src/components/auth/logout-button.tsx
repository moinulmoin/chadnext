"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const onLogout = async () => {
    setIsPending(true)
    try {
      await authClient.signOut()
      router.push("/login")
      router.refresh()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button variant="ghost" onClick={onLogout} disabled={isPending}>
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  )
}
