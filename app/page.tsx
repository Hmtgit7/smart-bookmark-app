import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Smart Bookmark App</h1>
        <p className="text-muted-foreground">Theme switching is working!</p>
        <ThemeToggle />
      </div>
    </div>
  )
}
