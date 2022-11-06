import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { auth, db } from '../config';
import { addDoc, collection, getFirestore } from "firebase/firestore";
const Questions = ({ navigation, route }) => {
    const user = auth.currentUser;
    const [questionCount, setQuestionCount] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const userAnswers = useRef([]);
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
        ]
    }
    const nextHandler = (answer) => {
        if (currentAnswer) {
            setQuestionCount(questionCount + 1);
            userAnswers.current.push(answer === currentAnswer)
            setCurrentAnswer("");
        } else {
            Alert.alert('Alert', 'Please select any option', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        }
    }
    const submitHanlder = async (answer) => {
        if (currentAnswer) {
            userAnswers.current.push(answer === currentAnswer);
            const totalQuestions = questionTypes[route.params.type].length;
            const rightAnswers = userAnswers.current.filter(a => a === true).length
            const percentage = (rightAnswers * 100) / totalQuestions;
            try {
                const docRef = await addDoc(collection(db, "scoreboard"), {
                    user: user.email,
                    score: percentage,
                    quiz: route.params.type,
                    status: percentage >= 70 ? "pass" : "fail"
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            Alert.alert('Answers', `${rightAnswers}/${totalQuestions}.\n Your percentage is ${percentage}%`, [
                { text: 'OK', onPress: () => navigation.navigate('Home') },
            ])
        } else {
            Alert.alert('Alert', 'Please select any option', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        }
    }
    return (
        <View
            style={{
                paddingHorizontal: 20
            }}
        >
            <Text style={{ textAlign: 'center', fontSize: 30 }} > Quiz: {route.params.type} </Text>
            <Text>
                Q#{questionTypes[route.params.type][questionCount].id}: {questionTypes[route.params.type][questionCount].question}
            </Text>
            {questionTypes[route.params.type][questionCount].options.map(option => (
                <View key={option} >
                    <Text> {option}</Text>
                    <TouchableOpacity style={styles.outer} onPress={() => setCurrentAnswer(option)}>
                        {currentAnswer === option && <View style={styles.inner} />}
                    </TouchableOpacity>
                </View>
            ))}
            {questionCount === questionTypes[route.params.type].length - 1 ?
                <Button
                    title="Submits"
                    onPress={() => submitHanlder(questionTypes[route.params.type][questionCount].right)}
                />
                :
                <Button
                    title="Next"
                    onPress={() => nextHandler(questionTypes[route.params.type][questionCount].right)}
                />
            }

        </View>
    )
}
const styles = StyleSheet.create({
    outer: {
        width: 25,
        height: 25,
        borderWidth: 1,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inner: {
        width: 15,
        height: 15,
        backgroundColor: 'gray',
        borderRadius: 10
    }
})
export default Questions