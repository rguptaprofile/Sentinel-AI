import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import LandingPage from '@/pages/Landing'
import LoginPage from '@/pages/Login'
import DashboardOverview from '@/pages/Dashboard'
import CitizenDashboard from '@/pages/Citizen'
import PoliceDashboard from '@/pages/Police'
import BankDashboard from '@/pages/Bank'
import AdminDashboard from '@/pages/Admin'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="citizen" element={<CitizenDashboard />} />
                <Route path="police" element={<PoliceDashboard />} />
                <Route path="bank" element={<BankDashboard />} />
                <Route path="admin" element={<AdminDashboard />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
