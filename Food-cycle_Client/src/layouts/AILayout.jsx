import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../pages/Shared/Navbar/Navbar';
import Footer from '../pages/Shared/Footer/Footer';
import { companyInfo } from '../../Companyinfo';

const AILayout = () => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false); // Track the loading state
  const [firstResponse, setFirstResponse] = useState(null); // To store the invisible first response
  const chatEndRef = useRef(null); // Reference for scrolling

  // Company info to send to the AI to customize its responses

  // Send message function
  // Inside your sendMessage or similar function

  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent empty messages

    const userMessage = { sender: 'You', text: message };
    setChatLog((prev) => [...prev, userMessage]);
    setMessage(''); // Clear input after sending

    setLoading(true); // Show loading spinner

    // Combine company info and the user message into one prompt
    const companyContextWithUserMessage = `
    Please answer the following questions ONLY based on the context of FoodCycle. Do not provide any outside information. Here is the company context:
    ${companyInfo}
    User's message: "${message}"
  `;

    // Send combined message to the AI
    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: companyContextWithUserMessage }),
    });

    const msg = await res.json();

    // Append the AI response to chat log
    setChatLog((prev) => [...prev, { sender: 'Gemini', text: msg }]);
    setLoading(false); // Hide the loading spinner once response is received
  };

  // Auto-scroll to bottom when chatLog updates
  useEffect(() => {
    // Check if chatEndRef is valid and scroll smoothly
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end', // Ensures the scroll happens to the bottom of the last message
    });

    // On first page load, send company info to the AI (this response will be invisible)
    if (chatLog.length === 0 && firstResponse === null) {
      fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: companyInfo }),
      })
        .then((res) => res.json())
        .then((msg) => setFirstResponse(msg)); // Store the first response without displaying
    }
  }, [chatLog, firstResponse]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow mt-[170px] mb-20 px-5 lg:px-20">
        <div className="w-full mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-semibold text-center text-[#2563eb] mb-6">
            AI Chatbot 🤖
          </h2>

          {/* Chat Log */}
          {chatLog.length > 0 && (
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto p-4 bg-gray-100 rounded-lg">
              {chatLog.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    msg?.sender === 'You' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-2 rounded-lg max-w-[70%] mb-2 ${
                      msg?.sender === 'You'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-300 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="font-medium">{msg?.sender}</p>
                    <p className="text-gray-700 mt-1">{msg?.text}</p>
                  </div>
                </div>
              ))}
              {/* Scroll target */}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* Loading spinner when AI is writing */}
          {loading && (
            <div className="flex justify-center items-center space-x-2">
              <span className="loading loading-dots loading-xl"></span>
              <p className="text-xl text-gray-600">AI is writing...</p>
            </div>
          )}

          {/* Message Input */}
          <div className="flex lg:flex-row items-center space-x-4  lg:space-y-0 flex-col">
            <input
              className="w-full p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#2563eb] mb-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message here..."
            />
            <button
              className="bg-[#2563eb] text-white px-6 py-3 rounded-lg hover:bg-[#1d4ed8] transition-all duration-300 mt-5 lg:-mt-2"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AILayout;
