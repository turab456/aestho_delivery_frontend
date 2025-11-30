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

  const isAssignedToMe = Boolean(
    order.assignedPartnerId && order.assignedPartnerId === currentPartnerId
  );
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

  const handlePrintLabel = () => {
    const label = (order as any).shippingLabel || {
      orderId: order.id,
      customer: { name: order.addressName, phone: order.addressPhone },
      address: {
        line1: order.addressLine1,
        line2: order.addressLine2,
        city: order.city,
        state: order.state,
        postalCode: order.postalCode,
      },
      items: (order.items || []).map((i) => ({
        name: i.productName,
        qty: i.quantity,
        amount: i.totalPrice,
        sku: i.sku,
      })),
      codAmount: order.total,
      shippingFee: order.shippingFee || 0,
      subtotal: order.subtotal || 0,
      discountAmount: order.discountAmount || 0,
      paymentMethod: order.paymentMethod,
    };

    const env = (import.meta as any).env || {};
    const origin = typeof window !== 'undefined' && window.location ? window.location.origin : '';
    const remoteFallback = 'https://aesthco.com/black_logo.png';

    // Candidate local paths (common names). Order matters.
    const candidateLocalPaths = [
      env?.VITE_LOCAL_LOGO_PATH,
      '/logo.png',
      '/logo.svg',
      '/black_logo.png',
    ].filter(Boolean);

    const candidateLocalUrls = origin ? candidateLocalPaths.map((p) => `${origin}${p}`) : [];

    const candidates = [
      env?.VITE_PARTNER_LABEL_LOGO,
      env?.VITE_LOGO_URL,
      ...candidateLocalUrls,
      remoteFallback,
    ].filter(Boolean);

    // pick first candidate as initial logo, and keep the rest as alternates
    const logo = candidates[0];
    const altLogos = candidates.slice(1);
    const itemsHtml = (label.items || [])
      .map(
        (item: any) => `<tr>
          <td style="padding:6px 4px; border-bottom:1px solid #e5e7eb; width:180px; max-width:180px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${
            item.name || ""
          }</td>
          <td style="padding:6px 4px; border-bottom:1px solid #e5e7eb; text-align:center; width:40px;">${
            item.qty || ""
          }</td>
          <td style="padding:6px 4px; border-bottom:1px solid #e5e7eb; width:220px; max-width:220px; word-break:break-all;">${
            item.sku || ""
          }</td>
          <td style="padding:6px 4px; border-bottom:1px solid #e5e7eb; text-align:right; width:100px;">₹${Number(
            item.amount || 0
          ).toFixed(0)}</td>
        </tr>`
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shipping Label #${label.orderId}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          
          * { box-sizing: border-box; }
          body { 
            margin: 0; 
            padding: 20px; 
            font-family: 'Inter', sans-serif; 
            background: #f5f5f5; 
            -webkit-print-color-adjust: exact; 
          }
          
          .page {
            max-width: 600px; /* Standard label width */
            margin: 0 auto;
            background: white;
          }

          .label-border {
            border: 4px solid #000;
            padding: 24px;
            position: relative;
          }

          /* Header & Logo - Centered */
          .header {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-bottom: 3px solid #000;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          
          .logo-img {
            height: 50px;
            object-fit: contain;
            display: block;
            margin-bottom: 10px;
          }

          .label-title {
            font-size: 14px;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
          }

          /* Meta Info Bar */
          .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border: 2px solid #000;
            margin-bottom: 24px;
          }
          .meta-cell {
            padding: 10px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
          }
          .meta-cell:first-child { border-right: 2px solid #000; }
          
          /* Addresses */
          .address-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-bottom: 24px;
          }
          .address-box h3 {
            margin: 0 0 8px 0;
            font-size: 11px;
            text-transform: uppercase;
            color: #555;
            letter-spacing: 1px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 4px;
          }
          .address-text {
            font-size: 14px;
            line-height: 1.5;
            color: #000;
          }
          .recipient-name {
            font-weight: 800;
            font-size: 16px;
          }
          .huge-code {
            font-size: 18px;
            font-weight: 700;
            margin-top: 8px;
          }

          /* Items Table */
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { text-align: left; border-bottom: 2px solid #000; padding: 6px; text-transform: uppercase; font-size: 11px; }
          td { padding: 8px 6px; border-bottom: 1px solid #eee; }
          .item-name { font-weight: 600; }
          .item-qty { text-align: center; font-weight: 700; }
          
          /* Footer */
          .footer {
            margin-top: 24px;
            border-top: 3px solid #000;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .cod-box {
            border: 2px solid #000;
            padding: 8px 16px;
            font-size: 20px;
            font-weight: 800;
          }
          .cod-label { font-size: 10px; text-transform: uppercase; display: block; }

          @media print {
            body { padding: 0; background: white; }
            .page { max-width: 100%; }
            .label-border { border: 2px solid #000; }
          }
        </style>
      </head>
      <body onload="window.print();">
        <div class="page">
          <div class="label-border">
            
            <div class="header">
              <img src="${logo}" alt="Aesthco" class="logo-img" data-alts="${altLogos.join(',')}" onerror="(function(){try{const a=this.getAttribute('data-alts')||''; if(!a){this.onerror=null;return;} const arr=a.split(','); const next=arr.shift(); if(next){ this.setAttribute('data-alts', arr.join(',')); this.src=next; } else { this.onerror=null; } }catch(e){ this.onerror=null; } }).call(this)" />
              <div class="label-title">Shipping Document</div>
            </div>

            <div class="meta-grid">
              <div class="meta-cell">Order #${label.orderId}</div>
              <div class="meta-cell">Date: ${new Date().toLocaleDateString()}</div>
            </div>

            <div class="address-section">
              <div class="address-box">
                <h3>Ship To</h3>
                <div class="address-text">
                  <div class="recipient-name">${label.customer?.name}</div>
                  <div>${label.address?.line1}${label.address?.line2 ? `, ${label.address.line2}` : ""}</div>
                  <div>${[label.address?.city, label.address?.state, label.address?.postalCode]
                    .filter(Boolean)
                    .join(", ")}</div>
                  <div style="margin-top:8px;">Tel: <strong>${label.customer?.phone}</strong></div>
                </div>
              </div>

              <div class="address-box">
                <h3>Shipped From</h3>
                <div class="address-text">
                  <div style="font-weight:700;">Aesthco</div>
                  <div>RT Nagar</div>
                  <div>Bengaluru, Karnataka</div>
                  <div>India</div>
                  <div><a href="mailto:support@aesthco.com">support@aesthco.com</a></div>
                </div>
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <h3>Items</h3>
              <table>
                <thead>
                  <tr>
                      <th style="width:180px;">Product</th>
                      <th style="width: 40px; text-align: center;">Qty</th>
                      <th style="width:220px;">SKU</th>
                      <th style="width:100px; text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div style="margin-top:12px; display:flex; justify-content:flex-end;">
                <table style="width:320px; border-collapse:collapse; font-size:13px;">
                  <tbody>
                    <tr>
                      <td style="padding:6px 8px; color:#444;">Subtotal</td>
                      <td style="padding:6px 8px; text-align:right; font-weight:600;">₹${Number(
                        label.subtotal || 0
                      ).toFixed(0)}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 8px; color:#444;">Shipping</td>
                      <td style="padding:6px 8px; text-align:right;">₹${Number(
                        label.shippingFee || 0
                      ).toFixed(0)}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 8px; color:#444;">Discount</td>
                      <td style="padding:6px 8px; text-align:right;">-₹${Number(
                        label.discountAmount || 0
                      ).toFixed(0)}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 8px; font-weight:800; border-top:1px solid #ddd;">Total</td>
                      <td style="padding:6px 8px; text-align:right; font-weight:800; border-top:1px solid #ddd;">₹${Number(
                        label.total || label.codAmount || 0
                      ).toFixed(0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="footer">
              <div style="font-size: 12px; font-weight: 600;">
                Payment: ${label.paymentMethod}
                
                
              </div>
              <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
              
                <div class="cod-box">
                  <span class="cod-label">Collect Amount</span>
                  ₹${Number(label.codAmount || 0).toFixed(0)}
                </div>
              </div>
            </div>

          </div>
        </div>

       
      </body>
      </html>
    `;
    const printWindow = window.open("", "_blank", "width=900,height=1100");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    }
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
              {isUnassigned
                ? "Awaiting acceptance"
                : `Accepted by ${isAssignedToMe ? "you" : partnerLabel}`}
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
              {isUnassigned && order.status !== "CANCELLED" && (
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
              <CustomButton
                fullWidth={false}
                size="sm"
                variant="outline"
                onClick={handlePrintLabel}
              >
                Shipping label
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
              <p className="text-xs text-gray-500">
                Coupon: {order.couponCode || "—"}
              </p>
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
