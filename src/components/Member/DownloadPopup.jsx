import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  Box,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { StyledButton } from '../../ui/StyledButton';
import { ReactComponent as ExcelIcon } from '../../assets/icons/excel-icon.svg';
import { ReactComponent as PdfIcon } from '../../assets/icons/pdf-icon.svg';
import { ReactComponent as CloseIcon } from '../../assets/icons/CloseIcon.svg';

const DownloadPopup = ({ open, onClose, onDownloadExcel, onDownloadPDF, loading }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: 0,
          minWidth: '400px',
          maxWidth: '500px',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 24px 16px 24px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <Typography variant="h5" fontWeight={600} color="textPrimary">
          Download Report
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '24px' }}>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          Choose your preferred format to download the member data. 
          {loading && ' The download will include any applied filters.'}
        </Typography>

        <Stack spacing={2}>
          {/* Excel Option */}
          <Box
            onClick={loading ? null : onDownloadExcel}
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.6 : 1,
              '&:hover': loading ? {} : {
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.04)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)',
              },
            }}
          >
            <Box
              sx={{
                width: '48px',
                height: '48px',
                backgroundColor: '#4caf50',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <ExcelIcon style={{ width: '24px', height: '24px', fill: 'white' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={600} color="textPrimary">
                Excel Format (.xlsx)
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Download as Excel spreadsheet with formatting
              </Typography>
              {loading && (
                <CircularProgress size={16} sx={{ ml: 1, color: '#4caf50' }} />
              )}
            </Box>
          </Box>

          {/* PDF Option */}
          <Box
            onClick={loading ? null : onDownloadPDF}
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.6 : 1,
              '&:hover': loading ? {} : {
                borderColor: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.04)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.15)',
              },
            }}
          >
            <Box
              sx={{
                width: '48px',
                height: '48px',
                backgroundColor: '#f44336',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <PdfIcon style={{ width: '24px', height: '24px', fill: 'white' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={600} color="textPrimary">
                PDF Format (.pdf)
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Download as professional PDF document
              </Typography>
              {loading && (
                <CircularProgress size={16} sx={{ ml: 1, color: '#f44336' }} />
              )}
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ padding: '16px 24px 24px 24px' }}>
        <StyledButton
          name="Cancel"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        />
      </DialogActions>
    </Dialog>
  );
};

export default DownloadPopup;
