import React, { useState, useEffect } from "react";
import Logo from "../components/logo.js";
import "../invite.css";
import axios from "../axios.js";

function generateRandomString() {
    // a function that generates a random letter
    function getRandomLetter() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    // a function that generates a randon number
    function getRandomNumber() {
        return Math.floor(Math.random() * 10);
    }

    let result = '';

    // Genrating 3 letters
    for (let i = 0; i < 3; i++) {
        result += getRandomLetter();
    }

    // Generting 3 numbers
    for (let i = 0; i < 3; i++) {
        result += getRandomNumber();
    }

    return result;
}

function InviteParent() {
    //Defining variables state that uses useState

    const [status, setStatus] = useState({
        status: "",
        msg: ""
    });


    //React useState that get use to amange email, name and password input. ABC is initialized
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("ABC");


    //Validating email format
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }


    useEffect(() => {
        setPassword(localStorage.getItem("_pass") ?? "ABC");
    }, []);
    const createUser = async () => {
        try {
            //Endpoint to update the users
            const list = "/users/create";

            if (email && name && validateEmail(email)) {

                let obj = {
                    name: name,
                    email: email,
                    password: password,
                    role: "Parent",
                    createdBy: password
                };
                const response = await axios.post(list, { ...obj });

                //If statement for when request is successful and displays message
                if (parseInt(response?.status) === 200) {
                    setStatus({ status: 200, msg: `Parent ${name} has been saved successfully!` });
                    setEmail("");
                    setName("");
                    setTimeout(() => {
                        setStatus({ status: "", msg: "" });
                    }, 2000);
                }
                else {
                    setStatus({ status: 400, msg: "An Unexpected Error has occured!" });
                }
            }
            else {
                if (!name) {
                    setStatus({ status: 400, msg: "Name is required!" });

                }
                else if (!email) {
                    setStatus({ status, msg: "Email is required!" });

                }
                else if (!validateEmail(email)) {
                    setStatus({ status, msg: "Valid email is required!" });

                }

            }
        } catch (error) {
            setStatus({ status: 400, msg: error?.response?.data?.error });
        }
    }

    const updateUser = async () => {
        try {

            if (password) {
                //Endpoint to update the users
                const list = "/users/update";
                let obj = {
                    id: localStorage.getItem("id")
                };
                //Creating object with role value
                obj["defaultPassword"] = password;
                const response = await axios.post(list, { ...obj });
                //If statement for when request is successful and displays message
                if (parseInt(response?.status) === 200) {
                    localStorage.setItem("_pass", password);
                    setStatus({ status: 200, msg: `Password updated successfully!` });
                    setTimeout(() => {
                        setStatus({ status: "", msg: "" });
                    }, 2000);
                }
                else {
                    setStatus({ status: 400, msg: "An Unexpected Error has occured!" });
                }
            }
            else {
                setStatus({ status: 400, msg: "Password is required!" });

            }
        } catch (error) {
            setStatus({ status: 400, msg: "An Unexpected Error has occured!" });
        }
    }

    // Hard coding default password and create account 

    return (
        <div>
            <div className="logo-container">
                <Logo />
            </div>
            <div className="family-container" >

                {/*Default password*/}
                <div className="parentSuperConatiner">
                    <p style={{ color: parseInt(status?.status) === 200 ? "green" : "red" }}>{status?.msg}</p>
                    <div style={{ display: "flex", flexDirection: "column" }} >
                        <div className="class-form" style={{ display: "flex", flexDirection: "row", gap: "20px", justifyContent: "space-between", width: "100%", padding: "20px", backgroundColor: "#fff", }}>
                            <p style={{ fontWeight: "bold" }}>Default Password:
                                <input
                                    type="text"
                                    value={password}
                                    style={{ display: "inline-block", width: "150px", borderColor: "#326C6F", marginLeft: "10px" }}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button onClick={() => updateUser()} className="familyButton" style={{ width: "200px", marginLeft: "20px", cursor: "pointer", padding: "10px", backgroundColor: "#326C6F" }} >
                                    Change Password
                                </button>
                            </p>

                        </div>
                        <div className="class-form" style={{ marginTop: "1rem", display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", padding: "30px", backgroundColor: "#fff" }}>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="loginPage"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="loginPage"
                            />

                            <button onClick={() => createUser()} style={{ width: "150px", cursor: "pointer", padding: "10px", backgroundColor: "#326C6F", width: "100%" }} >
                                Create Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InviteParent;