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

function InviteFamily() {
//Defining variables state that uses useState
    
    const [list, setList] = useState([]);
    const [deleteStatus, setDeleteStatus] = useState({
        status: "",
        msg: ""
    });

    const [selecetUser, setSelecetUser] = useState({});

    //Fetching from backend
    async function getData() {

        try {
            //Fetching user list
            const list = "/users/userList";
            
            //Fetching user role parent and email
            const response = await axios.post(list, { role: "Parent", email: localStorage.getItem("email") });
            for (let row of response?.data) {
                if (row?.email == selecetUser?.email) {
                    setSelecetUser(row);
                    break;
                }
            }
            setList(response?.data);
        } catch (error) {
        }
    }

    
    const updateUser = async (id, role, code_no) => {
        try {

            //Endpoint to update the users
            const list = "/users/update";
            
            let _code = `code${code_no}`;
            let obj = {
                id: id
            };
            //Creating object with role value
            obj[_code] = role;
            const response = await axios.post(list, { ...obj });

            //If statement for when request is successful and displays message
            if (parseInt(response?.status) === 200) {
                setDeleteStatus({ status: 200, msg: `Invite Code-${code_no} has been saved successfully!` });
                setTimeout(() => {
                    setDeleteStatus({ status: "", msg: "" });
                }, 2000);
                await getData();
            }
            else {
                setDeleteStatus({ status: 400, msg: "An Unexpected Error has occured!" });

            }

        } catch (error) {
            setDeleteStatus({ status: 400, msg: "An Unexpected Error has occured!" });
        }
    }

    useEffect(() => {
        getData();
    }, [])
    
    return (
        <div>
            <div className="logo-container">
                <Logo />
            </div>
            <div className="family-container" >

                {/*Family container */}
                <div className="familySuperConatiner">
                    <p style={{ color: parseInt(deleteStatus?.status) === 200 ? "green" : "red" }}>{deleteStatus?.msg}</p>
                    {
                        list.map((row, index) => {
                            return (
                                <>
                                {/* Family 1 generate code*/}
                                    <div className="familyMainConatiner" key={"listing1" + index} >
                                        <div>
                                            <p style={{ marginRight: "20px" }}>Invite code for
                                                <span style={{ marginLeft: "5px" }}>Family - 1 </span> </p>
                                            {
                                                row?.code1 &&
                                                <p>
                                                    Generated Code - 1:<span style={{ fontWeight: "bold", marginLeft: "10px" }}>{row?.code1}</span>
                                                </p>
                                            }
                                        </div>
                                        {/* Invite code button 1*/}
                                        <p style={{ marginLeft: "70px" }}>
                                            <button className="familyButton" style={{ width: "150px", cursor: row?.code1 ? "not-allowed" : "pointer", padding: "10px", backgroundColor: row?.code1 ? "#326c6f4a" : "#326C6F" }}
                                                onClick={() => {
                                                    if (!row?.code1) {
                                                        updateUser(row?._id, generateRandomString(), 1)
                                                    }
                                                }}>
                                                Invite Code
                                            </button>

                                        </p>
                                    </div>
                                    {/* Family 2 generate code*/}
                                    <div className="familyMainConatiner" key={"listing2" + index} >
                                        <div>
                                            <p style={{ marginRight: "20px" }}>Invite code for
                                                <span style={{ marginLeft: "5px" }}>Family - 2</span> </p>
                                            {
                                                row?.code2 &&
                                                <p>
                                                    Generated Code - 2:<span style={{ fontWeight: "bold", marginLeft: "10px" }}>{row?.code2}</span>
                                                </p>
                                            }
                                        </div>
                                          {/* Invite code button 2*/}
                                        <p style={{ marginLeft: "70px" }}>
                                            <button className="familyButton" style={{ width: "150px", cursor: row?.code2 ? "not-allowed" : "pointer", padding: "10px", backgroundColor: row?.code2 ? "#326c6f4a" : "#326C6F" }}
                                                onClick={() => {
                                                    if (!row?.code2) {
                                                        updateUser(row?._id, generateRandomString(), 2)
                                                    }
                                                }}>
                                                Invite Code
                                            </button>

                                        </p>
                                    </div>
                                </>
                            )

                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default InviteFamily;
