export type DashboardOrders = {
  assigned: number
  completed: number
  pending: number
  cancelled: number
  returnRequested: number
}

export type DashboardRevenue = {
  assignedValue: number
  completedValue: number
  inProgressValue: number
  outstandingCod: number
}

export type DashboardPartnerPayload = {
  orders: DashboardOrders
  revenue: DashboardRevenue
}

export type ApiResponse<T> = {
  success: boolean
  message?: string
  data: T
}
