import React, { useContext,useState,useEffect } from 'react'
import Chat from '../Chat/Chat.jsx';
import './ChatWindow.css';
import { MyContext } from '../../context/MyContext';
import { ScaleLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';




function ChatWindow() {
  const navigate = useNavigate();
  const { prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId , prevChats , setPrevChats,setNewchat} = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [showdropdown, setShowdropdown] = useState(false);

  const toggleDropdown = () => { 
    setShowdropdown(!showdropdown);
  }
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/login');
    }
    catch (err) {
      console.log(err);
    }
  }
  

  
  const getReply = async () => {
    setLoading(true);
    setNewchat(false);
    const options = {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      credentials: 'include',
      body: JSON.stringify({
        message: prompt,
        threadId:currThreadId
      })
    }
    try {
      const response = await fetch("http://localhost:5000/api/chat", options);
      const data = await response.json();
      setReply(data.success);
      console.log(data.success);
      
    }
    catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats(prevChats =>
      (  
        [...prevChats, {
        role: "user",
        content: prompt
      }, {
        role: "assistant",
        content:reply
        }]
      ))
    }
    setPrompt("");
  },[reply])

  return (
    <div className='chatwindow'>
      {/* Navbar */}
      <div className='navbar'>
        <span>MindSync <i className="fa-solid fa-angle-down"></i></span>
        <div className="userIconDiv"><span className="userIcon" onClick={toggleDropdown}><i className="fa-solid fa-user"></i></span>
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
      {/* chat component */}
      <Chat></Chat>
      <ScaleLoader color="#fff" loading={loading}></ScaleLoader>
      {/* Chat input */}
      <div className="chatInput">
        <div className="inputBox">
          <input type="text" placeholder='Ask anything'
            value={prompt} onChange={(e) => setPrompt(e.target.value)}
           onKeyDown={(e)=>e.key==='Enter'?getReply():""}/>
          
          <div id="submit" onClick={getReply}>
          <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className='info'>
          MindSync can make mistake.Check important info. see Cookie Preferences.
        </p>
      </div>

    </div>
  )
}

export default ChatWindow;