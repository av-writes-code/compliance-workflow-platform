import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2', // Compliance Blue
    },
    success: {
      main: '#2E7D32', // Success Green
    },
    warning: {
      main: '#ED6C02', // Warning Yellow
    },
    error: {
      main: '#D32F2F', // Error Red
    },
    info: {
      main: '#0288D1', // In Progress Blue
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '32px',
      fontWeight: 600,
    },
    h2: {
      fontSize: '24px',
      fontWeight: 600,
    },
    h3: {
      fontSize: '20px',
      fontWeight: 500,
    },
    h4: {
      fontSize: '16px',
      fontWeight: 500,
    },
    body1: {
      fontSize: '14px',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '12px',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
        },
      },
    },
  },
});

export const statusColors = {
  draft: '#757575',
  inProgress: '#0288D1',
  underReview: '#7B1FA2',
  approved: '#388E3C',
  rejected: '#C62828',
  expired: '#EF6C00',
  passing: '#2E7D32',
  failing: '#D32F2F',
  pending: '#ED6C02',
  notTested: '#757575',
};

export const evidenceColors = {
  current: '#C8E6C9',
  expiringSoon: '#FFF9C4',
  expired: '#FFCDD2',
};

export const riskColors = {
  low: '#C8E6C9',
  medium: '#FFF9C4',
  high: '#FFCDD2',
  critical: '#C62828',
};
