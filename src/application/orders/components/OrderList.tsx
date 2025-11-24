import React, { useEffect, useMemo, useState } from "react";
import { DataTable, type ColumnDef } from "../../../components/custom/CustomTable/CustomTable";
import Loader from "../../../components/common/Loader";
import { useAuth } from "../../../context/AuthContext";
import OrderApi from "../api/OrderApi";
import type { Order, OrderStatus } from "../types";
import OrderDetailsModal from "./OrderDetailsModal";
import ConfirmModal from "../../../components/custom/CustomConfirmModal";
import { Eye, Ticket } from "lucide-react";

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    PLACED: "bg-gray-100 text-gray-800",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PACKED: "bg-indigo-100 text-indigo-700",
    OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    RETURN_REQUESTED: "bg-yellow-100 text-yellow-700",
    RETURNED: "bg-amber-100 text-amber-700",
  };
  return map[status] || "bg-gray-100 text-gray-800";
};

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptTarget, setAcceptTarget] = useState<Order | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const { user } = useAuth();
  const currentPartnerId = user?.id;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await OrderApi.list();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  const openOrder = async (orderId: string) => {
    try {
      const detail = await OrderApi.getById(orderId);
      setSelected(detail);
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to load order", error);
    }
  };

  const handleStatusUpdate = async (status: OrderStatus) => {
    if (!selected || !currentPartnerId) return;

    if (!selected.assignedPartnerId) {
      console.warn("Accept the order before updating status");
      return;
    }

    if (selected.assignedPartnerId !== currentPartnerId) {
      console.warn("This order is assigned to another partner");
      return;
    }

    try {
      setIsUpdating(true);
      const updated = await OrderApi.updateStatus(selected.id, status);
      setSelected(updated);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const performAccept = async (order: Order) => {
    if (!order || order.assignedPartnerId || !currentPartnerId) return;
    try {
      setIsAccepting(true);
      setAcceptingId(order.id);
      const accepted = await OrderApi.accept(order.id);
      setOrders((prev) => prev.map((o) => (o.id === accepted.id ? accepted : o)));
      if (selected?.id === accepted.id) {
        setSelected(accepted);
      }
    } catch (error) {
      console.error("Failed to accept order", error);
    } finally {
      setIsAccepting(false);
      setAcceptingId(null);
      setAcceptTarget(null);
    }
  };

  const handleAccept = async () => {
    if (!selected) return;
    await performAccept(selected);
  };

  const columns: Array<ColumnDef<any>> = useMemo(
    () => [
      {
        key: "id",
        header: "Order",
        searchable: true,
        render: (row) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{row.id.slice(0, 8)}...</span>
            <span className="text-xs text-gray-500">
              {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : ""}
            </span>
          </div>
        ),
      },
      {
        key: "addressName",
        header: "Customer",
        searchable: true,
        render: (row) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{row.addressName}</span>
            <span className="text-xs text-gray-500">{row.city}</span>
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        searchable: true,
        render: (row) => (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${statusBadge(
              row.status,
            )}`}
          >
            {row.status.replace(/_/g, " ")}
          </span>
        ),
      },
      {
        key: "assignedPartner",
        header: "Accepted By",
        searchable: true,
        render: (row) => {
          const isMine = row.assignedPartnerId && row.assignedPartnerId === currentPartnerId;
          const hasPartner = Boolean(row.assignedPartnerId);
          const label = isMine
            ? "You"
            : hasPartner
              ? row.assignedPartner?.fullName || row.assignedPartner?.email || "Partner"
              : "Available";
          const color = isMine
            ? "bg-green-100 text-green-700"
            : hasPartner
              ? "bg-gray-100 text-gray-700"
              : "bg-emerald-50 text-emerald-700";
          return (
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${color}`}>
              {label}
            </span>
          );
        },
      },
      {
        key: "paymentStatus",
        header: "Payment",
        searchable: true,
        render: (row) => (
          <div className="flex flex-col text-sm">
            <span className="font-semibold text-gray-900">{row.paymentMethod}</span>
            <span className="text-xs text-gray-500">{row.paymentStatus}</span>
          </div>
        ),
      },
      {
        key: "total",
        header: "Total",
        searchable: false,
        render: (row) => (
          <div className="text-sm font-semibold text-gray-900">{formatter.format(row.total)}</div>
        ),
      },
      {
        key: "id",
        header: "Actions",
        searchable: false,
        render: (row) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openOrder(row.id)}
              className="p-2 text-gray-700 transition hover:text-gray-900"
              title="View order"
            >
              <Eye size={18} />
            </button>
            {!row.assignedPartnerId && (
              <button
                type="button"
                onClick={() => setAcceptTarget(row)}
                className="p-2 text-emerald-700 transition hover:text-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Accept order"
                disabled={isAccepting && acceptingId === row.id}
              >
                <Ticket size={18} />
              </button>
            )}
          </div>
        ),
      },
    ],
    [currentPartnerId],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
      </div>

      {loading ? (
        <Loader label="Loading orders..." fullHeight />
      ) : (
        <DataTable
          data={orders as any}
          columns={columns}
          defaultPageSize={10}
          enableSearchDropdown
          buildSuggestionLabel={(row: any) => `${row.addressName} - ${row.id}`}
          onSuggestionSelect={(row: any) => openOrder(row.id)}
        />
      )}

      <OrderDetailsModal
        isOpen={modalOpen}
        order={selected}
        onClose={() => setModalOpen(false)}
        onUpdateStatus={handleStatusUpdate}
        isUpdating={isUpdating}
        onAccept={handleAccept}
        isAccepting={isAccepting}
        currentPartnerId={currentPartnerId}
      />
      <ConfirmModal
        isOpen={Boolean(acceptTarget)}
        title="Accept this order?"
        message={
          acceptTarget
            ? `You are about to accept order ${acceptTarget.id}. After acceptance only you can update its status.`
            : ""
        }
        confirmText="Accept order"
        onConfirm={() => acceptTarget && performAccept(acceptTarget)}
        onCancel={() => setAcceptTarget(null)}
        isProcessing={isAccepting}
      />
    </div>
  );
};

export default OrderList;
