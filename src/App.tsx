
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
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
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import VacuumTransferReference from './pages/VacuumTransferReference';
import PadSelectionGuide from './pages/PadSelectionGuide';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="opportunities" element={<Opportunities />} />
              <Route path="sales-performance" element={<SalesPerformance />} />
              <Route path="data-management" element={<DataManagement />} />
              <Route path="inventory/southern-sales" element={<InventoryStatus />} />
              <Route path="products/catalog" element={<ProductCatalog />} />
              <Route path="products/drawings" element={<ProductDrawings />} />
              <Route path="accounts/companies" element={<Accounts />} />
              <Route path="accounts/contacts" element={<ContactInfo />} />
              <Route path="vacuum-transfer" element={<VacuumTransferReference />} />
              <Route path="pad-selection" element={<PadSelectionGuide />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;

