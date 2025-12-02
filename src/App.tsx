
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import ContactInfo from './pages/ContactInfo';
import Opportunities from './pages/Opportunities';
import SalesPerformance from './pages/SalesPerformance';
import ProductCatalog from './pages/ProductCatalog';
import ProductDrawings from './pages/ProductDrawings';
import Login from './pages/Login';
import InventoryStatus from './pages/InventoryStatus';
import DataManagement from './pages/DataManagement';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="sales-performance" element={<SalesPerformance />} />
            <Route path="data-management" element={<DataManagement />} />
            <Route path="inventory/southern-sales" element={<InventoryStatus />} />
            <Route path="products/catalog" element={<ProductCatalog />} />
            <Route path="products/drawings" element={<ProductDrawings />} />
            {/* Customer Info routes */}
            <Route path="accounts/companies" element={<Accounts />} />
            <Route path="accounts/contacts" element={<ContactInfo />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
