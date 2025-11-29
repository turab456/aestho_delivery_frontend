import { useNavigate } from "react-router-dom"
import type { Order, OrderStatus } from "../../orders/types"

type Props = {
  orders?: Order[]
  loading?: boolean
}

// Monochrome Status Theme
const statusStyles: Record<OrderStatus, string> = {
  DELIVERED: "bg-black text-white border border-black",
  CONFIRMED: "bg-gray-800 text-white border border-gray-800",
  PACKED: "bg-gray-800 text-white border border-gray-800",
  OUT_FOR_DELIVERY: "bg-white text-gray-900 border border-gray-900 font-bold",
  PLACED: "bg-white text-gray-900 border border-gray-300",
  RETURN_REQUESTED: "bg-gray-100 text-gray-600 border border-gray-200",
  RETURNED: "bg-gray-200 text-gray-600 border border-gray-200",
  CANCELLED: "bg-white text-gray-400 border border-gray-200 line-through decoration-gray-400",
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0,
  )

const formatOrderId = (id: string) => `#${id.slice(0, 8)}`

export default function OrdersPreview({ orders = [], loading = false }: Props) {
  const navigate = useNavigate()
  const topOrders = orders.slice(0, 6)
  const showEmpty = !loading && topOrders.length === 0

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-900">Recent Orders</p>
          <p className="text-xs text-gray-500">Latest assignments and deliveries</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/order-management')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          View All Orders
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-gray-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs uppercase tracking-widest text-gray-500">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="animate-pulse">
                    <td className="px-4 py-4">
                      <div className="h-4 w-24 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-20 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-16 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-6 w-20 rounded-full bg-gray-200" />
                    </td>
                  </tr>
                ))
              : null}

            {showEmpty ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No orders to show.
                </td>
              </tr>
            ) : null}

            {!loading &&
              topOrders.map((order) => {
                const badge = statusStyles[order.status] || "bg-gray-50 text-gray-500 border border-gray-100"
                const firstItem = order.items?.[0]
                const label = firstItem?.productName || "Order"
                return (
                  <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900">{formatOrderId(order.id)}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="font-semibold text-gray-900">{order.addressName || "—"}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[120px]">{label}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(Number(order.total))}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm ${badge}`}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}