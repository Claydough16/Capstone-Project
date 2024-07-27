import React, { useState, useEffect } from 'react';
import PostCard from '../posts/Posts';
import { baseURL } from '../../environment/index';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SiteFooter from '../footer/Footer';

const MyLikes = ({ userId, token }) => {
    const [likedPosts, setLikedPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLikedPosts = async () => {
            if (!userId) {
                setError('User ID not provided');
                return;
            }

            const url = `${baseURL}/user/${userId}/Interested`;

            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                const res = await fetch(url, options);
                if (res.ok) {
                    const data = await res.json();
                    setLikedPosts(data);
                    localStorage.setItem('likedPosts', JSON.stringify(data));
                } else {
                    setError('Failed to fetch liked posts');
                }
            } catch (err) {
                setError(`Error: ${err.message}`);
            }
        };

        const likedPostsFromStorage = localStorage.getItem('likedPosts');
        if (likedPostsFromStorage) {
            setLikedPosts(JSON.parse(likedPostsFromStorage));
        }

        fetchLikedPosts();
    }, [userId, token]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Box sx={{ paddingTop: 10 }}>
            <Grid container spacing={3} sx={{ padding: 2 }}>
                {likedPosts.length > 0 ? (
                    likedPosts.map((post) => (
                        <Grid item key={post._id}>
                            <PostCard post={post} userId={userId} token={token} />
                        </Grid>
                    ))
                ) : (
                    <div style={{ marginLeft: '15px', fontSize: '22px', textAlign: 'center' }}>No Interested Events</div>
                )}
            </Grid>
        </Box>

    );
};

export default MyLikes;
