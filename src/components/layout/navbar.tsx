'use client'

import { Bookmark as BookmarkIcon } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserMenu } from '@/components/auth/user-menu'
import { useUser } from '@/hooks/use-user'

export function Navbar() {
  const { user } = useUser()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center space-x-2">
          <BookmarkIcon className="h-6 w-6" />
          <span className="text-xl font-bold">Smart Bookmark</span>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {user && <UserMenu />}
        </div>
      </div>
    </nav>
  )
}
