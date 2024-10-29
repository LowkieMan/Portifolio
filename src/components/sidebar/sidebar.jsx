import React, { useState } from "react";
import "./sidebar.css";
import { assets } from "../../assets/assets"

const Sidebar = () => {

    const [extended, setExtended] = useState(false);

    return (
        <div className="sidebar">
            <div className="top">
                <img onClick={() => setExtended(prev => !prev)} className="menu" src={assets.menu} alt="menu" title="menu" />
                <div className="new-chat">
                    <img src={assets.add} alt="new chat" />
                    {extended? <p>new chat</p>: null}
                </div>

                {extended 
                    ? <div className="recent">
                        <p className="recent-title">recent</p>
                        <div className="recent-entry">
                            <img src={assets.chat} alt="chats" title="old chats" />
                            <p>What is react ...</p>
                        </div>
                    
                     </div>

                     :null
                }
                
            </div>

            <div className="bottom">
                <div className="bottom-item recent-entry">
                    <img src={assets.help} alt="" />
                    {extended ? <p>help</p>: null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history} alt="" />
                    {extended ? <p>activity</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.settings} alt="" />
                    {extended ? <p>settings</p>: null}
                </div>
            </div>
        </div>
    )
}

export default Sidebar;