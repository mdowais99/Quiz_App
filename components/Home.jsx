import { getAuth, signOut } from 'firebase/auth';
import React from 'react'
import { Button, Text, TouchableOpacity, View } from 'react-native'
import { app, auth } from '../config';

const Home = ({ navigation }) => {
    const questionTypes = {
        GK: [
            {
                id: 1,
                question: 'Who is owais',
                options: ["Male", "Female"],
                right: 'Female'
            },
            {
                id: 2,
                question: 'What does He do?',
                options: ["Bakchodi", "Bht zyada bakchodi"],
                right: "Bht zyada bakchodi"
            }
        ],
        Science: [
            {
                id: 1,
                question: 'How many branches of science?',
                options: ['1', '2', '3'],
                right: '3'
            }
        ],
        Maths: [
            {
                id: 1,
                question: 'What is triangle?',
                options: ['shape', 'human', 'animal'],
                right: 'shape'
            },
            {
                id: 2,
                question: 'How many sides of a triangle?',
                options: ['1', '2', '3', '4'],
                right: '3'
            },
            {
                id: 3,
                question: 'How many sides of a circle?',
                options: ['0', '2', '3', '4'],
                right: '0'
            },
        ]
    }
    return (
        <View style={{
            paddingTop: 50,
            paddingHorizontal: 20
        }}>
            <Button
                title="Logout"
                onPress={() => signOut(auth)}
            />
            {Object.keys(questionTypes).map(question => (
                <TouchableOpacity style={{ borderWidth: 1, borderColor: 'black', marginBottom: 10, padding: 10 }} key={question} onPress={() =>
                    navigation.navigate('Questions', { questionType: question, selectedQuestion: questionTypes[question] })
                }>
                    <Text>Quiz: {question}</Text>
                    <Text> Questions: {questionTypes[question].length} </Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

export default Home