import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Simplified ERC20 ABI
const EDU_TOKEN_ABI = [
    // Read-only functions
    {
        "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    // Transfer function
    {
        "inputs": [
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// EDU Token contract address for Open Campus Codex Sepolia
const EDU_TOKEN_ADDRESS = "0x9Df0a697184Acfc3CE20aC3B02eF182622168C74"; // Updated EDU token address

const Wallet = () => {
    const [account, setAccount] = useState('');
    const [balance, setBalance] = useState(0);
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [networkStatus, setNetworkStatus] = useState('');

    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });

                try {
                    // First try to switch to the network
                    try {
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: 656476 }], // 656476 in hex
                        });
                    } catch (switchError) {
                        // If the network doesn't exist, add it
                        if (switchError.code === 4902) {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [{
                                    chainId: 656476,
                                    chainName: 'Open Campus Codex Sepolia',
                                    nativeCurrency: {
                                        name: 'EDU',
                                        symbol: 'EDU',
                                        decimals: 18
                                    },
                                    rpcUrls: ['https://open-campus-codex-sepolia.drpc.org'],
                                    blockExplorerUrls: ['https://sepolia.explorer.codex.storage']
                                }]
                            });
                        }
                    }

                    setNetworkStatus('Connected to Open Campus Codex Sepolia');
                    setAccount(accounts[0]);
                    await getBalance(accounts[0]);
                } catch (error) {
                    console.error('Error setting up network:', error);
                    setNetworkStatus('Error connecting to network');
                }
            } else {
                alert('Please install MetaMask!');
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            setNetworkStatus('Error connecting wallet');
        }
    };

    const getBalance = async (address) => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.ready;

            const network = await provider.getNetwork();
            console.log('Current network:', network);

            const eduContract = new ethers.Contract(EDU_TOKEN_ADDRESS, EDU_TOKEN_ABI, provider);
            const balance = await eduContract.balanceOf(address);
            console.log('Raw balance:', balance.toString());
            
            // Format balance assuming 18 decimals (standard for ERC20)
            setBalance(ethers.utils.formatEther(balance));
        } catch (error) {
            console.error('Detailed balance error:', error);
            setBalance('Error');
        }
    };

    const sendTokens = async () => {
        if (!amount || !recipientAddress) return;
        
        try {
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const eduContract = new ethers.Contract(EDU_TOKEN_ADDRESS, EDU_TOKEN_ABI, signer);
            
            const parsedAmount = ethers.utils.parseEther(amount);
            console.log('Sending amount:', parsedAmount.toString());
            
            const checksumRecipient = ethers.utils.getAddress(recipientAddress);
            
            const tx = await eduContract.transfer(checksumRecipient, parsedAmount, {
                gasLimit: 100000 // Set a fixed gas limit
            });
            
            console.log('Transaction hash:', tx.hash);
            await tx.wait();
            
            await getBalance(account);
            setAmount('');
            setRecipientAddress('');
            alert('Transfer successful!');
        } catch (error) {
            console.error('Detailed transfer error:', error);
            alert('Transfer failed: ' + (error.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                setAccount(accounts[0]);
                if (accounts[0]) getBalance(accounts[0]);
            });

            window.ethereum.on('chainChanged', (_chainId) => {
                window.location.reload();
            });
        }
        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners('accountsChanged');
                window.ethereum.removeAllListeners('chainChanged');
            }
        };
    }, []);

    return (
        <div className="wallet-container">
            <h1>EDU Token Transfer</h1>
            
            <div className="network-status">
                {networkStatus && <p>{networkStatus}</p>}
            </div>
            
            {!account ? (
                <button className="connect-btn" onClick={connectWallet}>
                    Connect Wallet
                </button>
            ) : (
                <div className="wallet-content">
                    <div className="account-info">
                        <p>Connected Account: </p>
                        <p className="address">{account}</p>
                        <p className="balance">Balance: {balance} EDU</p>
                    </div>
                    
                    <div className="transfer-form">
                        <input
                            type="text"
                            placeholder="Recipient Address (0x...)"
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Amount in EDU"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            max={balance}
                            step="0.000000000000000001"
                        />
                        <button 
                            onClick={sendTokens}
                            disabled={loading || !amount || !recipientAddress}
                            className="transfer-btn"
                        >
                            {loading ? 'Sending...' : 'Send EDU'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallet;