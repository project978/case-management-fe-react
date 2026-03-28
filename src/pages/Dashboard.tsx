import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, LinearProgress, Avatar,
  TextField, MenuItem, CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import MainLayout from '@/components/layout/MainLayout';
import { casesApi, adminUsersApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { CollectionCase, User } from '@/types';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [cases, setCases] = useState<CollectionCase[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUserId, setFilterUserId] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await casesApi.list({ size: 1000 });
        setCases(res.data?.data?.content || []);
        if (isAdmin) {
          const uRes = await adminUsersApi.list();
          setAllUsers(uRes.data?.data || []);
        }
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [isAdmin]);

  const filteredCases = useMemo(() => {
    let result = cases;
    if (filterUserId !== 'ALL') result = result.filter(c => c.assignedUser?.id === filterUserId);
    if (filterStatus !== 'ALL') result = result.filter(c => c.hoStatus === filterStatus);
    return result;
  }, [cases, filterUserId, filterStatus]);

  const stats = useMemo(() => ({
    totalCases: filteredCases.length,
    flowCases: filteredCases.filter(c => c.hoStatus === 'FLOW').length,
    curedCases: filteredCases.filter(c => c.hoStatus === 'CURED').length,
    totalPOS: filteredCases.reduce((s, c) => s + (c.pos || 0), 0),
    totalEMI: filteredCases.reduce((s, c) => s + (c.emi || 0), 0),
  }), [filteredCases]);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusColor = (s: string) => {
    if (s === 'FLOW') return 'primary';
    if (s === 'CURED') return 'success';
    return 'warning';
  };

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  const statCards = [
    { title: 'Total Cases', value: stats.totalCases, icon: <DescriptionIcon />, color: '#1565C0', bg: '#E3F2FD' },
    { title: 'Flow Cases', value: stats.flowCases, icon: <TrendingUpIcon />, color: '#1565C0', bg: '#E3F2FD' },
    { title: 'Cured Cases', value: stats.curedCases, icon: <CheckCircleIcon />, color: '#2E7D32', bg: '#E8F5E9' },
    { title: 'Total EMI', value: formatCurrency(stats.totalEMI), icon: <CurrencyRupeeIcon />, color: '#6B7A90', bg: '#F5F7FA' },
    { title: 'Total POS', value: formatCurrency(stats.totalPOS), icon: <CurrencyRupeeIcon />, color: '#6B7A90', bg: '#F5F7FA' },
  ];

  const statusOptions = ['ALL', 'CURED', 'FLOW', 'RB', 'STAB', 'ECS'];

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h5">Welcome back, {user?.name?.split(' ')[0]}!</Typography>
          <Typography variant="body2" color="text.secondary">Here's what's happening with your  cases today.</Typography>
        </Box>

        {/* Filters */}
        <Card>
          <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField select size="small" label="Filter by User" value={filterUserId} onChange={(e) => setFilterUserId(e.target.value)} sx={{ minWidth: 200 }}>
              <MenuItem value="ALL">All Users</MenuItem>
              {allUsers.map(u => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Filter by Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} sx={{ minWidth: 200 }}>
              {statusOptions.map(s => <MenuItem key={s} value={s}>{s === 'ALL' ? 'All Status' : s}</MenuItem>)}
            </TextField>
          </CardContent>
        </Card>

        {/* Stat Cards */}
        <Grid container spacing={2}>
          {statCards.map((s) => (
            <Grid size={{ xs: 6, sm: 4, lg: 2.4 }} key={s.title}>
              <Card>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{s.title}</Typography>
                    <Typography variant="h5" fontWeight={700}>{s.value}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: s.bg, color: s.color, width: 44, height: 44 }}>{s.icon}</Avatar>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Cases */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Recent Cases</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {filteredCases.slice(0, 5).map((c) => (
                    <Box key={c.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>{c.partyName}</Typography>
                        <Typography variant="caption" color="text.secondary">{c.fos || c.assignedUser?.name || '—'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Chip label={c.hoStatus} size="small" color={getStatusColor(c.hoStatus) as any} />
                        <Typography variant="body2" fontWeight={600}>₹{(c.emi || 0).toLocaleString('en-IN')}</Typography>
                      </Box>
                    </Box>
                  ))}
                  {filteredCases.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>No cases found</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>FOS Summary</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {Array.from(new Set(filteredCases.map(c => c.fos).filter(Boolean))).slice(0, 5).map((fos) => {
                    const fosCases = filteredCases.filter(c => c.fos === fos);
                    const cured = fosCases.filter(c => c.hoStatus === 'CURED').length;
                    const progress = fosCases.length > 0 ? (cured / fosCases.length) * 100 : 0;
                    return (
                      <Box key={fos} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" fontWeight={600}>{fos}</Typography>
                          <Typography variant="caption" color="text.secondary">{cured}/{fosCases.length} cured</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default Dashboard;
