import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.jsx'

const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#22c55e', '#ef4444', '#0ea5e9']

export default function LeadsBySourceChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads by Source</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="source" outerRadius={90} label>
              {data.map((entry, index) => (
                <Cell key={entry.source} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
