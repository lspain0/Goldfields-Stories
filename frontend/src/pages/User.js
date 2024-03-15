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

                                            style={{ padding: "10px", cursor: "pointer", textTransform: "capitalize", backgroundColor: selecetUser?.email == row?.email ? " #0000ff45" : "#80808063", margin: "5px", width: "250px", textAlign: "center", color: "black", fontSize: "20px" }} key={row?._id}>
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

                        <div style={{ transition: "opacity 500ms", padding: "10px", margin: "5px", width: "25%", background: "gray", fontWeight: "bold", zIndex: "9", border: "2px solid #80808075" }}>
                            <p style={{ color: parseInt(deleteStatus?.status) === 200 ? "green" : "red" }}>{deleteStatus?.msg}</p>


                            <div style={{ display: "flex", flexFlow: "column" }}>
                                <p className="story-p" style={{ textTransform: "capitalize" }}>Full Name: {selecetUser?.name}
                                    {
                                        role !== "Teacher" && localStorage.getItem("email") !== selecetUser?.email &&
                                        <img title="Delete User" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAgVBMVEX///8AAADX19fm5ubR0dGlpaVxcXH4+PiCgoITExPy8vKXl5fd3d2RkZH7+/tdXV18fHy3t7e/v7/MzMyoqKgmJiYsLCxiYmIhISE9PT3s7OxDQ0NqampJSUnj4+MzMzOdnZ1TU1N/f3+Kioqnp6cLCwsZGRnFxcVubm5PT0+6urqE6JYVAAAGgUlEQVR4nO2d61byOhBAjdzvBQQRsIL4Kfr+D3jsqeJMmzRkcmWt2X9J29m0TdNkmtzdhaK1mOx3AyHEYLefLFrBjhuIZfYuMO/ZMnZQ7hiO/gkZg1EvdmhO6E2keiWjaezw7Ok0+BU8xA7Qku1OIyjE8zB2kDYstH4FH7HDpDO6SlCITuxAqfSvFPyucGKHSuP1akEhJrGDpXDtJVpyg1Xql5GgEDfXwtlKJFb9+XKcj5fz/kry6621b+rPwVMOfs7rtdAsWqwkHmp+1VPUO1WLLKJESqRXCf4llxTK17jQIHiYFlTOT1dRbI+LHQJGaMkQR54pC3ZxwYAhWoLfl84NJR9Rydt5KKKwnxqLonvxJVB81nwgw+YemTEqOw4UoS3o7jppCmew8K20wNFp0TVVUK3UfEUnQw5j7muLd03+jzSYm91ZbVi8HSA+e+DjfnNFeWgY/22/p+duBiI+67dALZsryvd8Xcmth+6TSIWn7nzrVm972sSWqrGZuJO8n+mPF4VHNy2E4aP+UNHYO7gp5/rDROXLVnCvP0Zk1O9m19BLp/pU82wxfjWUj/ulxop8M05lnX4pQm6w60fGUuFIE6x19yXMgSLY1u83ISjP/mryxHcT4mE5bsVnvHyrN7IIt2J1/P3fQ0pJBdNap/rceB+VHdg9V31Q6WtdmW5f+Y+s20YeqLQnTbMB1lZbhwHnQRg+MXA35sFHfA7AfetmWStoiHrnKUB7Xuh1zSfcNN2eaPTMbhofqQO3THlwFp6Ja/r1LqDbMOWxWVSfmrxifFA3DA1KiLg32BA+Dd+9hecCaGiSsAKr0pRvQ/yGZ9IsOYDtHr1F5wLYEWgyJHCbhgeD7To3aWhyDmFN8+wtOhc8g0hNEh3Q08JbdC6AgZq8H9zDDWX5TKmAxptNnocoayv+qKUaWCUKo04I2FO69hWeA2CcZtk4KAck3YYpapa+Gm2KM3xT6oOC4BRIs46IKdo21YbbEUVpuDHuyUqvp63gbBUjel4IsfcSohXTSrewcU8EvgLEe2q59B+VkT/zO6lyEoX4TKlLcfFcDY/QLulW9/EtmY3eOrF5G2U1vWvy5+pMb2MAuMSoF+rCLQ2vETs8dZ9/poP5wNMPtzIKbPHlm9n3Z7Gwyp2uDUQmiOU3DOlXN9Zpxb20877OLnrkl+mmfu1c5YUv00wwnTnMex/rDxcBl+OaqBnejQkMxKRvzcjQ4X7NYUMqbBgONqTChuFgQypsGA42pMKG4WBDKmwYDjakwobhYEMqbBgONqTChuFgQypsGA42pMKG4WBDKmwYDjakwoa/bDtZv/E7x+UkmzTmU3/1s07TPGyRDX8yJZRfoLTKmRrWyklbf74oa0i7j2t4SU5WpHv+fZasOEuXT2DUM0BENQSpmnKDvxkQ5LPJgA+zlV+TRTUERaQprW1dcCezgwQ3hGWk353CdFxp0ivMEFTdqjEN4SmSfsMPV/SQfjwwAAVUSXmpGEqnyIfLIbAhG7KhMWxYwIZsyIYlbEiFDQvYkA3ZsIQNqbBhARuyIRuWsCEVNixgQzZkwxI2pMKGBWzIhmxYwoZU2LCADdmQDUvYkAobFrAhG7JhCRtSYcMCNmRDNixhQypsWMCGbMiGJWxIhQ0L2JAN2bCEDamwYQEbsuFtGUoXCYOGJ1kBuKhoioZDUES6VB9cWUm6ghFc62WoOEpMQ7jMuXTaCLiWvVQArJv6qTpIVMO/QvJJIe4mlwKKVbb+ppVQLiET1fByDt5Vl9jvMuGqNT+Hm58C6hlg4hrejY/F79JapGReVCarhpXuTsWii7OG9SgjG36fhbxp+pz/C6hO8A/bvHEVruiG3mFDKnmShi6XtYePMtUUSEFoeQsE7jjmUusLbxfTBuy463TPZsB111ZO93z29t8ZgZZ8d/tPo/VIlRNxeecAw7Bcf7QCqkyFi5UxKQxRFMp57WjAdzf5VF4B2MEg1o53jq6Ppmn/PILXQnd9r+ALJEp9esYhaNq35mR4/0+O7wIt4zUO4NX5EbaiwmtIx7xbPbyHllV9GfLd6audt3yTt+en+orEVmtxq9jUDhMPt+2ZX1JaFNjlUsCATmyvC95aVX39sYMg7TF3Q61Gi4LXh/FEf3zveKlG/5jrI/BMQ1+kG1r1Z1NIgrSlYlapbwH8vpnGuhtH0zCCBV8zfTyOeWyczt4D0/YhO64H+sisGayPWadNPn3/AQoOcMGPBBghAAAAAElFTkSuQmCC"
                                            onClick={() => deleteUser(selecetUser?._id, selecetUser?.name)} style={{ color: "red", cursor: "pointer", float: "right", width: "20px", height: "20px" }} />
                                    }
                                </p>
                                <p className="story-p">Email Address: {selecetUser?.email}</p>
                                <p className="story-p">Current Role:{selecetUser?.role}</p>
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
