import React from "react";
import { assets } from "../../assets/assets";
const Main = () => {

    return (
        <div className="main">
            <div className="nav">
                <p><span>AiCE</span></p>
                <img src={assets.aice} alt="" />
            </div>

            <div className="main-container">
                <span>Hello, Dev.</span>
            </div>
            
            <div className="search-box">
                <input type="text" placeholder="Enter a prompt here" />
                <div> 
                    <img src={assets.photo} alt="" />
                    <img src={assets.mic} alt="" />
                    <img src={assets.send} alt="" />
                </div>
            </div>
        </div>
    )

}

export default Main;