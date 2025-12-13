
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import ContactInfo from './pages/ContactInfo';
import Opportunities from './pages/Opportunities';
import SalesPerformance from './pages/SalesPerformance';
import ProductDrawings from './pages/ProductDrawings';
import Login from './pages/Login';
import InventoryStatus from './pages/InventoryStatus';
import DataManagement from './pages/DataManagement';
import ProtectedRoute from './components/ProtectedRoute';
import VacuumTransferReference from './pages/VacuumTransferReference';
import PadSelectionGuide from './pages/PadSelectionGuide';
import CrossReferenceGuide from './pages/CrossReferenceGuide';
import SalesMap from './pages/SalesMap';
import MarketingMaterials from './pages/MarketingMaterials';
import SpecialQuotation from './pages/SpecialQuotation';
import QuoteRedirect from './pages/QuoteRedirect';
import QuoteHistory from './pages/QuoteHistory';
import HomePage from './pages/HomePage';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {/* 공개 견적서 링크 - 인증 불필요 */}
          <Route path="/q/:shortCode" element={<QuoteRedirect />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route path="home" element={<HomePage />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="opportunities" element={<Opportunities />} />
              <Route path="sales-performance" element={<SalesPerformance />} />
              <Route path="data-management" element={<DataManagement />} />
              <Route path="inventory/southern-sales" element={<InventoryStatus />} />
              <Route path="products/drawings" element={<ProductDrawings />} />
              <Route path="products/marketing" element={<MarketingMaterials />} />
              <Route path="accounts/companies" element={<Accounts />} />
              <Route path="accounts/contacts" element={<ContactInfo />} />
              <Route path="vacuum-transfer" element={<VacuumTransferReference />} />
              <Route path="pad-selection" element={<PadSelectionGuide />} />
              <Route path="cross-reference" element={<CrossReferenceGuide />} />
              <Route path="sales-map" element={<SalesMap />} />
              <Route path="special-quotation" element={<SpecialQuotation />} />
              <Route path="quote-history" element={<QuoteHistory />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
