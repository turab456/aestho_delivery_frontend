

import React from "react";
// import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import OrderList from "./components/OrderList";

const OrdersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* <PageMeta title="Orders" description="Manage assigned orders" /> */}
      <PageBreadcrumb pageTitle="Orders" />
      <OrderList />
    </div>
  );
};

export default OrdersPage;
