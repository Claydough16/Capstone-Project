import React, { useState, useEffect } from 'react'
import { baseURL } from "../../environment";
function useProfile() {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [age, setAge] = useState('')
    const [userName, setUserName] = useState('')
    const [bio, setBio] = useState('')
    const [country, setCountry] = useState('')
    const [travelPreferences, setTravelPreferences] = useState('')
    const [interests, setInterests] = useState('')

    const getProfile = async () => {
        const token = localStorage.getItem("token")
        const url = `${baseURL}/user/profile`

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
        });
        const data = await res.json();
        
        if (res.status === 200) {
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setAge(data.age);
            setUserName(data.userName);
            setBio(data.bio);
            setCountry(data.country);
            setTravelPreferences(data.travelPreferences);
            setInterests(data.interests);
        } else {
            console.error("Failed to retrieve profile data", res.status, res.statusText)
        }

    }
    const updateProfile = async (age, userName, bio, country, travelPreferences, interests) => {
        const token = localStorage.getItem("token")
        const url = `${baseURL}/user/profile`

        const body = JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            age: age,
            userName: userName,
            bio: bio,
            country: country,
            travelPreferences: travelPreferences,
            interests: interests  
        })

        const res = await fetch(url, {
            method: "POST",
            body: body,
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
        });
        const data = await res.json();

    }

    useEffect(() => {
        getProfile();
    }, [])

    return {
        firstName, lastName, age, userName, bio, country, travelPreferences, interests,
        getProfile, updateProfile
    }
}

export default useProfile