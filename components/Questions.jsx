import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { auth, db } from '../config';
import { addDoc, collection, getFirestore } from "firebase/firestore";
const Questions = ({ navigation, route }) => {
    const user = auth.currentUser;
    const [questionCount, setQuestionCount] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const userAnswers = useRef([]);

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
            const totalQuestions = route.params.selectedQuestion.length;
            const rightAnswers = userAnswers.current.filter(a => a === true).length
            const percentage = Math.round((rightAnswers * 100) / totalQuestions);
            try {
                const docRef = await addDoc(collection(db, "scoreboard"), {
                    user: user.email,
                    score: percentage,
                    quiz: route.params.questionType,
                    status: percentage >= 70 ? "pass" : "fail"
                });
                console.log("Document written with ID: ", docRef);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            Alert.alert('Answers', `${rightAnswers}/${totalQuestions}.\n Your percentage is ${percentage}%.\n You are ${percentage >= 70 ? "pass" : "fail"}`, [
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
            <Text style={{ textAlign: 'center', fontSize: 30 }} > Quiz: {route.params.questionType} </Text>
            <Text>
                Q#{route.params.selectedQuestion[questionCount].id}: {route.params.selectedQuestion[questionCount].question}
            </Text>
            {route.params.selectedQuestion[questionCount].options.map(option => (
                <View key={option} >
                    <Text> {option}</Text>
                    <TouchableOpacity style={styles.outer} onPress={() => setCurrentAnswer(option)}>
                        {currentAnswer === option && <View style={styles.inner} />}
                    </TouchableOpacity>
                </View>
            ))}
            {questionCount === route.params.selectedQuestion.length - 1 ?
                <Button
                    title="Submits"
                    onPress={() => submitHanlder(route.params.selectedQuestion[questionCount].right)}
                />
                :
                <Button
                    title="Next"
                    onPress={() => nextHandler(route.params.selectedQuestion[questionCount].right)}
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