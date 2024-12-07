import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

const TokenDetail = () => {
  const [responseMessage, setResponseMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleConnectWallet();

    const messageListener = (message) => {
      console.log("Received message from background.js:", message);

      if (message.action === 'SEND_TWITTER_USERNAME') {
        // Setting userName and address from the message data
        setUserName(message.user || '');
        setAddress(message.accountAddress || '');
        console.log("Twitter username received:", message.user);
        console.log("Account address received:", message.accountAddress);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const handleConnectWallet = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'CONNECT_WALLET' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error:", chrome.runtime.lastError.message);
        } else {
          console.log("Response from content.js:", response);
        }
      });
    });
  };

  // Function to handle API call
  const handleApiCall = async () => {
    try {
      setLoading(true);
      const response = await axios.post('https://magicmeme-backend.potp.xyz/memehub/projectContract', {
        chainId: "56",
        twitter: userName,
        amount: amount, // should be in the required format for API
        userAddress: address,
      });
      setResponseMessage('Swap successful!');
       console.log('Swap successful!');
    } catch (error) {
      console.error('Error during swap:', error);
      setResponseMessage('Swap failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="w-full h-full bg-bg-color text-white p-3 flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
        <div className="text-lg font-bold">Insights</div>
        <div className="text-sm text-gray-400">SOL</div>
      </div>
  
      {/* Main Content */}
      <div className="p-4">
        {/* Title */}
        <h1 className="text-xl font-semibold mb-2">Solana</h1>
        <p className="text-lg font-bold text-green-500 mb-1">$242.64</p>
        <p className="text-sm text-green-400">+1.15% Today</p>
  
        {/* Timeframe Navigation */}
        <div className="flex gap-2 mt-4 mb-4">
          {['15m', '1h', '6h', '1d', '1w'].map((time) => (
            <button
              key={time}
              className="px-3 py-1 text-xs font-medium text-gray-400 bg-input-color rounded"
            >
              {time}
            </button>
          ))}
        </div>
  
        {/* Blank Card for Graph */}
        <div className="w-full h-56 bg-input-color rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Graph Placeholder</p>
        </div>
  
        {/* Position Section */}
        <div className="mt-6">
  <h2 className="text-lg font-bold mb-2">Position</h2>
  <div className="flex flex-row gap-4">
    {/* Quantity Card */}
    <div className="bg-bg-color p-4 rounded-lg border border-gray-700 flex-1">
      <p className="text-sm text-gray-400">Quantity</p>
      <p className="text-lg font-semibold">0</p>
    </div>

    {/* Value Card */}
    <div className="bg-bg-color p-4 rounded-lg border border-gray-700 flex-1">
      <p className="text-sm text-gray-400">Value</p>
      <p className="text-lg font-semibold">0</p>
    </div>
  </div>
</div>

{/* Stats Section */}
<div className="mt-6">
  <h2 className="text-lg font-bold mb-2">Stats</h2>
  <div className="flex flex-row gap-4">
    {/* Price Card */}
    <div className="bg-bg-color p-4 rounded-lg border border-gray-700 flex-1">
      <p className="text-sm text-gray-400">Price</p>
      <p className="text-lg font-semibold">$242.64</p>
    </div>

    {/* Market Cap Card */}
    <div className="bg-bg-color p-4 rounded-lg border border-gray-700 flex-1">
      <p className="text-sm text-gray-400">Market Cap</p>
      <p className="text-lg font-semibold">$143.08B</p>
    </div>

    {/* Supply Card */}
    <div className="bg-bg-color p-4 rounded-lg border border-gray-700 flex-1">
      <p className="text-sm text-gray-400">Supply</p>
      <p className="text-lg font-semibold">589.7M</p>
    </div>
  </div>
</div>

      </div>
    </div>
  </>
  
  
  );
};

export default TokenDetail;
