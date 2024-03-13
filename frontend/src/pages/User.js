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


    //Fetching stories from backend
    const fetchStories = async () => {
        const response = await axios.get('/classes/list')
        if (response.status == "200") {
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
                if (response?.status == "200") {
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
            if (response?.status == "200") {
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
            if (response?.status == "200") {
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
                <p style={{ color: deleteStatus?.status == "200" ? "green" : "red" }}>{deleteStatus?.msg}</p>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "left", gap: "10px" }}>
                    {list.length > 0 ? (
                        list.map((row, index) => (
                            <div key={row?._id} style={{ minHeight: "250px", width: "300px", textAlign: "left" }} className="story-card">
                                <h4 style={{ textTransform: "capitalize" }} className="story-h4">{row?.name}

                                    {
                                        role !== "Teacher" && localStorage.getItem("email") !== row?.email &&
                                        <span onClick={() => deleteUser(row?._id, row?.name)} style={{ color: "red", cursor: "pointer", float: "right" }}> Delete User</span>
                                    }
                                </h4>
                                <p className="story-p">{row?.email}</p>
                                <p className="story-p">Current Role:{row?.role}</p>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    {
                                        role !== "Teacher" && localStorage.getItem("email") !== row?.email &&
                                        <>
                                            <span className="story-p">Change Role</span>
                                            <select value={row?.role} onChange={(e) => updateUser(row?._id, e.target.value)} style={{ width: "50%", marginLeft: "10px", cursor: "pointer", marginTop: "0px", float: "right" }}>
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
                                        ["Parent"].includes(row?.role) && localStorage.getItem("email") !== row?.email && ["Admin", "Parent"].includes(localStorage.getItem("role")) &&
                                        <>
                                            <span className="story-p">Assign to Child</span>
                                            <select value={row?.child} onChange={(e) => updateChild(row?._id, e.target.value)} style={{ width: "50%", marginLeft: "10px", cursor: "pointer", marginTop: "0px", float: "right" }}>
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
                        ))
                    ) : (
                        <p>No classes created yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Class;
