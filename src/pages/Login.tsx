import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, CircularProgress, Alert, Paper,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import ShieldIcon from '@mui/icons-material/Shield';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(email, password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    setIsLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <Box sx={{
        display: { xs: 'none', lg: 'flex' }, width: '50%',
        background: 'linear-gradient(135deg, #1A2332, #1565C0)',
        p: 6, flexDirection: 'column', justifyContent: 'space-between', color: '#fff',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 48, height: 48, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldIcon sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h5" fontWeight={700}>Case Management</Typography>
        </Box>
        <Box>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2, lineHeight: 1.2 }}>
            Streamline Your<br />Case Management
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 400 }}>
            Efficiently manage your  cases, track field officers, and monitor status updates in real-time.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 6 }}>
          {[{ val: '500+', label: 'Active Cases' }, { val: '98%', label: 'Resolution Rate' }, { val: '24/7', label: 'Support' }].map(s => (
            <Box key={s.label}>
              <Typography variant="h4" fontWeight={700}>{s.val}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <Box sx={{ display: { lg: 'none' }, textAlign: 'center', mb: 4 }}>
            <Box sx={{ width: 40, height: 40, bgcolor: 'primary.main', borderRadius: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <ShieldIcon sx={{ color: '#fff' }} />
            </Box>
            <Typography variant="h6" fontWeight={700}>CollectPro</Typography>
          </Box>

          <Typography variant="h5" fontWeight={700} gutterBottom>Welcome back</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Sign in to your account to continue</Typography>

          <form onSubmit={handleSubmit}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required sx={{ mb: 2.5 }} />
            <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <Paper variant="outlined" sx={{ mt: 4, p: 2.5, bgcolor: 'action.hover' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Login with your email and password</Typography>
            <Typography variant="body2" color="text.secondary">Contact your administrator for credentials</Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
