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
const Wallet = () => {
    const { id } = useParams();
    const navigate = useNavigate();
  
  // State variables
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 615);


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

//   -------------new version ------------------------------
  const [walletConnected, setWalletConnected] = useState(false);
    const [address, setAddress] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState('0');
  
    // Contract details
    const CONTRACT_ADDRESS = "0xd7Be77D26dC706144422263b04b8AccCe7946EF4";
    const CONTRACT_ABI = [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "initialSupply",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "allowance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "needed",
            "type": "uint256"
          }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "balance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "needed",
            "type": "uint256"
          }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "approver",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setWalletConnected(true);
          await getBalance(accounts[0]);
        }
      }
    };
  
    useEffect(() => {
      checkWalletConnection();
    }, []);
  
    const getBalance = async (userAddress) => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const balanceWei = await contract.balanceOf(userAddress);
        const balanceEth = ethers.utils.formatEther(balanceWei);
        setBalance(balanceEth);
      } catch (error) {
        console.error("Error getting balance:", error);
      }
    };
  
    // Connect wallet function
    const connectWallet = async () => {
      try {
        if (window.ethereum) {
          // Request account access
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          
          setAddress(accounts[0]);
          setWalletConnected(true);
  
          // Get balance after connecting
          await getBalance(accounts[0]);
  
          // Switch to Open Campus network
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: 656476}], // 656476 in hex
            });
          } catch (switchError) {
            // If the network doesn't exist, add it
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: 656476,
                  chainName: 'Open Campus Codex Sepolia by dRPC',
                  nativeCurrency: {
                    name: 'EDU',
                    symbol: 'EDU',
                    decimals: 18
                  },
                  rpcUrls: ['https://open-campus-codex-sepolia.drpc.org'],
                  blockExplorerUrls: ['https://opencampus-codex.blockscout.com/']
                }]
              });
            }
          }
        } else {
          alert("Please install MetaMask!");
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    // Transfer tokens function
    const transferTokens = async () => {
      try {
        if (!window.ethereum) return alert("Please install MetaMask!");
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );
  
        // Convert amount to Wei (multiply by 10^18)
        const amountInWei = ethers.utils.parseEther(amount);
  
        const transaction = await contract.transfer(
          recipientAddress,
          amountInWei
        );
  
        // Show pending message
        alert("Transaction pending... Please wait.");
  
        // Wait for transaction to be mined
        await transaction.wait();
        
        alert("Transfer successful!");
        
        // Update balance after transfer
        await getBalance(address);
        
        // Clear input fields
        setRecipientAddress('');
        setAmount('');
      } catch (error) {
        console.error("Error:", error);
        alert("Transfer failed: " + error.message);
      }
    };

//   -------------new version ------------------------------

 

  

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
                  onClick={connectWallet} 
                >
                  Connect Wallet
                </button>

                {!walletConnected ? (
        <button onClick={connectWallet} style={styles.button}>
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>Connected Address: {address}</p>
          <p>EDU Token Balance: {balance}</p>
          
        </div>
      )}
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

export default Wallet;