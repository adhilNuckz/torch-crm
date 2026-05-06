import { Card, CardContent } from '../ui/card.jsx'

export default function StatCard({ label, value, helper }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-2xl font-semibold">{value}</div>
        {helper ? <div className="text-xs text-muted-foreground">{helper}</div> : null}
      </CardContent>
    </Card>
  )
}
