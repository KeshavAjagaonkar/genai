import { useContext, useEffect } from 'react';
import './Sidebar.css'
import { MyContext } from '../../context/MyContext.jsx';
import { v1 as uuidv1 } from 'uuid';

function Sidebar() {
    const { allThreads, setAllThreads,currThreadId,setNewchat,setPrompt,setReply,setCurrThreadId,setPrevChats} = useContext(MyContext);
    const getAllThreads = async () => {

        try {
            const response = await fetch("http://localhost:5000/api/thread");
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
            const response = await fetch(`http://localhost:5000/api/thread/${newThreadId}`);
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
            const response = await fetch(`http://localhost:5000/api/thread/${threadId}`, { method: "DELETE" });
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
            <section className="sidebar">
                {/* new chat button */}
                <button onClick={creatNewChat}>
                    <img className="logo" src="src/assets/blacklogo.png" alt="logo" />
                    <span className='icon'><i className="fa-solid fa-pen-to-square"></i></span>
                </button>

                {/* History */}
                <ul className="history">
                    {
                        allThreads?.map((thread, idx) => (
                            <li key={idx}
                                onClick={(e) => changeThread(thread.threadId)}>{thread.title}<i className="fa-solid fa-trash trashicon" onClick={(e) => {
                                    e.stopPropagation(); 
                                    deleteThread(thread.threadId);
                                }}></i>
                            </li>
                        ))
                    }
                </ul>

                {/* sign */}
                <div className="sign">
                    <p>MindSync</p>
                </div>
            </section>
        </>
    )
}
export default Sidebar;