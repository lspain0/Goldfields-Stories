import React from "react";

function Login(){

    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')


    async function submit(e){
        e.preventDefault();

    <div className="login">

    <h1>Login</h1>

    <form action="POST">
        <input type="email" onChange={(e) => { setEmail(e.target.value) }} placeholder="Email"  />
        <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password"  />
        <input type="Log In" onClick={submit} />

    </form>
    <br />

    <p>OR</p>

    <br />

    <Link to="/Registration">Signup</Link>

</div>
}
}

export default Login