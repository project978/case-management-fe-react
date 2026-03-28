import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, IconButton, Typography, Box,
  Chip, Divider, CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DescriptionIcon from '@mui/icons-material/Description';
import ChatIcon from '@mui/icons-material/Chat';
import { CollectionCase } from '@/types';
import { casesApi } from '@/services/api';

interface CaseDetailsModalProps {
  caseData: CollectionCase | null;
  isOpen: boolean;
  onClose: () => void;
}

const CaseDetailsModal: React.FC<CaseDetailsModalProps> = ({ caseData, isOpen, onClose }) => {
  const [fullCase, setFullCase] = useState<CollectionCase | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && caseData?.id) {
      setLoading(true);
      casesApi.getById(caseData.id)
        .then(res => setFullCase(res.data?.data || caseData))
        .catch(() => setFullCase(caseData))
        .finally(() => setLoading(false));
    }
  }, [isOpen, caseData]);

  if (!caseData) return null;
  const c = fullCase || caseData;

  const fmt = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount || 0);

  const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={600} sx={{ textAlign: 'right' }}>{value}</Typography>
    </Box>
  );

  const getStatusColor = (s: string) => {
    if (s === 'FLOW') return 'primary';
    if (s === 'CURED') return 'success';
    return 'warning';
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Case Details
          <Chip label={c.hoStatus} size="small" color={getStatusColor(c.hoStatus) as any} />
        </Box>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <DescriptionIcon fontSize="small" color="primary" />
                <Typography variant="subtitle1" fontWeight={600}>Party Information</Typography>
              </Box>
              <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 2 }}>
                <InfoRow label="Party Name" value={c.partyName} />
                <InfoRow label="APAC ID" value={c.apac} />
                <InfoRow label="M Collect ID" value={c.mcollectId || '—'} />
                <InfoRow label="Bucket" value={c.bkt || '—'} />
                <InfoRow label="HO Status" value={c.hoStatus} />
              </Box>
            </Box>

            <Divider />

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <PhoneIcon fontSize="small" color="primary" />
                <Typography variant="subtitle1" fontWeight={600}>Contact Details</Typography>
              </Box>
              <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 2 }}>
                <InfoRow label="Customer Contact" value={c.customerContactNo || '—'} />
                <InfoRow label="FOS" value={c.fos || c.assignedUser?.name || '—'} />
                <InfoRow label="FOS Contact" value={c.fosContactNo || '—'} />
              </Box>
            </Box>

            <Divider />

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <LocationOnIcon fontSize="small" color="primary" />
                <Typography variant="subtitle1" fontWeight={600}>Address</Typography>
              </Box>
              <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 2 }}>
                <Typography variant="body2" color="text.secondary">{c.address || '—'}</Typography>
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>Financial Details</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 2 }}>
                    <InfoRow label="EMI" value={fmt(c.emi)} />
                    <InfoRow label="POS" value={fmt(c.pos)} />
                    <InfoRow label="Case Value" value={fmt(c.caseValue)} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 2 }}>
                    <InfoRow label="LM FRI" value={(c.lmFri || 0).toFixed(2)} />
                    <InfoRow label="Current FRI" value={(c.curFri || 0).toFixed(2)} />
                    <InfoRow label="OD without FRI" value={fmt(c.odWithoutFri)} />
                    <InfoRow label="OD with FRI" value={fmt(c.odWithFri)} />
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {c.assetName && (
              <>
                <Divider />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <DirectionsCarIcon fontSize="small" color="primary" />
                    <Typography variant="subtitle1" fontWeight={600}>Asset Details</Typography>
                  </Box>
                  <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 2 }}>
                    <InfoRow label="Asset Name" value={c.assetName} />
                    <InfoRow label="Registration No." value={c.registrationNumber || '—'} />
                    <InfoRow label="Engine No." value={c.engineNo || '—'} />
                    <InfoRow label="Chassis No." value={c.chassisNo || '—'} />
                  </Box>
                </Box>
              </>
            )}

            {/* Comments */}
            {c.comments && c.comments.length > 0 && (
              <>
                <Divider />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <ChatIcon fontSize="small" color="primary" />
                    <Typography variant="subtitle1" fontWeight={600}>Comments ({c.comments.length})</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {c.comments.map((comment) => (
                      <Box key={comment.id} sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={600}>{comment.commentedByName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(comment.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2">{comment.comment}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CaseDetailsModal;
