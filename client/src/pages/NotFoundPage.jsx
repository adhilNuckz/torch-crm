import { Button } from '../components/ui/button.jsx'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted/40 px-4 text-center">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-sm text-muted-foreground">The page you are looking for does not exist.</p>
      <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
    </div>
  )
}
