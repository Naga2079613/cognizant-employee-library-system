import { useState, type MouseEvent } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { AccountCircle, Book, ExitToApp } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  if (!user || location.pathname === '/login') {
    return null;
  }

  return (
    <AppBar position="static" sx={{ width: '100%', left: 0, right: 0 }}>
      <Toolbar sx={{ maxWidth: '100%', px: { xs: 2, sm: 3 } }}>
        <Book sx={{ mr: 2, fontSize: '2rem' }} />
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            fontSize: { xs: '1.1rem', sm: '1.5rem' },
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          📚 Cognizant Digital Library
        </Typography>
        
        {user.role === 'employee' && (
          <Box sx={{ mr: 2 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/employee')}
              sx={{ mr: 1 }}
            >
              Dashboard
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/employee/books')}
              sx={{ mr: 1 }}
            >
              Browse Books
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/employee/requests')}
            >
              My Requests
            </Button>
          </Box>
        )}

        {user.role === 'admin' && (
          <Box sx={{ mr: 2 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/admin')}
              sx={{ mr: 1 }}
            >
              Dashboard
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/admin/books')}
              sx={{ mr: 1 }}
            >
              Manage Books
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/admin/requests')}
            >
              Manage Requests
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            {user.name}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
