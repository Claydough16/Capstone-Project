import React, { useEffect, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import { baseURL } from '../../environment';

const NotificationIcon = ({ onClick }) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchUnreadCount();
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${baseURL}/notification/unread`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch unread notifications count');
            }

            const data = await response.json();
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error('Error fetching unread notifications count:', error);
        }
    };

    const renderIcon = () => {
        if (unreadCount > 0) {
            return (
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon onClick={onClick} style={{ color: '#f50057' }} />
                </Badge>
            );
        } else {
            return (
                <NotificationsIcon onClick={onClick} />
            );
        }
    };

    return renderIcon();
};

export default NotificationIcon;
