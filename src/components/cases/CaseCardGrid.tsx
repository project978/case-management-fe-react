import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';
import PhoneIcon from '@mui/icons-material/Phone';
import { CollectionCase } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import CaseDetailsModal from './CaseDetailsModal';
import UpdateStatusModal from './UpdateStatusModal';

interface CaseCardGridProps {
  cases: CollectionCase[];
  onStatusUpdate: (caseId: string, data: any) => void;
  onDelete: (caseId: string) => void;
  onAddComment: (caseId: string, comment: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'FLOW': return 'primary';
    case 'CURED': return 'success';
    default: return 'warning';
  }
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

const CaseCardGrid: React.FC<CaseCardGridProps> = ({ cases, onStatusUpdate, onDelete, onAddComment }) => {
  const { isAdmin } = useAuth();
  const [selectedCase, setSelectedCase] = useState<CollectionCase | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentCaseId, setCommentCaseId] = useState('');

  if (cases.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Typography color="text.secondary">No cases found matching your filters</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {cases.map((caseItem) => (
          <Grid size={{ xs: 12, sm: 6, xl: 4 }} key={caseItem.id}>
            <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 }, transition: 'box-shadow 0.2s' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700} noWrap>{caseItem.partyName}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>{caseItem.apac}</Typography>
                  </Box>
                  <Chip label={caseItem.hoStatus} size="small" color={getStatusColor(caseItem.hoStatus) as any} />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Reg. No.</Typography>
                    <Typography variant="caption" fontWeight={600} sx={{ fontFamily: 'monospace' }}>{caseItem.registrationNumber || '—'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Contact</Typography>
                    <Box component="a" href={`tel:${caseItem.customerContactNo}`} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main', textDecoration: 'none', fontSize: '0.75rem' }}>
                      <PhoneIcon sx={{ fontSize: 12 }} />{caseItem.customerContactNo || '—'}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">FOS</Typography>
                    <Typography variant="caption" fontWeight={600}>{caseItem.fos || caseItem.assignedUser?.name || '—'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Bucket</Typography>
                    <Typography variant="caption" fontWeight={600}>{caseItem.bkt || '—'}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">EMI</Typography>
                    <Typography variant="body2" fontWeight={700}>{formatCurrency(caseItem.emi)}</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">POS</Typography>
                    <Typography variant="body2" fontWeight={700}>{formatCurrency(caseItem.pos)}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => { setSelectedCase(caseItem); setShowDetails(true); }}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Add Comment">
                    <IconButton size="small" color="info" onClick={() => { setCommentCaseId(caseItem.id); setCommentText(''); setShowComment(true); }}>
                      <CommentIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Case">
                    <IconButton size="small" color="primary" onClick={() => { setSelectedCase(caseItem); setShowUpdateStatus(true); }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {isAdmin && (
                    <Tooltip title="Delete Case">
                      <IconButton size="small" color="error" onClick={() => { if (window.confirm('Are you sure you want to delete this case?')) onDelete(caseItem.id); }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <CaseDetailsModal caseData={selectedCase} isOpen={showDetails} onClose={() => setShowDetails(false)} />
      <UpdateStatusModal
        caseData={selectedCase}
        isOpen={showUpdateStatus}
        onClose={() => setShowUpdateStatus(false)}
        onUpdate={(data) => {
          if (selectedCase) onStatusUpdate(selectedCase.id, data);
          setShowUpdateStatus(false);
        }}
      />

      {/* Comment Dialog */}
      <Dialog open={showComment} onClose={() => setShowComment(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField fullWidth multiline rows={3} label="Comment" value={commentText} onChange={(e) => setCommentText(e.target.value)} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowComment(false)}>Cancel</Button>
          <Button variant="contained" disabled={!commentText.trim()} onClick={() => { onAddComment(commentCaseId, commentText); setShowComment(false); }}>
            Add Comment
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CaseCardGrid;
