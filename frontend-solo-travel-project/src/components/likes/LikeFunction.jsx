import React, { useState, useEffect } from "react";
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';
import { baseURL } from "../../environment/index";

const LikeFunction = ({ postId, userId, token, updateLikeCount, likeCount }) => {
    const [liked, setLiked] = useState(() => {
        const previousLikeStatus = localStorage.getItem(`like_${userId}_${postId}`);
        return previousLikeStatus === "liked";
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLikeStatus = async () => {
            setLoading(true);
            const url = `${baseURL}/post/status/${postId}`;

            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                const res = await fetch(url, options);
                if (res.ok) {
                    const data = await res.json();
                    updateLikeCount(data.likes.length);
                } else {
                    console.error("Failed to fetch like status");
                }
            } catch (err) {
                console.error("Error fetching like status:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLikeStatus();
    }, [postId, token, updateLikeCount]);

    const toggleLike = async () => {
        if (!loading) {
            setLoading(true);
            const action = liked ? "unlike" : "like";
            const url = `${baseURL}/post/${postId}/${action}`;

            const options = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId }),
            };

            try {
                const res = await fetch(url, options);
                const data = await res.json();

                if (res.ok) {
                    setLiked(!liked);
                    updateLikeCount(liked ? likeCount - 1 : likeCount + 1);
                    // Update local storage
                    localStorage.setItem(`like_${userId}_${postId}`, liked ? "unliked" : "liked");
                } else {
                    console.error("Error toggling like:", data.message);
                }
            } catch (err) {
                console.error("Error toggling like:", err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <Button
                onClick={toggleLike}
                variant="contained"
                disabled={loading}
                startIcon={<StarIcon sx={{ color: liked ? "#b8860b" : "gray" }} />} 
                style={{ 
                    backgroundColor: liked ? "#e0e0e0" : "#f0f0f0", 
                    color: "black",
                    textTransform: "none", 
                    border: liked ? "1px solid #b8860b" : "1px solid #f0f0f0", 
                    borderRadius: "4px", 
                }}
            >
                Interested
            </Button>
            <span style={{ marginLeft: 8 }}>{likeCount}</span>
        </div>
    );
};

export default LikeFunction;
