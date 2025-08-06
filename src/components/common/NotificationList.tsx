import { Snackbar, Alert, Box } from '@mui/material';
import { useNotification } from '../../contexts/NotificationContext';

const NotificationList = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80,
        right: 20,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={5000}
          onClose={() => removeNotification(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => removeNotification(notification.id)}
            severity={notification.type}
            sx={{ width: '100%' }}
          >
            <strong>{notification.title}</strong>
            <br />
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default NotificationList;
