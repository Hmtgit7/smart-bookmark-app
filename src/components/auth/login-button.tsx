'use client'

import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/use-user'
import { Chrome } from 'lucide-react'

export function LoginButton() {
  const { signInWithGoogle } = useUser()

  return (
    <Button
      onClick={signInWithGoogle}
      size="lg"
      className="bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 shadow-lg"
    >
      <Chrome className="mr-2 h-5 w-5" />
      Sign in with Google
    </Button>
  )
}
