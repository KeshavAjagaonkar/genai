import './chat.css'
import { useContext, useEffect, useState,useRef } from 'react'
import { MyContext } from '../../context/MyContext.jsx';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import "highlight.js/styles/github-dark.css";


function Chat() {
    const { newChat, prevChats,reply } = useContext(MyContext);
    const [latetestReply, setLatestReply] = useState(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        //separetes the latest reply and and typing effect to it
        if (reply === null) {
            setLatestReply(null); 
            return;
        }
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        const content = reply.split(" ");
        let idx = 0;
        intervalRef.current = setInterval(() => {
            idx += 4;
            if (idx >= content.length) {
                setLatestReply(reply);
                clearInterval(intervalRef.current);
            } else {
                setLatestReply(content.slice(0, idx).join(" "));
            }
         },
            30)
        return () => clearInterval(intervalRef.current);
    },[reply]);

    return (
        <>
            {newChat && <h1>Start a new Chat!</h1>}
            <div className='chats'>
                {
                    prevChats?.slice(0,-1).map((chat, idx) =>
                        <div className={chat.role === "user" ? "userDiv" : "geminiDiv"} key={idx}>
                            {
                                chat.role === "user" ? <p className='userMessage'>{chat.content}</p> :
                                    <ReactMarkdown rehypePlugins={rehypeHighlight}>{chat.content}</ReactMarkdown>
                            }
                        </div>)
                }
                {
                    prevChats.length > 0 && (
                    <>
                        {
                            latetestReply===null ? (<div className='geminiDiv' >
                            <ReactMarkdown rehypePlugins={rehypeHighlight}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                    </div>):(<div className='geminiDiv' >
                            <ReactMarkdown rehypePlugins={rehypeHighlight}>{latetestReply}</ReactMarkdown>
                    </div>)
                        }
                    </>
                    )
                }
     
            </div>
        </>
    )
}

export default Chat;