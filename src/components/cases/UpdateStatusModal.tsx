import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Typography, CircularProgress,
} from '@mui/material';
import { CollectionCase, HOStatus } from '@/types';

interface UpdateStatusModalProps {
  caseData: CollectionCase | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ caseData, isOpen, onClose, onUpdate }) => {
  const [hoStatus, setHoStatus] = useState<HOStatus>('FLOW');
  const [fos, setFos] = useState('');
  const [fosContactNo, setFosContactNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (caseData) {
      setHoStatus(caseData.hoStatus);
      setFos(caseData.fos || '');
      setFosContactNo(caseData.fosContactNo || '');
    }
  }, [caseData]);

  if (!caseData) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    onUpdate({
      apac: caseData.apac,
      partyName: caseData.partyName,
      hoStatus,
      fos,
      fosContactNo,
      customerContactNo: caseData.customerContactNo,
      bkt: caseData.bkt,
      emi: caseData.emi,
      pos: caseData.pos,
      caseValue: caseData.caseValue,
      lmFri: caseData.lmFri,
      curFri: caseData.curFri,
      odWithoutFri: caseData.odWithoutFri,
      odWithFri: caseData.odWithFri,
      address: caseData.address,
      assetName: caseData.assetName,
      registrationNumber: caseData.registrationNumber,
      engineNo: caseData.engineNo,
      chassisNo: caseData.chassisNo,
      mcollectId: caseData.mcollectId,
    });
    setIsSubmitting(false);
  };

  const statuses: HOStatus[] = ['CURED', 'FLOW', 'RB', 'STAB', 'ECS'];

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Case</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Party: <strong>{caseData.partyName}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Current HO Status: <strong>{caseData.hoStatus}</strong>
        </Typography>
        <TextField fullWidth select label="HO Status" value={hoStatus} onChange={(e) => setHoStatus(e.target.value as HOStatus)} sx={{ mb: 2 }}>
          {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <TextField fullWidth label="FOS Name" value={fos} onChange={(e) => setFos(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="FOS Contact No" value={fosContactNo} onChange={(e) => setFosContactNo(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : undefined}>
          {isSubmitting ? 'Updating...' : 'Update Case'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateStatusModal;
