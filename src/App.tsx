import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Badge variant="secondary" className="px-3 py-1">v1.0.0 Alpha</Badge>
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
          Pixora with Tailwind + TS
        </h1>
      </div>
      <div className="flex gap-4">
        <Button size="lg" className="rounded-full px-8 underline-offset-4">Get Started</Button>
        <Button variant="outline" size="lg" className="rounded-full px-8">Learn More</Button>
      </div>
    </div>
  )
}

export default App
