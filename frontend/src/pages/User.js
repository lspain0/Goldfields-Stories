import React, { useState, useEffect } from "react";
import Logo from "../components/logo.js";
import "../class.css";
import axios from "../axios.js";

function Class() {

    //Stating variables of user role, list of user, children and delete
    const [role, setRole] = useState("");
    const [list, setList] = useState([]);
    const [children, setChildren] = useState([]);
    const [deleteStatus, setDeleteStatus] = useState({
        status: "",
        msg: ""
    });

    const [selecetUser, setSelecetUser] = useState({});


    //Fetching stories from backend
    const fetchStories = async () => {
        const response = await axios.get('/classes/list')
        if (parseInt(response.status) === 200) {
            let list = [];
            for (let row of response.data) {
                list.push(...row?.students);
            }
            setChildren(list)
        }
    }

    //Userdata from backend
    async function getData() {

        try {
            const list = "/users/userList";
            // Make a POST request to login details
            const response = await axios.get(list);
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

    //Function to delete account
    const deleteUser = async (id, name) => {
        //Confirmation upon delete button being clicked
        if (window.confirm(`Are you sure you want to delete ${name} ?`)) {
            try {
                const list = "/users/delete";
                // Make a POST request to login details
                const response = await axios.post(list, { id: id });
                if (parseInt(response?.status) === 200) {
                    setDeleteStatus({ status: 200, msg: "Deleted Successfully!" });

                    setTimeout(() => {
                        setDeleteStatus({ status: "", msg: "" });

                    }, 2000);
                    //Refresh user data after being deleted
                    await getData();
                }
                else {
                    setDeleteStatus({ status: 400, msg: "something went wrong!" });

                }

            } catch (error) {
                setDeleteStatus({ status: 400, msg: "something went wrong!" });
            }
        }
    }

    //Function to update user role
    const updateUser = async (id, role) => {
        try {

            const list = "/users/update";
            // Make a POST request to login endpoint of email and password
            const response = await axios.post(list, { id: id, role: role });
            console.log(response);
            if (parseInt(response?.status) === 200) {
                setDeleteStatus({ status: 200, msg: "Role updated Successfully!" });
                setTimeout(() => {
                    setDeleteStatus({ status: "", msg: "" });
                }, 2000);
                await getData();
            }
            else {
                setDeleteStatus({ status: 400, msg: "An Unexpected error occured!" });

            }

        } catch (error) {
            setDeleteStatus({ status: 400, msg: "An Unexpected error occured!" });
        }
    }

    const updateChild = async (id, child) => {
        try {
            const list = "/users/update";
            // Make a POST request to login endpoint of email and password
            const response = await axios.post(list, { id: id, child: child });
            if (parseInt(response?.status) === 200) {
                setDeleteStatus({ status: 200, msg: "Story Updated Successfully!" });
                setTimeout(() => {
                    setDeleteStatus({ status: "", msg: "" });
                }, 2000);
                await getData();
            }
            else {
                setDeleteStatus({ status: 400, msg: "something went wrong!" });
            }

        } catch (error) {
            setDeleteStatus({ status: 400, msg: "something went wrong!" });
        }
    }


    useEffect(() => {
        setRole(localStorage.getItem("role"));
        getData();
        fetchStories();
    }, [])
    //Display all users, each user gets a small shape format which has name email current role and delete user
    return (
        <div className="class-page-container">
            <div className="logo-container">
                <Logo />
            </div>
            <div className="classes-container">
                <h3 style={{ fontSize: "30px" }}>All Registered Users</h3>
                <div style={{ display: "flex", flexFlow: "row" }}>
                    <ul style={{ listStyle: "none", width: "40%" }}>
                        {list.length > 0 ? (
                            list.map((row, index) => {

                                if (localStorage.getItem("email") !== row?.email) {
                                    return (
                                        <li onClick={() => setSelecetUser(row)}

                                            style={{ padding: "10px", cursor: "pointer", textTransform: "capitalize", backgroundColor: selecetUser?.email == row?.email ? " #E9AF0C" : "#80808063", margin: "5px", width: "250px", textAlign: "center", color: "black", fontSize: "20px" }} key={row?._id}>
                                            {row?.name}

                                        </li>
                                    );
                                }
                            })
                        ) : (
                            <li>No classes created yet.</li>
                        )}
                    </ul>
                    {
                        Object.keys(selecetUser).length >= 1 &&

                        <div className="story-card" style={{ transition: "opacity 500ms", padding: "10px", margin: "5px", width: "35%", minHeight: "250px", background: "gray", fontWeight: "bold", zIndex: "9", border: "2px solid #80808075" }}>
                            <p style={{ color: parseInt(deleteStatus?.status) === 200 ? "green" : "red" }}>{deleteStatus?.msg}</p>

                            <div style={{ display: "flex", flexFlow: "column" }}>
                                <p className="story-p" style={{ textTransform: "capitalize" }}>Full Name: <span style={{ marginLeft: "10px" }}>{selecetUser?.name}</span>
                                    {
                                        role !== "Teacher" && localStorage.getItem("email") !== selecetUser?.email &&

                                        <svg onClick={() => deleteUser(selecetUser?._id, selecetUser?.name)} style={{ color: "red", cursor: "pointer", float: "right", width: "20px", height: "20px" }} fill="white" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                            width="50px" height="50px" viewBox="0 0 482.428 482.429">
                                            <g>
                                                <g>
                                                    <path d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098
                                                            c-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117
                                                            h210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828
                                                            C436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879
                                                            C206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096
                                                            c-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266
                                                            c-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979
                                                            V115.744z"/>
                                                    <path d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07
                                                            c-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z"/>
                                                    <path d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07
                                                            c-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z"/>
                                                    <path d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07
                                                            c-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z"/>
                                                </g>
                                            </g>
                                        </svg>
                                    }
                                </p>
                                <p className="story-p">Email Address:<span style={{ marginLeft: "10px" }}>{selecetUser?.email}</span></p>
                                <p className="story-p">Current Role:<span style={{ marginLeft: "10px" }}>{selecetUser?.role}</span></p>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    {
                                        role !== "Teacher" && localStorage.getItem("email") !== selecetUser?.email &&
                                        <>
                                            <span className="story-p">Change Role</span>
                                            <select value={selecetUser?.role} onChange={(e) => updateUser(selecetUser?._id, e.target.value)} style={{ width: "50%", marginLeft: "10px", cursor: "pointer", marginTop: "0px", float: "right" }}>
                                                <option value=""> Select Role</option>
                                                <option value="Parent"> Parent</option>
                                                <option value="Admin"> Admin</option>
                                                <option value="Teacher"> Teacher</option>
                                            </select>
                                        </>
                                    }
                                </div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    {
                                        ["Parent"].includes(selecetUser?.role) && localStorage.getItem("email") !== selecetUser?.email && ["Admin", "Parent"].includes(localStorage.getItem("role")) &&
                                        <>
                                            <span className="story-p">Assign to Child</span>
                                            <select value={selecetUser?.child} onChange={(e) => updateChild(selecetUser?._id, e.target.value)} style={{ width: "50%", marginLeft: "10px", cursor: "pointer", marginTop: "0px", float: "right" }}>
                                                <option value=""> Select Child</option>
                                                {
                                                    children?.length >= 1 && children?.map((row, index) => (
                                                        <option key={row?._id} value={row?.firstName + ' ' + row?.lastName}> {row?.firstName + ' ' + row?.lastName}</option>
                                                    ))
                                                }
                                            </select>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Class;
