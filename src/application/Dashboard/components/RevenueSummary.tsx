import { TrendingUp } from "lucide-react"
import type { DashboardRevenue } from "../types"

type Props = {
  revenue?: DashboardRevenue
  loading?: boolean
}

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Number.isFinite(value ?? 0) ? (value as number) : 0,
  )

export default function RevenueSummary({ revenue, loading }: Props) {
  // Monochrome gradient for bars
  const bars = [
    { id: "completed", label: "Completed value", value: revenue?.completedValue ?? 0, color: "bg-black" },
    { id: "inprogress", label: "In progress value", value: revenue?.inProgressValue ?? 0, color: "bg-gray-600" },
    { id: "assigned", label: "Total assigned", value: revenue?.assignedValue ?? 0, color: "bg-gray-400" },
    { id: "cod", label: "Outstanding COD", value: revenue?.outstandingCod ?? 0, color: "bg-gray-200" },
  ]

  const maxValue = Math.max(...bars.map((b) => b.value), 1)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-gray-900">Revenue Overview</p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
            {loading ? (
              <span className="inline-block h-8 w-32 animate-pulse rounded bg-gray-200" />
            ) : (
              formatCurrency(revenue?.assignedValue)
            )}
          </h3>
          <p className="mt-1 text-xs text-gray-500">Expected value from all assigned orders</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-gray-50">
          <TrendingUp className="h-6 w-6 text-black" />
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {bars.map((bar) => {
          const width = `${Math.max(2, Math.min(100, (bar.value / maxValue) * 100))}%`
          return (
            <div key={bar.id}>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">{bar.label}</span>
                <span className="font-bold text-gray-900">
                  {loading ? (
                    <span className="inline-block h-4 w-16 animate-pulse rounded bg-gray-200" />
                  ) : (
                    formatCurrency(bar.value)
                  )}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div 
                    className={`h-full rounded-full ${bar.color} transition-all duration-700 ease-out`} 
                    style={{ width }} 
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}