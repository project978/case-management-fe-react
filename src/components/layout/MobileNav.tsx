import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, Box,
  List, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Chip, Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ShieldIcon from '@mui/icons-material/Shield';
import { useAuth } from '@/contexts/AuthContext';

const MobileNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon />, show: true },
    { path: '/cases', label: 'Cases', icon: <AssignmentIcon />, show: true },
    { path: '/users', label: 'Users', icon: <PeopleIcon />, show: isAdmin },
    { path: '/import-export', label: 'Import/Export', icon: <ImportExportIcon />, show: isAdmin },
    { path: '/settings', label: 'My Profile', icon: <SettingsIcon />, show: true },
  ];

  const filteredNavItems = navItems.filter(item => item.show);
  const getRoleColor = (role: string) => role === 'ADMIN' ? 'error' : 'success';

  return (
    <AppBar position="fixed" sx={{ display: { lg: 'none' }, bgcolor: '#fff', color: 'text.primary', boxShadow: 1 }}>
      <Toolbar sx={{ minHeight: 56 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <Box sx={{ width: 32, height: 32, bgcolor: 'primary.main', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldIcon sx={{ fontSize: 20, color: '#fff' }} />
          </Box>
          <Typography variant="subtitle1" fontWeight={700}>CollectPro</Typography>
        </Box>
        <IconButton onClick={() => setOpen(true)}><MenuIcon /></IconButton>
      </Toolbar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 280 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
          </Box>

          {user && (
            <Box sx={{ px: 2, pb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>{user.name.charAt(0)}</Avatar>
                <Box>
                  <Typography fontWeight={600}>{user.name}</Typography>
                  <Chip label={user.role} size="small" color={getRoleColor(user.role) as any} sx={{ mt: 0.5 }} />
                </Box>
              </Box>
            </Box>
          )}
          <Divider />

          <List sx={{ flex: 1, px: 1 }}>
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItemButton key={item.path} component={Link} to={item.path} onClick={() => setOpen(false)} sx={{
                  borderRadius: 2, mb: 0.5,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? '#fff' : 'text.primary',
                  '&:hover': { bgcolor: isActive ? 'primary.main' : 'action.hover' },
                }}>
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItemButton>
              );
            })}
          </List>

          <Divider />
          <Box sx={{ p: 1 }}>
            <ListItemButton onClick={() => { logout(); setOpen(false); }} sx={{ borderRadius: 2, color: 'error.main' }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default MobileNav;
