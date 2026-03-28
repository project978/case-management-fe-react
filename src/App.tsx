import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import Users from "./pages/Users";
import ImportExport from "./pages/ImportExport";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1565C0', light: '#1E88E5', dark: '#0D47A1', contrastText: '#fff' },
    secondary: { main: '#E0E7EE', contrastText: '#2D3748' },
    success: { main: '#2E7D32', light: '#4CAF50' },
    warning: { main: '#ED8936', light: '#F6AD55' },
    error: { main: '#E53E3E' },
    info: { main: '#0288D1' },
    background: { default: '#F5F7FA', paper: '#FFFFFF' },
    text: { primary: '#1A2332', secondary: '#6B7A90' },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 }, h5: { fontWeight: 700 }, h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 }, subtitle2: { fontWeight: 500 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCard: { styleOverrides: { root: { boxShadow: '0 2px 8px -2px rgba(26,35,50,0.08), 0 4px 16px -4px rgba(26,35,50,0.12)', borderRadius: 12 } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/cases" element={<ProtectedRoute><Cases /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute requiredRoles={['ADMIN']}><Users /></ProtectedRoute>} />
            <Route path="/import-export" element={<ProtectedRoute requiredRoles={['ADMIN']}><ImportExport /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
