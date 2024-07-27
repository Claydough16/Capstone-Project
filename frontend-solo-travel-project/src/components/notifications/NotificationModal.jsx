import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns'; 
import { baseURL } from '../../environment';
import Button from '@mui/material/Button'; 
import Tooltip from '@mui/material/Tooltip'; 
import Dialog from '@mui/material/Dialog'; 
import DialogContent from '@mui/material/DialogContent'; 
import DialogContentText from '@mui/material/DialogContentText'; 
import DialogActions from '@mui/material/DialogActions'; 

const NotificationModal = ({ isOpen, onClose, fetchUnreadCount }) => {
    const [notifications, setNotifications] = useState([]);
    const [isConfirmationOpen, setConfirmationOpen] = useState(false); 

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${baseURL}/notification/messages`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data = await response.json();

            // Calculate time ago for each notification
            const notificationsWithTimeAgo = data.notifications.map(notification => ({
                ...notification,
                timeAgo: formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                }),
            }));

            setNotifications(notificationsWithTimeAgo);

            // Mark notifications as read
            await fetch(`${baseURL}/notification/read`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            // Fetch unread count to update icon
            fetchUnreadCount();
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleClearAllNotifications = () => {
        // Open confirmation dialog
        setConfirmationOpen(true);
    };

    const handleConfirmClearAll = async () => {
        try {
            const token = localStorage.getItem('token');

            // Clear all notifications
            await fetch(`${baseURL}/notification/clear`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            // Fetch notifications again to update the list
            await fetchNotifications();

            // Close confirmation dialog
            setConfirmationOpen(false);
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    const handleCloseConfirmation = () => {
        // Close confirmation dialog
        setConfirmationOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div style={styles.modal}>
            <div style={styles.iconsContainer}>
                {notifications.length > 0 && ( 
                    <Tooltip title="Clear All Notifications">
                        <Button
                            variant="text"
                            color="primary"
                            onClick={handleClearAllNotifications}
                            style={{ textTransform: 'none' }} 
                        >
                            Clear All
                        </Button>
                    </Tooltip>
                )}
                <Tooltip title="Close">
                    <span style={styles.close} onClick={onClose}>×</span>
                </Tooltip>
            </div>
            <div style={styles.notificationContainer}>
                {notifications.length === 0 ? (
                    <p>No new notifications!</p>
                ) : (
                    notifications.map((notification, index) => (
                        <div key={index} style={styles.notification}>
                            <p style={styles.notificationText}>
                                {notification.message} <br />
                                <small>{notification.timeAgo}</small>
                            </p>
                        </div>
                    ))
                )}
            </div>

            <Dialog
                open={isConfirmationOpen}
                onClose={handleCloseConfirmation}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to clear all notifications?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmation} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmClearAll} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const styles = {
    modal: {
        position: 'absolute',
        top: '70px',
        right: '22px',
        width: '350px',
        backgroundColor: 'white',
        border: '2px solid #ccc',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        padding: '12px',
        borderRadius: '5px',
        zIndex: '999',
    },
    close: {
        fontSize: '24px',
        cursor: 'pointer',
        position: 'absolute',
        top: '0px', 
        right: '10px',
    },
    notificationContainer: {
        maxHeight: '300px',
        overflowY: 'auto',
        marginTop: '10px',
        paddingRight: '7px', 
    },
    notification: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '8px',
        marginBottom: '8px',
        backgroundColor: '#f0f0f0',
        transition: 'background-color 0.3s ease',
    },
    notificationText: {
        margin: 0,
        padding: '8px',
        cursor: 'pointer',
    },
    iconsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        position: 'relative', 
    },
};

export default NotificationModal;
