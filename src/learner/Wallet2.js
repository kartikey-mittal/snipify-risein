// Import necessary dependencies
import React, { useEffect, useState } from "react";
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { useNavigate, useParams } from "react-router-dom";
import Navbar1 from "../Navbar1";
import { FaUser, FaMoneyBillWave } from 'react-icons/fa';

// Main component
const Wallet2 = () => {
    const { id } = useParams();
    const navigate = useNavigate();
  
  // State variables
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 615);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({ success: false, fileName: '' });

  // Button text based on upload status
  const buttonText = uploadStatus.success
    ? `File uploaded successfully:\n${uploadStatus.fileName}`
    : 'Drag and Drop\nor Click to Upload';

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 615);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle drag enter
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [recipient, setRecipient] = useState('0x12573e41d33f823DcffFD4309D5443F028069e0c');
  const [amount, setAmount] = useState('0.005');

  const connectWallet = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      const web3Instance = new Web3(provider);
      setWeb3(web3Instance);
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const sendPayment = async () => {
    if (!web3 || !account) {
      console.log('Please connect your wallet first!');
      return;
    }

    try {
      await web3.eth.sendTransaction({
        from: account,
        to: recipient,
        value: web3.utils.toWei(amount, 'ether'),
      });
      console.log('Transaction successful!');
    } catch (error) {
      console.error('Transaction failed!', error);
    }
  };

  const handleSubmitAnswers = async () => {
    try {
      // Construct an array of screenshot URLs
      const screenshotURLs = uploadedFiles.map(file => file.url);

      // Update the document in the "Requests" collection with the screenshot URLs
      const requestDocRef = doc(db, 'Requests', id);
      await updateDoc(requestDocRef, {
        Screenshots: screenshotURLs,
      });

      console.log('Screenshots updated successfully');

      // Navigate to a success page or perform any other actions
      navigate('/skilled/home');
    } catch (error) {
      console.error('Error updating screenshots:', error);
    }
  };

  // Styles for the components
  const homeStyle = {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: 20,
    background: `
    repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255, 133, 244, 0.8) 50px, rgba(66, 133, 244, 0.8) 51px),
    repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(66, 133, 244, 0.8) 50px, rgba(66, 133, 244, 0.8) 51px),
    #5813ea`,
  };

  const contentStyle = {
    width: isMobileView ? '100%' : '85%',
    height: '85vh',
    border: '1px solid #ccc',
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    overflow: 'hidden', // Hide overflow content
    backgroundColor: '#F3F6FC',
  };

  const headingStyle = {
    width: '100%',
    backgroundColor: '#FFF4E8',
    fontSize: 25,
    fontFamily: 'DMM',
    fontWeight: 500,
    paddingTop: 5,
    paddingBottom: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const mainboxStyle = {
    width: '90%',
    height: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 'auto',
    marginTop: '20px',
    border: '1px solid blue',
    boxShadow: '0px 8px 10px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    display: "flex",
    flexDirection: "column",
  };

  // Render component
  return (
    <>
      <Navbar1 />
      <div style={homeStyle}>
        <div style={contentStyle}>
          <div style={headingStyle}>
            <div style={{
              fontSize: isMobileView ? 18 : 22,
              fontFamily: 'DMM',
              fontWeight: 500,
              marginLeft: isMobileView ? 15 : 30,
            }}>Pay rewards to tutor ✨</div>
          </div>

          <div style={mainboxStyle}>
            <div style={{ backgroundColor: "white", height: 50, flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: '20px', fontSize: 20, marginLeft: '10px', marginBottom: 3 }}>⌛</div>
              <div style={{ marginRight: '10px', fontSize: 25, fontFamily: "DMM", fontStyle: 'bold' }}>
                </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 5,
              justifyContent: 'center',
              padding: 0
            }}>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              height: '100vh',
              opacity: 0.8,
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                textAlign: 'center',
                width: '400px',
              }}>
                <button
                  onClick={connectWallet}
                  style={{
                    backgroundColor: '#f3831e',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                    fontFamily: 'DMM',
                    fontWeight: 500,
                    fontSize: 25,
                    borderWidth: '2px',
                    borderColor: 'black',
                  }}
                >
                  Connect Wallet
                </button>
                <h1 style={{
                  color: 'black',
                  fontSize: '2em',
                  marginBottom: '20px',
                  fontWeight: 800,
                  fontFamily: 'DMM'
                }}>Pay to tutor</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaUser size={20} />
                    <label htmlFor="recipient" style={{ fontFamily: 'DMM', fontSize: 15,color:'#212121' }}>Recipient Address</label>
                  </div>
                  <input
                    id="recipient"
                    type="text"
                    placeholder="Recipient Address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      fontFamily:'DMM',fontWeight:500,fontSize:'0.8rem',color:"red",opacity:0.8
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaMoneyBillWave size={20} />
                    <label htmlFor="amount" style={{ fontFamily: 'DMM', fontSize: 15 ,color:'#212121'}}>Amount (ETH)</label>
                  </div>
                  <input
                    id="amount"
                    type="text"
                    placeholder="Amount (ETH)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid green',
                      color: 'green',
                      fontSize: '1.2em',
                    
                      backgroundColor: '#f8f8f8'
                    }}
                  />
                  <button
                    onClick={sendPayment}
                    style={{
                      backgroundColor: '#5813ea',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontFamily: 'DMM',
                      fontWeight: 500,
                      fontSize: 25,
                      borderWidth: '2px',
                      borderColor: 'black',
                      marginTop: '20px'
                    }}
                  >
                    Send Payment
                  </button>
                </div>
              </div>
            </div>

            {/* <button
              onClick={handleSubmitAnswers}
              style={{
                marginTop: '20px',
                backgroundColor: 'green',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontFamily: 'DMM',
                fontWeight: 500,
                fontSize: 20,
                borderWidth: '2px',
                borderColor: 'black',
                marginBottom: '20px',
                alignSelf: 'center',
              }}
            >
              Submit Answers
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet2;
