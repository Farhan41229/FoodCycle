import React, { useState } from 'react';
import Navbar from '../pages/Shared/Navbar/Navbar';
import Footer from '../pages/Shared/Footer/Footer';

const AILayout = () => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  // Placeholder for SendMessage function implementation
  const sendMessage = async () => {
    
  }

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
                <div key={index} className="flex flex-col">
                  <p className="font-medium text-blue-600">{msg?.sender}</p>
                  <p className="text-gray-700 mt-1">{msg?.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Message Input */}
          <div className="flex  lg:flex-row items-center space-x-4 space-y-4 lg:space-y-0 flex-col">
            <input
              className="w-full p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && {}}
              placeholder="Type your message here..."
            />
            <button
              className="bg-[#2563eb] text-white px-6 py-3 rounded-lg hover:bg-[#1d4ed8] transition-all duration-300"
              onClick={() => {}}
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
