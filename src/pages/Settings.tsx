import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Avatar, CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/services/api';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    userApi.getProfile().then(res => {
      const u = res.data?.data;
      if (u) setProfileData({ name: u.name, phone: u.phone });
    }).catch(() => {
      if (user) setProfileData({ name: user.name, phone: user.phone });
    });
  }, [user]);

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      await userApi.updateProfile(profileData);
      toast.success('Profile updated successfully');
      // Update session
      const stored = sessionStorage.getItem('currentUser');
      if (stored) {
        const u = JSON.parse(stored);
        u.name = profileData.name;
        u.phone = profileData.phone;
        sessionStorage.setItem('currentUser', JSON.stringify(u));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) { toast.error('New passwords do not match'); return; }
    if (passwordData.new.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setChangingPw(true);
    try {
      await userApi.changePassword(passwordData.current, passwordData.new);
      toast.success('Password changed successfully');
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 700 }}>
        <Box>
          <Typography variant="h5">My Profile</Typography>
          <Typography variant="body2" color="text.secondary">Manage your profile and password</Typography>
        </Box>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.light', width: 36, height: 36 }}><PersonIcon fontSize="small" /></Avatar>
              <Typography variant="h6">Profile Information</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Full Name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Email" value={user?.email || ''} disabled helperText="Email cannot be changed" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Phone Number" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} helperText="10 digits starting with 6-9" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Role" value={user?.role || ''} disabled />
              </Grid>
              <Grid size={12}>
                <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />} onClick={handleProfileSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Avatar sx={{ bgcolor: 'warning.light', width: 36, height: 36 }}><LockIcon fontSize="small" /></Avatar>
              <Typography variant="h6">Change Password</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
              <TextField fullWidth label="Current Password" type="password" value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} />
              <TextField fullWidth label="New Password" type="password" value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} helperText="Minimum 6 characters" />
              <TextField fullWidth label="Confirm New Password" type="password" value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} />
              <Button variant="contained" color="warning" startIcon={changingPw ? <CircularProgress size={16} color="inherit" /> : <LockIcon />} onClick={handlePasswordChange} disabled={changingPw}>
                {changingPw ? 'Changing...' : 'Change Password'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
};

export default Settings;
