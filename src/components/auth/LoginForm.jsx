import { useState } from 'react'

function LoginForm() {

    const [ form, setForm ] = useState({ username : '', password : '' })  
  
    const handleSubmit = (e) => {
        console.log(e);
    }

    const handleChange = (e) => {
        console.log(e.target);
    }
  
  
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name='username' value={form.username} onChange={handleChange} />
            <input type="password" name='password' value={form.password} onChange={handleChange} />
            <button type='submit'>ورود</button>
        </form>
    )
}

export default LoginForm