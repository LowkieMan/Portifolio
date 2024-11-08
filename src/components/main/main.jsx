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

            <div className="main-bottom">
                <div className="search-box">
                    <input type="text" placeholder="Enter a prompt here" />
                    <div> 
                        <img src={assets.photo} alt="" />
                        <img src={assets.mic} alt="" />
                        <img src={assets.send} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Main;