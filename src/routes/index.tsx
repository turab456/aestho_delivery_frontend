import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import OrdersPage from "../application/orders";
import SignIn from "../application/Auth/SignIn";
import PrivateRoute from "../components/auth/PrivateRoute";
import Dashboard from "../application/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="order-management" element={<OrdersPage />} />
          <Route path="invoices" element={<OrdersPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
