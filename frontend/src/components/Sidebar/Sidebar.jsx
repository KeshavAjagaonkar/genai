import { useContext, useEffect,useState } from 'react';
import './Sidebar.css'
import { MyContext } from '../../context/MyContext.jsx';
import { v1 as uuidv1 } from 'uuid';

function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, setNewchat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);
    const [extended,setExtended]=useState(false);
    const getAllThreads = async () => {

        try {
            const response = await fetch("http://localhost:5000/api/thread", {
                credentials: 'include'
            });
            const res = await response.json();
            const fileterData = res.map((thread) => ({ threadId: thread.threadId, title: thread.title }));
            // console.log(fileterData);
            setAllThreads(fileterData);
        }
        catch (err) {
            console.log(err);
        }
        
    }

    useEffect(() => {
        getAllThreads()
        
    }, [currThreadId]);

    const creatNewChat = () => {
        setNewchat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);

    }

    const changeThread =async(newThreadId) => {
        setCurrThreadId(newThreadId);
        setNewchat(false)
        try {
            const response = await fetch(`http://localhost:5000/api/thread/${newThreadId}`, {
                credentials: 'include'
            });
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setReply(null);
        }
        catch (err) {
            console.log(err);
        }
    }
    const deleteThread = async(threadId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/thread/${threadId}`, {
                method: "DELETE",
                credentials: 'include'
            });
            const res = await response.json();
            console.log(res);
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if (threadId === currThreadId) {
                creatNewChat();
            }
        } catch(err) {
            console.log(err);
        }
    }
    return (
        <>
            <section className={`sidebar ${extended ? "open" : "collapsed"}`}>
            
            {/* Top Section: Toggle & New Chat */}
            <div className="top-section">
                {/* Hamburger Menu to Toggle Sidebar */}
                <div className="menu-icon" onClick={() => setExtended(prev => !prev)}>
                    <i className="fa-solid fa-bars"></i>
                </div>

                <div className="new-chat" onClick={creatNewChat}>
                    <i className="fa-solid fa-plus"></i>
                    {extended && <p>New Chat</p>}
                </div>
            </div>

            {/* History List - Only show if extended */}
            {extended && (
                <div className="history-container">
                    <p className="history-title">Recent</p>
                    <ul className="history-list">
                        {allThreads?.map((thread, idx) => (
                            <li key={idx} onClick={() => changeThread(thread.threadId)} 
                                className={thread.threadId === currThreadId ? "active" : ""}>
                                <i className="fa-regular fa-message chat-icon"></i>
                                <span className="title">{thread.title}</span>
                                <i className="fa-solid fa-trash delete-icon" onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(thread.threadId);
                                }}></i>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Bottom Section */}
            <div className="bottom-section">
                <div className="bottom-item">
                    <i className="fa-regular fa-circle-question"></i>
                    {extended && <p>Help</p>}
                </div>
                <div className="bottom-item">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    {extended && <p>Activity</p>}
                </div>
                <div className="bottom-item">
                    <i className="fa-solid fa-gear"></i>
                    {extended && <p>Settings</p>}
                </div>
            </div>
        </section>
        </>
    )
}
export default Sidebar;