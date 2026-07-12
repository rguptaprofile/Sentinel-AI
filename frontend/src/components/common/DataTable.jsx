import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import StatusChip from '@/components/common/StatusChip'
import RiskBadge from '@/components/common/RiskBadge'
import { formatCurrency, formatDate } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function DataTable({ columns, data, loading }) {
  if (loading) return <LoadingSpinner className="py-12" />

  if (!data.length) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground shadow-sm">
        No live records available from the backend yet.
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((col) => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={row.id || i}>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function FraudReportsTable() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    import('@/services/api').then(({ default: api }) => {
      api.getFraudReports()
        .then((data) => {
          if (mounted) {
            setReports(data)
          }
        })
        .catch((err) => {
          if (mounted) {
            setError(err.message)
            setReports([])
          }
        })
        .finally(() => {
          if (mounted) {
            setLoading(false)
          }
        })
    })
    return () => { mounted = false }
  }, [])

  const columns = [
    { key: 'id', label: 'Report ID' },
    { key: 'type', label: 'Type' },
    { key: 'location', label: 'Location' },
    { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
    { key: 'status', label: 'Status', render: (row) => <StatusChip status={row.status} /> },
    { key: 'riskScore', label: 'Risk', render: (row) => <RiskBadge score={row.riskScore} /> },
    { key: 'reportedAt', label: 'Reported', render: (row) => formatDate(row.reportedAt) },
  ]

  if (error && !loading) {
    return <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>
  }

  return <DataTable columns={columns} data={reports} loading={loading} />
}

export function TransactionsTable() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    import('@/services/api').then(({ default: api }) => {
      api.getTransactions()
        .then((data) => {
          if (mounted) {
            setTransactions(data)
          }
        })
        .catch((err) => {
          if (mounted) {
            setError(err.message)
            setTransactions([])
          }
        })
        .finally(() => {
          if (mounted) {
            setLoading(false)
          }
        })
    })
    return () => { mounted = false }
  }, [])

  const columns = [
    { key: 'id', label: 'Txn ID' },
    { key: 'accountHolder', label: 'Account Holder' },
    { key: 'type', label: 'Type' },
    { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
    { key: 'merchant', label: 'Merchant' },
    { key: 'status', label: 'Status', render: (row) => <StatusChip status={row.status} /> },
    { key: 'riskScore', label: 'Risk', render: (row) => <RiskBadge score={row.riskScore} /> },
    { key: 'timestamp', label: 'Time', render: (row) => formatDate(row.timestamp) },
  ]

  if (error && !loading) {
    return <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>
  }

  return <DataTable columns={columns} data={transactions} loading={loading} />
}
