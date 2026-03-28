import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Typography, IconButton, Chip, Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShieldIcon from '@mui/icons-material/Shield';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon />, show: true },
    { path: '/cases', label: 'Cases', icon: <AssignmentIcon />, show: true },
    { path: '/users', label: 'User Management', icon: <PeopleIcon />, show: isAdmin },
    { path: '/import-export', label: 'Import/Export', icon: <ImportExportIcon />, show: isAdmin },
    { path: '/settings', label: 'My Profile', icon: <SettingsIcon />, show: true },
  ];

  const filteredNavItems = navItems.filter(item => item.show);
  const getRoleColor = (role: string) => role === 'ADMIN' ? 'error' : 'success';
  const DRAWER_WIDTH = 260;
  const COLLAPSED_WIDTH = 68;

  return (
    <Box sx={{
      position: 'fixed', left: 0, top: 0, zIndex: 40, height: '100vh',
      width: isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH, bgcolor: '#1A2332', color: '#E2E8F0',
      transition: 'width 0.3s', display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', px: 2, height: 64, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {!isCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 32, height: 32, bgcolor: 'primary.main', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldIcon sx={{ fontSize: 20, color: '#fff' }} />
            </Box>
            <Typography variant="subtitle1" fontWeight={700} color="#fff">Case Management</Typography>
          </Box>
        )}
        <IconButton onClick={onToggle} size="small" sx={{ color: '#E2E8F0' }}>
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {!isCollapsed && user && (
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>{user.name.charAt(0)}</Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" fontWeight={600} color="#fff" noWrap>{user.name}</Typography>
              <Chip label={user.role} size="small" color={getRoleColor(user.role) as any} sx={{ height: 20, fontSize: '0.65rem', mt: 0.5 }} />
            </Box>
          </Box>
        </Box>
      )}

      <List sx={{ flex: 1, overflowY: 'auto', px: 1, py: 1 }}>
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton key={item.path} component={Link} to={item.path} sx={{
              borderRadius: 2, mb: 0.5, px: isCollapsed ? 1.5 : 2,
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              bgcolor: isActive ? 'primary.main' : 'transparent',
              color: isActive ? '#fff' : '#94A3B8',
              '&:hover': { bgcolor: isActive ? 'primary.main' : 'rgba(255,255,255,0.06)', color: '#fff' },
            }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: isCollapsed ? 'auto' : 40 }}>{item.icon}</ListItemIcon>
              {!isCollapsed && <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />}
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ p: 1, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <ListItemButton onClick={logout} sx={{
          borderRadius: 2, px: isCollapsed ? 1.5 : 2,
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          color: '#94A3B8', '&:hover': { bgcolor: 'rgba(229,62,62,0.1)', color: '#E53E3E' },
        }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: isCollapsed ? 'auto' : 40 }}><LogoutIcon /></ListItemIcon>
          {!isCollapsed && <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />}
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default Sidebar;
