import React, { useState } from 'react'
import { View, Text, Button } from 'react-native'

const Questions = () => {
    const [questionCount, setQuestionCount] = useState(0);
    const questionsArray = [
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
    ]
    return (
        <View
            style={{
                paddingTop: 50,
                paddingHorizontal: 20
            }}
        >
            <Text>
                {questionsArray[questionCount].question}
            </Text>

            <Button
                title="Next"
                onPress={() => setQuestionCount(questionCount + 1)}
            />
        </View>
    )
}

export default Questions