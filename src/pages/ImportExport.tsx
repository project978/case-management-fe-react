import React, { useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Avatar,
  CircularProgress, Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MainLayout from '@/components/layout/MainLayout';
import { importExportApi } from '@/services/api';
import { ImportResult } from '@/types';
import { toast } from 'sonner';

const ImportExport: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<ImportResult | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadResult(null);
    setUploadError('');

    try {
      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
      const res = isExcel
        ? await importExportApi.importExcel(file)
        : await importExportApi.importCsv(file);
      setUploadResult(res.data?.data);
      toast.success('Import completed', { description: `${res.data?.data?.successCount || 0} records imported` });
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Import failed');
      toast.error('Import failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const res = await importExportApi.exportExcel();
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cases_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Excel export completed');
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const res = await importExportApi.exportCsv();
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cases_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('CSV export completed');
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('⚠️ WARNING: This will permanently delete ALL cases from the database. Are you sure?')) return;
    if (!window.confirm('This action cannot be undone. Confirm delete ALL cases?')) return;
    setIsDeleting(true);
    try {
      await importExportApi.deleteAll();
      toast.success('All cases deleted from database');
    } catch (err) {
      toast.error('Failed to delete cases');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h5">Import / Export</Typography>
          <Typography variant="body2" color="text.secondary">Import cases from Excel/CSV or export current data</Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Import */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#E3F2FD', color: 'primary.main' }}><CloudUploadIcon /></Avatar>
                  <Box>
                    <Typography variant="h6">Import Cases</Typography>
                    <Typography variant="body2" color="text.secondary">Upload Excel (.xlsx) or CSV file — any size</Typography>
                  </Box>
                </Box>

                <Box onClick={() => fileInputRef.current?.click()} sx={{
                  border: '2px dashed', borderColor: 'divider', borderRadius: 2, p: 4,
                  textAlign: 'center', cursor: 'pointer',
                  '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }, transition: 'all 0.2s',
                }}>
                  <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} hidden />
                  {isUploading ? (
                    <Box><CircularProgress size={40} /><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Processing...</Typography></Box>
                  ) : (
                    <Box><InsertDriveFileIcon sx={{ fontSize: 40, color: 'text.secondary' }} /><Typography variant="body2" sx={{ mt: 1 }}>Click to upload or drag and drop</Typography><Typography variant="caption" color="text.secondary">.xlsx, .xls, .csv — no size limit</Typography></Box>
                  )}
                </Box>

                {uploadResult && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="body2">Total: {uploadResult.totalRows} | Success: {uploadResult.successCount} | Failed: {uploadResult.failedCount}</Typography>
                    {uploadResult.errors?.length > 0 && (
                      <Box sx={{ mt: 1 }}>{uploadResult.errors.slice(0, 5).map((e, i) => <Typography key={i} variant="caption" display="block">{e}</Typography>)}</Box>
                    )}
                  </Alert>
                )}
                {uploadError && <Alert severity="error" sx={{ mt: 2 }}>{uploadError}</Alert>}
              </CardContent>
            </Card>
          </Grid>

          {/* Export */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#E8F5E9', color: 'success.main' }}><CloudDownloadIcon /></Avatar>
                  <Box>
                    <Typography variant="h6">Export Cases</Typography>
                    <Typography variant="body2" color="text.secondary">Download all cases</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button variant="contained" color="success" fullWidth startIcon={isExporting ? <CircularProgress size={20} color="inherit" /> : <CloudDownloadIcon />}
                    onClick={handleExportExcel} disabled={isExporting}>
                    Export as Excel (.xlsx)
                  </Button>
                  <Button variant="outlined" color="success" fullWidth startIcon={isExporting ? <CircularProgress size={20} color="inherit" /> : <CloudDownloadIcon />}
                    onClick={handleExportCsv} disabled={isExporting}>
                    Export as CSV
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Delete All */}
        <Card sx={{ border: '1px solid', borderColor: 'error.main' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#FFEBEE', color: 'error.main' }}><DeleteForeverIcon /></Avatar>
              <Box>
                <Typography variant="h6" color="error">Danger Zone</Typography>
                <Typography variant="body2" color="text.secondary">Delete all cases from database before a fresh import</Typography>
              </Box>
            </Box>
            <Button variant="contained" color="error" startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteForeverIcon />}
              onClick={handleDeleteAll} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete ALL Cases'}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
};

export default ImportExport;
