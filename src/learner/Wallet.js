import React, { useState } from 'react';
import { ethers } from 'ethers';

import Navbar1 from "../Navbar1";
import { FaUser, FaMoneyBillWave } from 'react-icons/fa';


const Wallet = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');

  // Contract ABI and address (you'll get this after deploying)
  const CONTRACT_ADDRESS = "0x238317AecCB3e66418527834eBDb9C36CDBaF5Cf";
  const CONTRACT_ABI = [
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
    }
  ];

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

        // Switch to Open Campus network
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: 656476, // 656476 in hex
            chainName: 'Open Campus',
            nativeCurrency: {
              name: 'EDU',
              symbol: 'EDU',
              decimals: 18
            },
            rpcUrls: ['https://rpc.open-campus-codex.gelato.digital'],
            blockExplorerUrls: ['https://opencampus-codex.blockscout.com/']
          }]
        });
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

      const transaction = await contract.transfer(
        recipientAddress,
        ethers.utils.parseUnits(amount, 18) // Assuming 18 decimals
      );

      await transaction.wait();
      alert("Transfer successful!");
      
      // Clear input fields
      setRecipientAddress('');
      setAmount('');
    } catch (error) {
      console.error("Error:", error);
      alert("Transfer failed!");
    }
  };

  // Check balance function
  const checkBalance = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask!");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const balance = await contract.balanceOf(address);
      setBalance(ethers.utils.formatUnits(balance, 18)); // Assuming 18 decimals
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch balance!");
    }
  };
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
    width: '85%',
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

  return (
    <>
    <div style={styles.container}>
    <Navbar1 />
     
      <div style={homeStyle}>
      <div style={contentStyle}>
          <div style={headingStyle}>
            <div style={{
              fontSize: 22,
              fontFamily: 'DMM',
              fontWeight: 500,
              marginLeft:30,
            }}>Transfer EDU initialSupply Tokens✨</div>
          </div>
          {!walletConnected ? (
        <button onClick={connectWallet} style={{ backgroundColor: '#f3831e',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px',
          fontFamily: 'DMM',
          fontWeight: 500,
          fontSize: 25,
          borderWidth: '2px',
          borderColor: 'black',alignSelf:'center'}} >
          Connect Wallet
        </button>
      ) : (
        <div style={{alignSelf:'center',fontFamily:'DMM'}}>
          <p>Connected Address: {address}</p>
          <button onClick={checkBalance} style={styles.button}>
            Check Balance
          </button>
          {balance && <span style={{backgroundColor:'#fff4e8',borderRadius:"15px",marginLeft:'20px',padding:'10px 10px'}}>Balance: {balance} initialSupply tokens</span>}
          <div style={styles.inputContainer}>
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Amount of EDU tokens"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
            />
            <button onClick={transferTokens} style={styles.button}>
              Do Payment
            </button>
          </div>
        </div>
      )}
          </div>
          </div>
     
    </div>
    </>
  );
};

const styles = {
  container: {
   
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',fontFamily:'DMM'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',fontFamily:'DMM'
  },
};

export default Wallet;