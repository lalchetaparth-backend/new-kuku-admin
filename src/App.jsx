import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import CategoryPage from "./pages/CategoryPage";
import DashboardPage from "./pages/DashboardPage";
import DetailRecordsPage from "./pages/DetailRecordsPage";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import ReportsPage from "./pages/ReportsPage";
import SimpleTablePage from "./pages/SimpleTablePage";
import TabbedResourcePage from "./pages/TabbedResourcePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/orders" element={<SimpleTablePage pageKey="orders" />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/blogs" element={<TabbedResourcePage pageKey="blogs" />} />
        <Route
          path="/distributors"
          element={<DetailRecordsPage pageKey="distributors" />}
        />
        <Route path="/offers" element={<TabbedResourcePage pageKey="offers" />} />
        <Route path="/billings" element={<DetailRecordsPage pageKey="billings" />} />
        <Route path="/modals" element={<TabbedResourcePage pageKey="modals" />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route
          path="/customers"
          element={<DetailRecordsPage pageKey="customers" />}
        />
        <Route
          path="/corporate-gifts"
          element={<SimpleTablePage pageKey="corporateGifts" />}
        />
        <Route
          path="/inquiries"
          element={<SimpleTablePage pageKey="inquiries" />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
