// Home.js
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { ArrowLeftIcon, SparklesIcon } from '@heroicons/react/outline';
import Summary from './Summary';
import Flashcards from './Flashcards';
import ChatBot from './ChatBot';
import MultiHighlight from './MultiHighlight';

import Settings from './Settings';
import MemeList from './MemeList';
import Swap from './Swap';
import Chat from './Chat';
import AiAgent from './AiAgent';
import AiList from './AiList';


function Home() {
  const [activeTab, setActiveTab] = useState('agent');
  const [activeContent, setActiveContent] = useState(null); // State to control which component to render

  // if (message.action === 'SEND_TWITTER_USERNAME') {
  //   // Setting userName and address from the message data
  //   setActiveTab('swap');
  //   console.log("Twitter username received:", message.user);
  //   console.log("Account address received:", message.accountAddress);
  // }



  // Function to render tab content based on active tab
  const renderTabContent = () => {
    if (activeContent) {
      return renderActiveContent(); // Display the selected content if activeContent is set
    }

    switch (activeTab) {
      case 'memelist':
        return <AiList />;
      case 'home':
        return (
          <div className='flex flex-col justify-center items-center h-full'>
            <div className='flex flex-col items-center justify-center flex-grow'>
              <div onClick={() => setActiveContent('summary')} className="text-center w-full">
                <Button text="Generate Summary" />
              </div>
              <div onClick={() => setActiveContent('flashcards')} className="text-center w-full">
                <Button text="Generate Flashcards" />
              </div>
              <div onClick={() => setActiveContent('chatbot')} className="text-center w-full">
                <Button text="Ask me a question" />
              </div>
              <div onClick={() => setActiveContent('multiHighlight')} className="text-center w-full">
                <Button text="Multi Highlight" />
              </div>
            </div>
          </div>
        );
      case 'swap':
        return <Swap />;
      case 'chat':
        return <Chat />;  
      default:
        return <AiAgent />;
    }
  };

  // Function to render content based on the active content button clicked
  const renderActiveContent = () => {
    switch (activeContent) {
      case 'summary':
        return <Summary />;
      case 'flashcards':
        return <Flashcards />;
      case 'chatbot':
        return <ChatBot />;
      case 'multiHighlight':
        return <MultiHighlight />;
      default:
        return null;
    }
  };

  // Handle tab clicks and reset content if switching tabs
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setActiveContent(null); // Reset active content when switching tabs
  };

  return (

    <div className="bg-black w-full h-screen flex flex-col"> {/* Added flex direction to column */}
      <div className="flex-grow w-full h-full bg-bg-color pt-2 flex flex-col rounded-lg"> {/* Changed to flex-grow */}
        {/* Header with Back Button */}
        <div className="flex flex-col justify-center items-center ml-2">
          <div className='flex flex-row gap-2 items-center'>
            {activeContent && (
              <ArrowLeftIcon
                className="h-5 w-5 text-white cursor-pointer" // Back arrow icon
                onClick={() => setActiveContent(null)} // Reset to show home buttons
              />
            )}
            <h2 className="text-white text-xl font-bold">The X Agent</h2>
          </div>

        </div>

        {/* Render Active Content or Buttons */}
        <div className="flex-grow flex justify-center items-center">
          {renderTabContent()}
        </div>
      </div>

      {/* Fixed Tab Bar moved outside the main content */}
      <div className="flex justify-around w-full bg-tab-color border-t-2 border-[#202327] py-3"> {/* Added padding y-axis */}
        <div
          onClick={() => handleTabClick('home')}
          className={`cursor-pointer flex flex-col justify-center items-center ${activeTab === 'home' ? 'text-white border-t-2 border-blue-500 -mt-[14px]' : 'text-tab-text'}`} // Adjusted margin for active tab
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
          </svg>
          <p>Summary</p>
        </div>
        <div
          onClick={() => handleTabClick('agent')}
          className={`cursor-pointer flex flex-col justify-center items-center ${activeTab === 'agent' ? 'text-white border-t-2 border-blue-500 -mt-[14px]' : 'text-tab-text'}`} // Adjusted margin for active tab
        >
          <SparklesIcon className="h-6 w-6" />
          <p>AiAgent</p>
        </div>
        <div
          onClick={() => handleTabClick('memelist')}
          className={`cursor-pointer flex flex-col justify-center items-center ${activeTab === 'memelist' ? 'text-white border-t-2 border-blue-500 -mt-[14px]' : 'text-tab-text'}`} // Adjusted margin for active tab
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <p>AiList</p>
        </div>
        {/* <div
          onClick={() => handleTabClick('swap')}
          className={`cursor-pointer flex flex-col justify-center items-center ${activeTab === 'swap' ? 'text-white border-t-2 border-blue-500 -mt-[14px]' : 'text-tab-text'}`} // Adjusted margin for active tab
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          <p>Swap</p>
        </div> */}
        <div
          onClick={() => handleTabClick('chat')}
          className={`cursor-pointer flex flex-col justify-center items-center ${activeTab === 'chat' ? 'text-white border-t-2 border-blue-500 -mt-[14px]' : 'text-tab-text'}`} // Adjusted margin for active tab
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>

          <p>Chat</p>
        </div>
      </div>
    </div>
  );
}

export default Home;