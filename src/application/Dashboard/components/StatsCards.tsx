import { CheckCircle, ClipboardList, Clock3, RotateCcw, Wallet, XCircle } from "lucide-react"
import type { DashboardOrders, DashboardRevenue } from "../types"

type Props = {
  orders?: DashboardOrders
  revenue?: DashboardRevenue
  loading?: boolean
}

const formatNumber = (value?: number) =>
  new Intl.NumberFormat("en-IN").format(Number.isFinite(value ?? 0) ? (value as number) : 0)

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Number.isFinite(value ?? 0) ? (value as number) : 0,
  )

// Hover effect changes border to black
const cardBase =
  "group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-gray-900 hover:shadow-md"

export default function StatsCards({ orders, revenue, loading }: Props) {
  const cards = [
    {
      id: "assigned",
      label: "Assigned Orders",
      value: formatNumber(orders?.assigned),
      helper: "Total active assignments",
      icon: <ClipboardList className="h-5 w-5 text-gray-900" />,
    },
    {
      id: "completed",
      label: "Completed",
      value: formatNumber(orders?.completed),
      helper: "Delivered successfully",
      icon: <CheckCircle className="h-5 w-5 text-gray-900" />,
    },
    {
      id: "inprogress",
      label: "In Progress",
      value: formatNumber(orders?.pending),
      helper: "Packed or Out for Delivery",
      icon: <Clock3 className="h-5 w-5 text-gray-900" />,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      value: formatNumber(orders?.cancelled),
      helper: "Cancelled by customer/admin",
      icon: <XCircle className="h-5 w-5 text-gray-900" />,
    },
    {
      id: "returns",
      label: "Return Requests",
      value: formatNumber(orders?.returnRequested),
      helper: "Awaiting processing",
      icon: <RotateCcw className="h-5 w-5 text-gray-900" />,
    },
    {
      id: "cod",
      label: "Outstanding COD",
      value: formatCurrency(revenue?.outstandingCod),
      helper: "Cash to be collected",
      icon: <Wallet className="h-5 w-5 text-gray-900" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div key={card.id} className={cardBase}>
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
               <p className="text-sm font-medium text-gray-500">{card.label}</p>
               <p className="text-3xl font-bold tracking-tight text-gray-900">
                {loading ? <span className="inline-block h-8 w-20 animate-pulse rounded bg-gray-200" /> : card.value}
              </p>
            </div>
            
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 border border-gray-100  transition-colors duration-300">
               {/* Clone element to change color on hover using CSS specificity or just simple class swapping if possible, 
                   but here we rely on group-hover text color change on the icon */}
               <div className="text-gray-900 group-hover:text-white transition-colors duration-300">
                 {card.icon}
               </div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-3 mt-1">
             <p className="text-xs font-medium text-gray-400">{card.helper}</p>
          </div>
        </div>
      ))}
    </div>
  )
}