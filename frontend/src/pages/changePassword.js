import React, { useState, useEffect } from "react";
import Logo from "../components/logo.js";
import "../invite.css";
import axios from "../axios.js";


//Stating variable to manage status and the password input
function ChangePassword() {
    

    const [status, setStatus] = useState({
        status: "",
        msg: ""
    });

    const [password, setPassword] = useState("");

    //Function that updates the user password
    const updateUser = async () => {
        try {

            if (password) {
                
                //Endpoint for updating information of the user
                const list = "/users/update";

                //Data getting prepared to be sent in request
                let obj = {
                    id: localStorage.getItem("id")
                };
                
                obj["password"] = password;
                const response = await axios.post(list, { ...obj });
                

                //If request is successful
                if (parseInt(response?.status) === 200) {
                    localStorage.setItem("_pass", password);
                    setStatus({ status: 200, msg: `Password has been updated successfully!` });
                    setTimeout(() => {
                        //After 2 second, status message gets cleared and redirects to login
                        setStatus({ status: "", msg: "" });
                        localStorage.clear();
                        window.location.href = "/login";
                    }, 2000);
                }
                //if the request was not succesful then status gets set
                else {
                    setStatus({ status: 400, msg: "An Unexpected Error has occured!" });
                }
            }

            //If else for when password is empty
            else {
                setStatus({ status: 400, msg: "Please input Password!" });

            }
        } catch (error) {
            //If error occurs during updateUser function
            setStatus({ status: 400, msg: "An Unexpected Error has occured!" });
        }
    }

// Hard coding text and buttons onto js file
    return (
        <div>
            <div className="logo-container">
                <Logo />
            </div>
            <div className="family-container" >

                <div className="parentSuperConatiner">
                    <h3 style={{ marginTop: "2rem" }}>PLEASE CHANGE YOUR ACCOUNT PASSWORD</h3>

                    <p style={{ color: parseInt(status?.status) === 200 ? "green" : "red" }}>{status?.msg}</p>
                    <div style={{ display: "flex", flexDirection: "column", width: "30%" }} >
                        <div className="class-form" style={{ display: "flex", flexDirection: "column", gap: "20px", justifyContent: "space-between", width: "100%", padding: "20px", backgroundColor: "#fff", }}>
                            <input
                                type="text"
                                value={password}
                                style={{ display: "inline-block", borderColor: "#326C6F", marginLeft: "10px" }}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button onClick={() => updateUser()} className="loginPage" style={{ marginLeft: "20px", cursor: "pointer", padding: "10px", backgroundColor: "#326C6F", color: "#fff" }} >
                                Change Password
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default ChangePassword;