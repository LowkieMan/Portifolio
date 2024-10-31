import React from "react";
import "./main.css";
import { assets } from "../../assets/assets";
const Main = () => {

    return (
        <div className="main">
            <div className="nav">
                <p><span>AiCE</span></p>
                <img src={assets.aice} alt="" />
            </div>
            <div className="main-container">
                <p className="greet">
                    <p><span>Hello, Dev.</span></p>
                    <p>how can I help you today?</p>
                </p>
            </div>
            <div className="cards">
                <div className="card">
                    <p>Suggest beautiful places to see on an upcoming road trip</p>
                    <img src={assets.explore} alt="" />
                </div>
                <div className="card">
                    <p>Briefly summarize this concept: urban planning</p>
                    <img src={assets.lightbulb} alt="" />
                </div>
                <div className="card">
                    <p>Brainstorm team bonding activities for our work retreat</p>
                    <img src={assets.chat} alt="" />
                </div> 
                <div className="card">
                    <p>Improve the readability of the following code</p>
                    <img src={assets.code} alt="" />
                </div>
            </div>
            <div className="main-bottom">
                <div className="search-box">
                    <input type="text" placeholder="Enter a prompt here" />
                    <div> 
                        <img src={assets.photo} alt="" />
                        <img src={assets.mic} alt="" />
                        <img src={assets.send} alt="" />
                    </div>
                </div>
                <p className="bottom-info">
                        AiCE may display inaccurate info, including about people, so double-check its responses. Your privacy and AiCE Apps 
                    </p>
            </div>
        </div>
    )

}

export default Main;