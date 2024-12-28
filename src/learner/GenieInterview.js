import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const questions = [
    'Explain the concept of a blockchain and its role in Web3.',
    ' Explain the concept of props in React and how they are used',
    'What is the significance of the useEffect() hook in React?'
];
const Demo = () => {
    // ---------------- AI INTERVIEW CODE [OPEN] -------------------------
    const [questionIndex, setQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [answers, setAnswers] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [timer, setTimer] = useState(10);
    const [feedback, setFeedback] = useState('');
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [loading, setLoading] = useState(false); // State to track loading status


    const extractPercentage = (feedback) => {
        const match = feedback.match(/The percentage is (\d+)%/);
        return match ? parseInt(match[1], 10) : 0;
        
    };
    console.log(extractPercentage(feedback));

    console.log(isListening);
    useEffect(() => {
        // This effect runs once after the initial render
        setQuestionIndex(0);
    }, []); // Empty dependency array ensures this effect runs only once

    useEffect(() => {
        if (questionIndex < questions.length) {
            setTimer(10)
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
            // Store the answer immediately after capturing it
            if (questionIndex < questions.length) {
                setAnswers(prevAnswers => [...prevAnswers, { question: questions[questionIndex - 1], answer: userAnswer }]);
            }
        }
    }, [timer,questionIndex, resetTranscript, transcript, userAnswer]);

    useEffect(() => {
        // Automatically call handleFinish when all questions have been answered
        if (questionIndex === questions.length) {
            handleFinish();
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        }
    },);

    const handleFinish = async () => {
        setLoading(true); // Start loading
        // Ensure all answers are stored before making the API call
        const allAnswers = [...answers, { question: questions[questionIndex - 1], answer: userAnswer }];
        setAnswers(allAnswers);

        // Construct the prompt for the Gemini API
        const prompt = allAnswers.map(({ question, answer }) => `Question: ${question}, Answer: ${answer}`).join(', ');
        console.log(`Prompt for Gemini API: ${prompt}`);

        try {
            const response = await axios({
                url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyB9Vwe1lTs8a9Rcm5_ubwinsLd28H6UEL0",
                method: "post",
                data: {
                    contents: [{
                        parts: [{
                            text: `Please rate the following interview:...see i want only percentage of interview like how it as out of 100 and make sure you give atleast 10 to all response and give only name of topics that user has to learn..just the topics name,See So you have to  give me response according a strict format of like : The percentage is {place percentage here}% and the topics are as follows as{number ways} like 1,2,3,etc and the interviw question and answeras are as follow.  ${prompt}`
                        }]
                    }]
                },
            });
            console.log(response.data);

            // Store the feedback from the API response
            setFeedback(response.data.candidates[0].content.parts[0].text);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Stop loading
        }
    };


    // ---------------- AI INTERVIEW CODE [CLOSE] -------------------------
    const videoRef = useRef(null);
    const isMountedRef = useRef(false);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
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

        getCameraStream();
    }, []);

    return (
        <>
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '100vh', backgroundColor: 'blue', background: `
      repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(242, 242, 242, 0.3) 50px, rgba(242, 242, 242, 0.3) 51px),
      repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(242, 242, 242, 0.3) 50px, rgba(242, 242, 242, 0.3) 51px),
      #5813EA`,
            }}>
                <div style={{ position: 'relative', width: '900px', height: '800px', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    <div className="video-container" style={{ position: 'relative', width: '1000px', height: '100%', overflow: 'hidden', }}>
                    {questionIndex === questions.length ? (
                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ width: '200px', height: '200px' }}>
                                <CircularProgressbar value={50} text={`${extractPercentage(feedback)}%`} />
                                </div>
                                <div style={{ textAlign: 'center', color: 'white', fontSize: '20px' }}>
                                    <p>Interview Rating:</p>
                                    <pre>{feedback}</pre>
                                </div>
                                <div className="text-overlay" style={{ position: 'absolute', top: '88%', left: '50%', transform: 'translate(-50%, -50%)', color: 'yellow', fontSize: '20px', fontWeight: 800, textShadow: '1px 1px 1px rgba(14,1,0,1)', border: '2px solid white', padding: '5px', backgroundColor: '#000', borderRadius: '10px', paddingInline: '20px' }}>
                            <span style={{ color: 'yellow' }}>no worry! </span>
                            <span style={{ color: 'red' }}>Be Relax!! 😌</span>
                        </div>
                            </div>
                        ) : (
                            <>
                            <video
                                ref={videoRef}
                                width={900}
                                height={900}
                                muted
                                autoPlay
                                style={{
                                    borderRadius: '5%',
                                    objectFit: 'cover',
                                    position: 'absolute',
                                    top: 100,
                                    left: 0,
                                    transform: 'translate(0%, 0%)',
                                    borderColor: 'yellow', borderWidth: '5px'
                                }}
                            />
                       
                        <div className="text-overlay" style={{ position: 'absolute', top: '88%', left: '50%', transform: 'translate(-50%, -50%)', color: 'yellow', fontSize: '20px', fontWeight: 800, textShadow: '1px 1px 1px rgba(14,1,0,1)', border: '2px solid white', padding: '5px', backgroundColor: '#000', borderRadius: '10px', paddingInline: '20px' }}>
                            <span style={{ color: 'yellow' }}>Don't take stress! </span>
                            <span style={{ color: 'red' }}>Be Relax!! 😌</span>
                        </div>
                        </>
                         )}
                        <div className="top-div" style={{ backgroundColor: '#0a1626', width: '100%', textAlign: 'center', color: 'white', padding: '10px 0', position: 'absolute', top: 50, left: 0, transform: 'translate(-0%, -0%)', display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: 'yellow', fontSize: '20px', fontWeight: 500, }}>AI INTERVIEW </span>
                            <div style={{ width: '25%', backgroundColor: 'grey', height: '1px', alignSelf: 'center', margin: '10px' }}></div>
                            <div>
                                {/* // ------------ Question Span ------------------ */}
                                {/* <span style={{ color: 'white', fontSize: '30px', fontWeight: 500, textShadow: '1px 1px 1px rgba(14,1,0,1)', }}>Q) What is use of usestate in React? </span> */}
                            </div>
                            {/* AI INTWERVIEW */}
                            {questionIndex < questions.length ? (
                                <>

                                    <span style={{ color: 'white', fontSize: '30px', fontWeight: 500, textShadow: '1px 1px 1px rgba(14,1,0,1)', }}>{questions[questionIndex]}</span>
                                    <p>{transcript}</p>
                                    <p>Time left: {timer}</p>
                                </>
                            ) : (
                                <p>Interview completed!</p>
                            )}
                            {/* <button onClick={() => setQuestionIndex(0)}>Start Interview</button> */}
                            {questionIndex === questions.length && (
                                <button onClick={handleFinish}>Finish Interview</button>
                            )}
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                feedback && <p>Feedback: {feedback}</p>
                            )}
                            {/* AI INTERVIEW CLOSED */}
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
};

export default Demo
