import {  signOut } from 'firebase/auth'
import { collection, getDocs, getFirestore, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Button, Text, View } from 'react-native'
import { auth, db } from '../config'
const Dashboard = () => {
    const [allScores, setAllScores] = useState([]);
    useEffect(() => {
        const fetchScore = async () => {
            try {
                const q = query(collection(db, "scoreboard"));
                const querySnapshot = await getDocs(q);
                const scores = []
                querySnapshot.forEach((doc) => {
                    scores.push(doc.data())
                });
                setAllScores(scores)
            } catch (error) {
                console.log('hello', error)
            }

        }
        fetchScore()
    }, [])



    return (
        <View style={{ padding: 20 }} >
            <Button
                title="Logout"
                onPress={() => signOut(auth)}
            />
            <Text> Dashboard </Text>
            {allScores.map((e, i) => (
                <Text
                    key={i}
                >
                    {JSON.stringify(e)}
                </Text>
            ))}
        </View>
    )
}

export default Dashboard