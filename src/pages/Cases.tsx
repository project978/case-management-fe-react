import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Tabs, Tab, CircularProgress, TextField, MenuItem,
  InputAdornment, Card, CardContent, Button,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import MainLayout from '@/components/layout/MainLayout';
import CaseCardGrid from '@/components/cases/CaseCardGrid';
import { casesApi } from '@/services/api';
import { CollectionCase, HOStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Cases: React.FC = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<CollectionCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<HOStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const params: any = { page, size: 50 };
      if (search) params.search = search;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const res = await casesApi.list(params);
      const data = res.data?.data;
      setCases(data?.content || []);
      setTotalPages(data?.totalPages || 0);
    } catch (err) {
      toast.error('Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [page, statusFilter]);

  const handleSearch = () => {
    setPage(0);
    fetchCases();
  };

  const handleStatusUpdate = async (caseId: string, data: any) => {
    try {
      await casesApi.update(caseId, data);
      toast.success('Case updated successfully');
      fetchCases();
    } catch (err) {
      toast.error('Failed to update case');
    }
  };

  const handleDelete = async (caseId: string) => {
    try {
      await casesApi.delete(caseId);
      toast.success('Case deleted successfully');
      fetchCases();
    } catch (err) {
      toast.error('Failed to delete case');
    }
  };

  const handleAddComment = async (caseId: string, comment: string) => {
    try {
      await casesApi.addComment(caseId, comment);
      toast.success('Comment added');
      fetchCases();
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const statusOptions: (HOStatus | 'ALL')[] = ['ALL', 'CURED', 'FLOW', 'RB', 'STAB', 'ECS'];

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="h5">Collection Cases</Typography>
            <Typography variant="body2" color="text.secondary">Manage and track all collection cases</Typography>
          </Box>
        </Box>

        {/* Filters */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <FilterAltIcon fontSize="small" color="action" />
              <Typography variant="subtitle2">Filters</Typography>
              {(search || statusFilter !== 'ALL') && (
                <Button size="small" startIcon={<ClearIcon />} onClick={() => { setSearch(''); setStatusFilter('ALL'); setPage(0); setTimeout(fetchCases, 0); }}>Clear</Button>
              )}
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                <TextField fullWidth size="small" placeholder="Search party name, APAC, reg no..." value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <TextField fullWidth select size="small" label="HO Status" value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value as any); setPage(0); }}>
                  {statusOptions.map(s => <MenuItem key={s} value={s}>{s === 'ALL' ? 'All Status' : s}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                <Button variant="contained" onClick={handleSearch} fullWidth>Search</Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Typography variant="body2" color="text.secondary">
          Showing {cases.length} cases {totalPages > 1 ? `(Page ${page + 1} of ${totalPages})` : ''}
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
        ) : (
          <CaseCardGrid cases={cases} onStatusUpdate={handleStatusUpdate} onDelete={handleDelete} onAddComment={handleAddComment} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>Page {page + 1} of {totalPages}</Typography>
            <Button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</Button>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
};

export default Cases;
