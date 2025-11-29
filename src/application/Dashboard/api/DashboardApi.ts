import apiClient from "../../../lib/apiClient"
import type { ApiResponse, DashboardPartnerPayload } from "../types"

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || "Dashboard API error.")
  }
  return response.data
}

const DashboardApi = {
  async fetchPartner(): Promise<DashboardPartnerPayload> {
    const response = await apiClient.get<ApiResponse<DashboardPartnerPayload>>("/dashboard/partner")
    return unwrap(response.data)
  },
}

export default DashboardApi
