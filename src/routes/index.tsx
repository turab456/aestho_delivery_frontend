import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import OrderManagement from "../application/Invoice";
import InvoiceManagement from "../application/orders";
import SignIn from "../application/Auth/SignIn";
import PrivateRoute from "../components/auth/PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<OrderManagement />} />
          <Route path="invoices" element={<InvoiceManagement />} />
          <Route path="order-management" element={<OrderManagement />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
