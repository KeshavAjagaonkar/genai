import React, { useContext, useState, useEffect, useRef } from 'react' // Import useRef
import Chat from '../Chat/Chat.jsx';
import './ChatWindow.css';
import { MyContext } from '../../context/MyContext.jsx';
import { ScaleLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

function ChatWindow() {
  const navigate = useNavigate();
  const { prompt, setPrompt, setReply, currThreadId, setPrevChats, setNewchat } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [showdropdown, setShowdropdown] = useState(false);
  
  //Create a reference to the bottom of the chat list
  const bottomRef = useRef(null);

  const toggleDropdown = () => setShowdropdown(!showdropdown);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/login');
    } catch (err) {
      console.log(err);
    }
  }

  const getReply = async () => {
    if (!prompt.trim()) return;
    
    const userMessage = prompt; // Store current message
    setPrompt(""); //  Clear Input IMMEDIATELY
    
    setLoading(true);
    setNewchat(false);
    
    // Add user message to chat list
    setPrevChats(prev => [...prev, { role: "user", content: userMessage }]);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({
        message: userMessage, // Use stored variable
        threadId: currThreadId
      })
    }

    try {
      const response = await fetch("http://localhost:5000/api/chat", options);
      const data = await response.json();
      // Add AI response to chat list
      setPrevChats(prev => [...prev, { role: "assistant", content: data.success }]);
      setReply(data.success); // Trigger typing effect if needed
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  // Auto-Scroll Effect: triggers on loading change or new messages
  useEffect(() => {
    if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading, setPrevChats]); // Scroll when loading starts OR chats update

  return (
    <div className='chatwindow'>
      <div className='navbar'>
        <span className="brand">MindSync <span className="version">2.0</span></span>
        <div className="userIconDiv" style={{ position: 'relative' }}>
          <span className="userIcon" onClick={toggleDropdown}>
            <i className="fa-solid fa-user"></i>
          </span>
          {showdropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-item">Edit Profile</div>
              <div className="dropdown-item logout" onClick={handleLogout}>
                Logout <i className="fa-solid fa-right-from-bracket"></i>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="main-content">
        <Chat />
        
        {/* Loader appears here, inside the scrollable area */}
        {loading && (
          <div className="loading-container">
            <ScaleLoader color="#fff" height={20} />
          </div>
        )}
        
        {/*Invisible Anchor Div to scroll to */}
        <div ref={bottomRef} /> 
      </div>

      <div className="chatInput">
        <div className="inputBox">
          <input type="text" placeholder='Ask anything'
            value={prompt} onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' ? getReply() : ""} />

          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className='info'>
          MindSync can make mistakes. Check important info.
        </p>
      </div>
    </div>
  )
}

export default ChatWindow;