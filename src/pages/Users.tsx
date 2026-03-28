import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Avatar, Chip, IconButton,
  Button, TextField, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem, Tooltip, CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EditIcon from '@mui/icons-material/Edit';
import MainLayout from '@/components/layout/MainLayout';
import { adminUsersApi } from '@/services/api';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'USER' as UserRole });

  const fetchUsers = async () => {
    try {
      const res = await adminUsersApi.list();
      setUsers(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = async () => {
    try {
      await adminUsersApi.create(formData);
      toast.success('User created successfully');
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '', password: '', role: 'USER' });
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    try {
      await adminUsersApi.update(selectedUser.id, formData);
      toast.success('User updated successfully');
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminUsersApi.delete(userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, phone: user.phone, password: '', role: user.role });
    setShowEditModal(true);
  };

  const getRoleColor = (role: UserRole) => role === 'ADMIN' ? 'error' : 'success';

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="h5">User Management</Typography>
            <Typography variant="body2" color="text.secondary">Manage system users and their roles</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setFormData({ name: '', email: '', phone: '', password: '', role: 'USER' }); setShowAddModal(true); }}>
            Add User
          </Button>
        </Box>

        <Card>
          <CardContent sx={{ pb: '16px !important' }}>
            <TextField size="small" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
              sx={{ maxWidth: 350 }} fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
            />
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          {filteredUsers.map((user) => (
            <Grid size={{ xs: 12, sm: 6, xl: 4 }} key={user.id}>
              <Card sx={{ '&:hover': { boxShadow: 6 }, transition: 'box-shadow 0.2s' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44, fontWeight: 700 }}>
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>{user.name}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{user.id.slice(0, 8)}</Typography>
                      </Box>
                    </Box>
                    <Chip label={user.role} size="small" color={getRoleColor(user.role)} sx={{ textTransform: 'capitalize' }} />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <EmailIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2" noWrap>{user.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <PhoneIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2">{user.phone}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Tooltip title="Edit User">
                      <Button size="small" startIcon={<EditIcon />} onClick={() => openEditModal(user)} sx={{ flex: 1 }}>Edit</Button>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteUser(user.id)} sx={{ flex: 1 }}>Delete</Button>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Add User Dialog */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <TextField fullWidth label="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} helperText="10 digits starting with 6-9" />
            <TextField fullWidth label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            <TextField fullWidth select label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="USER">User</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddUser}>Add User</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <TextField fullWidth label="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <TextField fullWidth label="Password (leave blank to keep)" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            <TextField fullWidth select label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="USER">User</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditUser}>Update User</Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default Users;
