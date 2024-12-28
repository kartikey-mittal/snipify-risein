import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styled from 'styled-components';

const questions = [
    'Explain the concept of a blockchain and its role in Web3.',
    'Explain the concept of props in React and how they are used.',
    'What is the significance of the useEffect() hook in React?'
];

const Demo = () => {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [answers, setAnswers] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [timer, setTimer] = useState(10);
    const [feedback, setFeedback] = useState('');
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [loading, setLoading] = useState(false);
    const videoRef = useRef(null);
    const isMountedRef = useRef(false);

    const extractPercentage = (feedback) => {
        // Use a regular expression to match any number followed by a percentage sign
        const match = feedback.match(/(\d+)%/);
        return match ? parseInt(match[1], 10) : 0;
    };

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (questionIndex < questions.length) {
            setTimer(10);
            setIsListening(true);
            SpeechRecognition.startListening({ continuous: false });
            const countdown = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
            return () => clearInterval(countdown);
        }
    }, [questionIndex]);

    useEffect(() => {
        if (timer === 0) {
            setIsListening(false);
            SpeechRecognition.stopListening();
            setUserAnswer(transcript);
            resetTranscript();
            setQuestionIndex(questionIndex + 1);
            setTimer(10);
            if (questionIndex < questions.length) {
                setAnswers(prevAnswers => [...prevAnswers, { question: questions[questionIndex - 1], answer: userAnswer }]);
            }
        }
    }, [timer, questionIndex, resetTranscript, transcript, userAnswer]);

    const handleFinish = async () => {
        setLoading(true);
        const allAnswers = [...answers, { question: questions[questionIndex - 1], answer: userAnswer }];
        setAnswers(allAnswers);

        const prompt = allAnswers.map(({ question, answer }) => `Question: ${question}, Answer: ${answer}`).join(', ');

        try {
            const response = await axios.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyD6kL6ZIAyeQLRDZ971EZtso086Q-uTzBg",
                {
                    contents: [{
                        parts: [{
                            text: `Strictly Evaluate the following interview based on the interviewee's performance. Provide the evaluation in the following format:

The percentage score of the interview out of 100%.
List the topics that the interviewee needs to learn, with a minimum of 10 topics.
Provide the interview questions along with the answers given by the interviewee.
Ensure that the score is clear and objective, reflecting the overall performance accurately. The response should be concise but thorough in terms of topics and evaluations.Provode the response in 3 lines ${prompt}.JUST GIVE ME THE PERCENTAGE IN FORMAT [PERCENTAGE(PLAINTEXT in Capital letter): {VARYING}%]..also give the topics to learn in a paragarph`
                        }]
                    }]
                }
            );
            setFeedback(response.data.candidates[0].content.parts[0].text);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getCameraStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            if (isMountedRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (error) {
            console.error(error);
            alert('Error accessing the camera. Please check your browser permissions and try again.');
        }
    };

    useEffect(() => {
        getCameraStream();
    }, []);

    return (
        <Container>
            <VideoContainer>
                {questionIndex === questions.length ? (
                    <FeedbackContainer>
                        <ProgressBar>
                            <CircularProgressbar value={extractPercentage(feedback)} text={`${extractPercentage(feedback)}%`} />
                        </ProgressBar>
                        <FeedbackText>
                            <p>Interview Rating:</p>
                            <pre>{feedback}</pre>
                        </FeedbackText>
                        <RelaxMessage>
                            <span>No worries! </span>
                            <span>Be Relaxed!! 😌</span>
                        </RelaxMessage>
                    </FeedbackContainer>
                ) : (
                    <>
                        <Video ref={videoRef} muted autoPlay />
                        <OverlayMessage>
                            <span>Don't take stress! </span>
                            <span>Be Relax!! 😌</span>
                        </OverlayMessage>
                    </>
                )}
                <div>
                    <InterviewTitle>AI INTERVIEW</InterviewTitle>
                    <Divider />
                    <div>
                        {questionIndex < questions.length ? (
                            <>
                                <Question>{questions[questionIndex]}</Question>
                                <p>{transcript}</p>
                                <p>Time left: {timer}</p>
                            </>
                        ) : (
                            <p>Interview completed!</p>
                        )}
                    </div>
                    {questionIndex === questions.length && (
                        <FinishButton onClick={handleFinish}>Finish Interview</FinishButton>
                    )}
                    {loading && <p>Loading...</p>}
                </div>
            </VideoContainer>
        </Container>
    );
};

export default Demo;

// Styled Components
const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 100vh;
    background-color: blue;
    background: repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(242, 242, 242, 0.3) 50px, rgba(242, 242, 242, 0.3) 51px),
    repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(242, 242, 242, 0.3) 50px, rgba(242, 242, 242, 0.3) 51px), #5813EA;
`;

const VideoContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction:row;
`;

const Video = styled.video`
    border-radius: 5%;
    object-fit: cover;
    border: 5px solid yellow;
`;

const FeedbackContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ProgressBar = styled.div`
    width: 200px;
    height: 200px;
`;

const FeedbackText = styled.div`
    text-align: center;
    color: white;
    font-size: 20px;
`;

const RelaxMessage = styled.div`
    color: yellow;
    font-size: 20px;
    font-weight: 800;
    text-shadow: 1px 1px 1px rgba(14, 1, 0, 1);
    border: 2px solid white;
    padding: 5px;
    background-color: #000;
    border-radius: 10px;
    padding-inline: 20px;
`;

const OverlayMessage = styled.div`
    position: absolute;
    top: 88%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: yellow;
    font-size: 20px;
    font-weight: 800;
    text-shadow: 1px 1px 1px rgba(14, 1, 0, 1);
    border: 2px solid white;
    padding: 5px;
    background-color: #000;
    border-radius: 10px;
    padding-inline: 20px;
`;

const TopDiv = styled.div`
    background-color: #0a1626;
    // width: 100%;
    text-align: center;
    color: white;
    padding: 10px 0;
    // position: absolute;
    // top: 50px;
    left: 0;
    display: flex;
    flex-direction: column;
`;

const InterviewTitle = styled.span`
    color: yellow;
    font-size: 20px;
    font-weight: 500;
`;

const Divider = styled.div`
    width: 25%;
    background-color: grey;
    height: 1px;
    margin: 10px auto;
`;

const Question = styled.div`
    color: white;
    font-size: 30px;
    font-weight: 500;
    text-shadow: 1px 1px 1px rgba(14, 1, 0, 1);
`;

const FinishButton = styled.button`
    padding: 10px 20px;
    background-color: #f39c12;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 10px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #e67e22;
    }
`;
