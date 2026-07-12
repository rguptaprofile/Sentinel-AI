import { useEffect, useState } from 'react'
import api from '@/services/api'

const nodeColors = {
  suspect: '#EF4444',
  account: '#F97316',
  phone: '#F59E0B',
  bank: '#2563EB',
  victim: '#22C55E',
  ip: '#8B5CF6',
}

export default function FraudNetworkGraph() {
  const [graph, setGraph] = useState({ nodes: [], edges: [] })
  const [error, setError] = useState('')
  const { nodes, edges } = graph
  const width = 700
  const height = 400

  useEffect(() => {
    let mounted = true
    api.getNetworkGraph()
      .then((data) => {
        if (mounted) {
          setGraph(data?.nodes?.length ? data : { nodes: [], edges: [] })
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
        }
      })
    return () => { mounted = false }
  }, [])

  if (error) {
    return <div className="flex h-[350px] items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">{error}</div>
  }

  if (!nodes.length) {
    return <div className="flex h-[350px] items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">No live fraud graph data yet.</div>
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[350px]">
        {/* Edges */}
        {edges.map((edge, i) => {
          const from = nodes.find((n) => n.id === edge.from)
          const to = nodes.find((n) => n.id === edge.to)
          if (!from || !to) return null
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#475569"
              strokeWidth={edge.weight}
              strokeOpacity={0.6}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.type === 'suspect' ? 28 : 22}
              fill={nodeColors[node.type] || '#64748B'}
              fillOpacity={0.9}
              stroke="#fff"
              strokeWidth={2}
              className="drop-shadow-lg"
            />
            <text
              x={node.x}
              y={node.y + 40}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="11"
              fontWeight="500"
            >
              {node.label}
            </text>
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              fill="#fff"
              fontSize="10"
              fontWeight="bold"
            >
              {node.risk}%
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-3">
        {Object.entries(nodeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
