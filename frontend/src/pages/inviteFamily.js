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
                setDeleteStatus({ status: 200, msg: `Invite Family-${code_no} has been saved successfully!` });
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
                                            <p style={{ marginRight: "20px" }}>Invite
                                                <span style={{ marginLeft: "5px" }}>Family - 1 </span> </p>
                                            {
                                                row?.code1 &&
                                                <p>
                                                    Generated Code - 1:<span style={{ fontWeight: "bold", marginLeft: "10px" }}>{row?.code1}</span>
                                                </p>
                                            }
                                        </div>
                                        {/* Invite Family button 1*/}
                                        <p style={{ marginLeft: "70px" }}>
                                            <button className="familyButton" style={{ width: "150px", cursor: row?.code1 ? "not-allowed" : "pointer", padding: "10px", backgroundColor: row?.code1 ? "#326c6f4a" : "#326C6F" }}
                                                onClick={() => {
                                                    if (!row?.code1) {
                                                        updateUser(row?._id, generateRandomString(), 1)
                                                    }
                                                }}>
                                                Invite Family
                                            </button>

                                        </p>
                                    </div>
                                    {/* Family 2 generate code*/}
                                    <div className="familyMainConatiner" key={"listing2" + index} >
                                        <div>
                                            <p style={{ marginRight: "20px" }}>Invite
                                                <span style={{ marginLeft: "5px" }}>Family - 2</span> </p>
                                            {
                                                row?.code2 &&
                                                <p>
                                                    Generated Code - 2:<span style={{ fontWeight: "bold", marginLeft: "10px" }}>{row?.code2}</span>
                                                </p>
                                            }
                                        </div>
                                          {/* Invite Family button 2*/}
                                        <p style={{ marginLeft: "70px" }}>
                                            <button className="familyButton" style={{ width: "150px", cursor: row?.code2 ? "not-allowed" : "pointer", padding: "10px", backgroundColor: row?.code2 ? "#326c6f4a" : "#326C6F" }}
                                                onClick={() => {
                                                    if (!row?.code2) {
                                                        updateUser(row?._id, generateRandomString(), 2)
                                                    }
                                                }}>
                                                Invite Family
                                            </button>

                                        </p>
                                    </div>

                                                                        {/* Family 3 generate code*/}
                                                                        <div className="familyMainConatiner" key={"listing2" + index} >
                                        <div>
                                            <p style={{ marginRight: "20px" }}>Invite
                                                <span style={{ marginLeft: "5px" }}>Family - 3</span> </p>
                                            {
                                                row?.code3 &&
                                                <p>
                                                    Generated Code - 3:<span style={{ fontWeight: "bold", marginLeft: "10px" }}>{row?.code3}</span>
                                                </p>
                                            }
                                        </div>
                                          {/* Invite Family button 3*/}
                                        <p style={{ marginLeft: "70px" }}>
                                            <button className="familyButton" style={{ width: "150px", cursor: row?.code3 ? "not-allowed" : "pointer", padding: "10px", backgroundColor: row?.code3 ? "#326c6f4a" : "#326C6F" }}
                                                onClick={() => {
                                                    if (!row?.code3) {
                                                        updateUser(row?._id, generateRandomString(), 3)
                                                    }
                                                }}>
                                                Invite Family
                                            </button>

                                        </p>
                                    </div>

                                                                        {/* Family 4 generate code*/}
                                                                        <div className="familyMainConatiner" key={"listing2" + index} >
                                        <div>
                                            <p style={{ marginRight: "20px" }}>Invite 
                                                <span style={{ marginLeft: "5px" }}>Family - 4</span> </p>
                                            {
                                                row?.code4 &&
                                                <p>
                                                    Generated Code - 4:<span style={{ fontWeight: "bold", marginLeft: "10px" }}>{row?.code4}</span>
                                                </p>
                                            }
                                        </div>
                                          {/* Invite code button 4*/}
                                        <p style={{ marginLeft: "70px" }}>
                                            <button className="familyButton" style={{ width: "150px", cursor: row?.code4 ? "not-allowed" : "pointer", padding: "10px", backgroundColor: row?.code4 ? "#326c6f4a" : "#326C6F" }}
                                                onClick={() => {
                                                    if (!row?.code4) {
                                                        updateUser(row?._id, generateRandomString(), 4)
                                                    }
                                                }}>
                                                Invite Family
                                            </button>

                                        </p>
                                    </div>

                                                                        {/* Family 5 generate code*/}
                                                                        <div className="familyMainConatiner" key={"listing2" + index} >
                                        <div>
                                            <p style={{ marginRight: "20px" }}>Invite
                                                <span style={{ marginLeft: "5px" }}>Family - 5</span> </p>
                                            {
                                                row?.code5 &&
                                                <p>
                                                    Generated Code - 5:<span style={{ fontWeight: "bold", marginLeft: "10px" }}>{row?.code5}</span>
                                                </p>
                                            }
                                        </div>
                                          {/* Invite Family button 5*/}
                                        <p style={{ marginLeft: "70px" }}>
                                            <button className="familyButton" style={{ width: "150px", cursor: row?.code5 ? "not-allowed" : "pointer", padding: "10px", backgroundColor: row?.code5 ? "#326c6f4a" : "#326C6F" }}
                                                onClick={() => {
                                                    if (!row?.code5) {
                                                        updateUser(row?._id, generateRandomString(), 5)
                                                    }
                                                }}>
                                                Invite Family
                                            </button>

                                        </p>
                                    </div>

                                                                        {/* Family 6 generate code*/}
                                                                        <div className="familyMainConatiner" key={"listing2" + index} >
                                        <div>
                                            <p style={{ marginRight: "20px" }}>Invite
                                                <span style={{ marginLeft: "5px" }}>Family - 6</span> </p>
                                            {
                                                row?.code6 &&
                                                <p>
                                                    Generated Code - 6:<span style={{ fontWeight: "bold", marginLeft: "10px" }}>{row?.code6}</span>
                                                </p>
                                            }
                                        </div>
                                          {/* Invite Family button 6*/}
                                        <p style={{ marginLeft: "70px" }}>
                                            <button className="familyButton" style={{ width: "150px", cursor: row?.code6 ? "not-allowed" : "pointer", padding: "10px", backgroundColor: row?.code6 ? "#326c6f4a" : "#326C6F" }}
                                                onClick={() => {
                                                    if (!row?.code6) {
                                                        updateUser(row?._id, generateRandomString(), 6)
                                                    }
                                                }}>
                                                Invite Family
                                            </button>

                                        </p>
                                    </div>

                                                                        {/* Family 7 generate code*/}
                                                                        <div className="familyMainConatiner" key={"listing2" + index} >
                                        <div>
                                            <p style={{ marginRight: "20px" }}>Invite
                                                <span style={{ marginLeft: "5px" }}>Family - 7</span> </p>
                                            {
                                                row?.code7 &&
                                                <p>
                                                    Generated Code - 7:<span style={{ fontWeight: "bold", marginLeft: "10px" }}>{row?.code7}</span>
                                                </p>
                                            }
                                        </div>
                                          {/* Invite Family button 7*/}
                                        <p style={{ marginLeft: "70px" }}>
                                            <button className="familyButton" style={{ width: "150px", cursor: row?.code7 ? "not-allowed" : "pointer", padding: "10px", backgroundColor: row?.code7 ? "#326c6f4a" : "#326C6F" }}
                                                onClick={() => {
                                                    if (!row?.code7) {
                                                        updateUser(row?._id, generateRandomString(), 7)
                                                    }
                                                }}>
                                                Invite Family
                                            </button>

                                        </p>
                                    </div>

                                                                        {/* Family 8 generate code*/}
                                                                        <div className="familyMainConatiner" key={"listing2" + index} >
                                        <div>
                                            <p style={{ marginRight: "20px" }}>Invite
                                                <span style={{ marginLeft: "5px" }}>Family - 8</span> </p>
                                            {
                                                row?.code8 &&
                                                <p>
                                                    Generated Code - 8:<span style={{ fontWeight: "bold", marginLeft: "10px" }}>{row?.code8}</span>
                                                </p>
                                            }
                                        </div>
                                          {/* Invite Family button 8*/}
                                        <p style={{ marginLeft: "70px" }}>
                                            <button className="familyButton" style={{ width: "150px", cursor: row?.code8 ? "not-allowed" : "pointer", padding: "10px", backgroundColor: row?.code8 ? "#326c6f4a" : "#326C6F" }}
                                                onClick={() => {
                                                    if (!row?.code8) {
                                                        updateUser(row?._id, generateRandomString(), 8)
                                                    }
                                                }}>
                                                Invite Family
                                            </button>

                                        </p>
                                    </div>

                                                                        {/* Family 9 generate code*/}
                                                                        <div className="familyMainConatiner" key={"listing2" + index} >
                                        <div>
                                            <p style={{ marginRight: "20px" }}>Invite
                                                <span style={{ marginLeft: "5px" }}>Family - 9</span> </p>
                                            {
                                                row?.code9 &&
                                                <p>
                                                    Generated Code - 9:<span style={{ fontWeight: "bold", marginLeft: "10px" }}>{row?.code9}</span>
                                                </p>
                                            }
                                        </div>
                                          {/* Invite Family button 9*/}
                                        <p style={{ marginLeft: "70px" }}>
                                            <button className="familyButton" style={{ width: "150px", cursor: row?.code9 ? "not-allowed" : "pointer", padding: "10px", backgroundColor: row?.code9 ? "#326c6f4a" : "#326C6F" }}
                                                onClick={() => {
                                                    if (!row?.code9) {
                                                        updateUser(row?._id, generateRandomString(), 9)
                                                    }
                                                }}>
                                                Invite Family
                                            </button>

                                        </p>
                                    </div>

                                                                        {/* Family 10 generate code*/}
                                                                        <div className="familyMainConatiner" key={"listing2" + index} >
                                        <div>
                                            <p style={{ marginRight: "20px" }}>Invite
                                                <span style={{ marginLeft: "5px" }}>Family - 10</span> </p>
                                            {
                                                row?.code10 &&
                                                <p>
                                                    Generated Code - 10:<span style={{ fontWeight: "bold", marginLeft: "10px" }}>{row?.code10}</span>
                                                </p>
                                            }
                                        </div>
                                          {/* Invite Family button 10*/}
                                        <p style={{ marginLeft: "70px" }}>
                                            <button className="familyButton" style={{ width: "150px", cursor: row?.code3 ? "not-allowed" : "pointer", padding: "10px", backgroundColor: row?.code10 ? "#326c6f4a" : "#326C6F" }}
                                                onClick={() => {
                                                    if (!row?.code10) {
                                                        updateUser(row?._id, generateRandomString(), 10)
                                                    }
                                                }}>
                                                Invite Family
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