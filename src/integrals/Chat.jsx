import React, { useState, useEffect } from 'react';
import commandsList from '../data/commands.json';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showCommands, setShowCommands] = useState(false);

  const handleSend = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    setMessages((prev) => [...prev, { text: inputValue, sender: "user" }]);

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Hi! How can I assist you today? 😊", sender: "bot" },
      ]);
    }, 500);

    setInputValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleCommandClick = (command) => {
    setInputValue(command.text);
    setShowCommands(false);
  };

  return (
    <div className="w-full h-full bg-bg-color text-white p-4 flex flex-col">
      {/* Chat title */}
      <div className="flex justify-center font-bold text-lg mb-4">Chat</div>

      {/* Messages display */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex mb-2 ${message.sender === "user" ? "justify-end" : "justify-start"
              }`}
          >
            {message.sender === "bot" && (
              <div className="flex items-center">
                <div className="rounded-full w-10 h-10 flex items-center justify-center bg-blue-500 text-white">
                  AI
                </div>
              </div>
            )}
            <div
              className={`max-w-xs p-3 rounded-lg shadow-md text-sm ${message.sender === "user"
                ? "bg-input-color text-white"
                : "bg-tab-color text-white"
                }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Commands Box */}
      {/* Commands Box */}
      {showCommands && (
        <div className="absolute bottom-32 left-4 right-4 bg-bg-color rounded-lg border border-gray-700 shadow-md max-h-60">
          {/* Header Section (Fixed) */}
          <div className="flex justify-between items-center px-4 py-2 bg-bg-color border-b-2 border-gray-700 rounded-t-lg">
            <span className="font-bold text-white">Query Commands</span>
            <span
              className="cursor-pointer text-gray-400 hover:text-white"
              onClick={() => setShowCommands(false)} // Close on clicking the close icon
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          </div>

          {/* Scrollable Commands List */}
          <div className="p-4 overflow-y-auto max-h-[200px] scrollbar-thin">
            {commandsList.map((command) => (
              <div
                key={command.id}
                className="p-2 hover:bg-[#1A1A1A] cursor-pointer rounded"
                onClick={() => {
                  handleCommandClick(command); // Close and populate input on command click
                }}
              >
                {command.text}
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Input and send button */}
      <div className="relative flex items-center gap-2">
        {/* Command Icon */}
        <span
          onClick={() => setShowCommands((prev) => !prev)}
          className="cursor-pointer absolute left-3 text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12h15m-15 6h15m-15-12h15"
            />
          </svg>
        </span>

        <input
          type="text"
          className="flex-1 p-3 pl-10 bg-input-color text-white rounded border border-transparent focus:border-[#1D9BF0] focus:outline-none focus:bg-bg-color pr-10"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <span onClick={handleSend} className="cursor-pointer absolute right-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default Chat;