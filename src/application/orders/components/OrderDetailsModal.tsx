import React, { useEffect, useState } from "react";
import CustomModal from "../../../components/custom/CustomModal";
import CustomButton from "../../../components/custom/CustomButton";
import CustomDropdown from "../../../components/custom/CustomDropdown";
import type { Order, OrderStatus } from "../types";

type Props = {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (status: OrderStatus) => Promise<void>;
  isUpdating?: boolean;
  onAccept: () => Promise<void>;
  isAccepting?: boolean;
  currentPartnerId?: string;
};

const STATUS_OPTIONS: { label: string; value: OrderStatus }[] = [
  { label: "Placed", value: "PLACED" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Packed", value: "PACKED" },
  { label: "Out for delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Return requested", value: "RETURN_REQUESTED" },
  { label: "Returned", value: "RETURNED" },
];

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const OrderDetailsModal: React.FC<Props> = ({
  isOpen,
  order,
  onClose,
  onUpdateStatus,
  isUpdating = false,
  onAccept,
  isAccepting = false,
  currentPartnerId,
}) => {
  const [status, setStatus] = useState<OrderStatus>("PLACED");

  useEffect(() => {
    if (order?.status) {
      setStatus(order.status);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const isAssignedToMe = Boolean(order.assignedPartnerId && order.assignedPartnerId === currentPartnerId);
  const isUnassigned = !order.assignedPartnerId;
  const isLockedByAnother = Boolean(order.assignedPartnerId && !isAssignedToMe);
  const canUpdateStatus = !isUnassigned && !isLockedByAnother;
  const partnerLabel =
    order.assignedPartner?.fullName ||
    order.assignedPartner?.email ||
    (order.assignedPartnerId ? "Partner" : "Not accepted");

  const handleUpdate = async () => {
    if (!canUpdateStatus) return;
    await onUpdateStatus(status);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      contentClassName="bg-gray-50"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Order ID
          </p>
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm">
              {order.id}
            </span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {new Date(order.createdAt || "").toLocaleString()}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isUnassigned
                  ? "bg-amber-50 text-amber-700"
                  : isAssignedToMe
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              {isUnassigned ? "Awaiting acceptance" : `Accepted by ${isAssignedToMe ? "you" : partnerLabel}`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Customer
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {order.addressName}
            </p>
            <p className="text-xs text-gray-600">
              {order.addressPhone || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Address
            </p>
            <p className="text-sm text-gray-800">
              {order.addressLine1}
              {order.addressLine2 ? `, ${order.addressLine2}` : ""}
            </p>
            <p className="text-sm text-gray-800">
              {order.city}, {order.state} {order.postalCode || ""}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Status
            </p>
            <CustomDropdown
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              options={STATUS_OPTIONS}
              disabled={!canUpdateStatus || isUpdating}
            />
            <div className="flex flex-wrap gap-2">
              {isUnassigned && (
                <CustomButton
                  fullWidth={false}
                  size="sm"
                  variant="outline"
                  onClick={onAccept}
                  disabled={isAccepting}
                >
                  {isAccepting ? "Accepting..." : "Accept order"}
                </CustomButton>
              )}
              <CustomButton
                fullWidth={false}
                onClick={handleUpdate}
                variant="outline"
                size="sm"
                disabled={!canUpdateStatus || isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </CustomButton>
            </div>
            {isLockedByAnother && (
              <p className="text-xs text-red-600">
                Accepted by {partnerLabel}. Status updates are disabled for you.
              </p>
            )}
            {isUnassigned && (
              <p className="text-xs text-gray-500">
                Accept this order to start processing and update its status.
              </p>
            )}
            {isAssignedToMe && (
              <p className="text-xs text-green-700">You accepted this order.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Payment
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {order.paymentMethod} • {order.paymentStatus}
              </p>
              <p className="text-xs text-gray-500">Coupon: {order.couponCode || "—"}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Total
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {formatter.format(order.total)}
              </p>
              <p className="text-xs text-gray-500">
                Subtotal {formatter.format(order.subtotal)} • Shipping{" "}
                {formatter.format(order.shippingFee)} • Discount{" "}
                {formatter.format(order.discountAmount || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-base font-semibold text-gray-900">Items</h4>
          </div>
          <div className="divide-y divide-gray-100">
            {order?.items?.map((item) => (
              <div key={item.id} className="flex items-start gap-3 py-3">
                <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1 text-sm text-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      {item.productName}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatter.format(item.totalPrice)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                    {item.colorName && <span>Color: {item.colorName}</span>}
                    {item.sizeName && <span>Size: {item.sizeName}</span>}
                    <span>Qty: {item.quantity}</span>
                    {item.sku && <span>SKU: {item.sku}</span>}
                  </div>
                  <p className="text-xs text-gray-500">
                    Unit: {formatter.format(item.unitPrice)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default OrderDetailsModal;
