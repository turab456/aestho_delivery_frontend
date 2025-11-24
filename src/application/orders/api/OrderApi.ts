import apiClient from "../../../lib/apiClient";
import type { ApiResponse, Order, OrderStatus } from "../types";

const OrderApi = {
  async list(): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<Order[]>>("/orders/partner/list");
    return response.data.data;
  },

  async getById(id: string): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/partner/${id}`);
    return response.data.data;
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const response = await apiClient.patch<ApiResponse<Order>>(`/orders/partner/${id}/status`, { status });
    return response.data.data;
  },
};

export default OrderApi;
