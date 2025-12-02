import './Chat.css'
import { useContext, useEffect, useState, useRef } from 'react'
import { MyContext } from '../../context/MyContext.jsx';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(""); 
    const intervalRef = useRef(null);
    const chatEndRef = useRef(null); 

    useEffect(() => {
        if (!reply) {
            setLatestReply("");
            return;
        }
        
        if (intervalRef.current) clearInterval(intervalRef.current);

        let index = 0;
        
        intervalRef.current = setInterval(() => {
            // Speed: 20 chars every 30ms (Fast & Smooth)
            index += 20; 

            if (index >= reply.length) {
                setLatestReply(reply); 
                clearInterval(intervalRef.current);
            } else {
                setLatestReply(reply.slice(0, index)); 
            }
        }, 30);
        
        return () => clearInterval(intervalRef.current);
    }, [reply]);

    // Instant Scroll: Forces the view to stay at the bottom while typing
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
        }
    }, [latestReply]); 

    return (
        <div className='chats'>
            {newChat && <h1 className="welcome-text">Start a new Chat!</h1>}
            
            {prevChats?.map((chat, idx) => {
                // Check if this is the message currently being typed
                const isLastMessage = idx === prevChats.length - 1;
                const isBot = chat.role === "assistant";
                const isTyping = isLastMessage && isBot && reply;

                return (
                    <div className={chat.role === "user" ? "userDiv" : "geminiDiv"} key={idx}>
                        {chat.role === "user" ? (
                            <p className='userMessage'>{chat.content}</p>
                        ) : (
                            // Render Markdown directly.
                            // If typing, show 'latestReply'. If finished/history, show 'chat.content'
                            <ReactMarkdown rehypePlugins={rehypeHighlight}>
                                {isTyping ? latestReply : chat.content}
                            </ReactMarkdown>
                        )}
                    </div>
                )
            })}
            
            {/* Invisible anchor to scroll to */}
            <div ref={chatEndRef}></div>
        </div>
    )
}

export default Chat;