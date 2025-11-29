import { useEffect, useState } from "react"
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import StatsCards from "./components/StatsCards"
import RevenueSummary from "./components/RevenueSummary"
import OrdersPreview from "./components/OrdersPreview"
import DashboardApi from "./api/DashboardApi"
import type { DashboardPartnerPayload } from "./types"
import type { Order } from "../orders/types"
import OrderApi from "../orders/api/OrderApi"

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardPartnerPayload | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    DashboardApi.fetchPartner()
      .then((data) => setStats(data))
      .catch((err) => setError(err?.message || "Failed to load dashboard"))
      .finally(() => setLoadingStats(false))

    OrderApi.list()
      .then((data) => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false))
  }, [])

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Dashboard" />

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-100">
          {error}
        </div>
      ) : null}

      <StatsCards orders={stats?.orders} revenue={stats?.revenue} loading={loadingStats} />

      <RevenueSummary revenue={stats?.revenue} loading={loadingStats} />

      <OrdersPreview orders={orders} loading={loadingOrders} />
    </div>
  )
}

export default Dashboard
