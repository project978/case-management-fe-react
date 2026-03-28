import React, { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

interface MainLayoutProps {
  children: React.ReactNode;
}

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 68;

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Desktop Sidebar */}
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </Box>

      {/* Mobile Nav */}
      <MobileNav />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: '56px', lg: 0 },
          ml: { lg: sidebarCollapsed ? `${COLLAPSED_WIDTH}px` : `${DRAWER_WIDTH}px` },
          transition: 'margin-left 0.3s',
          p: { xs: 2, lg: 3 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
