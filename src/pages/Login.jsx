import { useState } from 'react';
import { Link } from 'react-router-dom'

function Login() {
    // Loading

        const [ loadingDisplay, setLoadingDisplay] = useState('hidden')
        const [ loadingOpacity, setLoadingOpacity] = useState('opacity-0')
        const [ loadingMessage, setLoadingMessage] = useState('درحال بارگذاری...')

        const loadingVisibilityChanger = (boolean) => {
            if (boolean) {
                setLoadingDisplay('flex') 
                setTimeout(() => {
                setLoadingOpacity('opacity-100')       
                }, 300);
            } else {
                setLoadingOpacity('opacity-0')
                setTimeout(() => {
                    setLoadingDisplay('hidden')
                    setLoadingMessage('درحال بارگذاری...')
                }, 300);    
            }
        }
    
    // 

    const [ form, setForm ] = useState({ username : '', password : '' })

    const changeValue = (e) => {
        setForm({ ...form, [e.target.name] : e.target.value.toLowerCase() })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        loadingVisibilityChanger(true)
        setLoadingMessage('در حال ورود...')

        const response = await fetch('https://notebill-backend.onrender.com/api/auth/login', { method : 'POST', headers : {'Content-Type' : 'application/json'}, body : JSON.stringify(form) })    
        const data = await response.json()

        if (response.ok) {
            alert('با موفقیت وارد شدید! ✅')
            localStorage.setItem('NOTEBILLTOKEN', data.token)
            console.log(data)
            window.location.href = data.redirect
            loadingVisibilityChanger(false)
        } else {
            alert(data.msg + ' ❌ ')
            loadingVisibilityChanger(false)
        }
        
    }

  return (
    <div className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gray-500 rounded-2xl'>
        <Link className='hover:bg-green-700 duration-200 absolute top-full right-1/2 translate-x-1/2 bg-green-600 w-1/3 text-center py-2 rounded-b-2xl' to={'/'}>خانه</Link>
        <div className='flex flex-col justify-center items-center p-5 sm:p-10'>
            <span className='text-white text-lg md:text-3xl mb-3 pb-3 md:mb-6 md:pb-6 w-full text-center border-b-2'>ورود</span>
            <form className='mb-6 sm:mb-12 flex flex-col gap-5 sm:gap-10 text-xs md:min-w-96' onSubmit={handleSubmit}>
                <input className='bg-white rounded-2xl outline-0 p-2 sm:py-2 sm:px-5 text-center text-sm sm:text-xl' onChange={changeValue} value={form.username} type="text" required name='username' placeholder='نام کاربری'/>
                <input className='bg-white rounded-2xl outline-0 p-2 sm:py-2 sm:px-5 text-center text-sm sm:text-xl' onChange={changeValue} value={form.password} type="text" required name='password' placeholder='رمز عبور'/>
                <button className='w-full bg-green-500 rounded-2xl p-2 hover:bg-green-600 sm:text-lg duration-200' type="submit">ورود</button>
            </form>
            <div className='text-xs sm:text-sm'>حساب کاربری ندارید؟<Link to={'/register'} className='underline cursor-pointer text-blue-800 hover:text-blue-700 duration-150'> یکی بسازید</Link></div>
        </div>
        {/* Loading */}
        <div className={`${loadingDisplay} ${loadingOpacity} none absolute rounded-2xl z-50 top-0 w-full h-full bg-black/30 backdrop-blur-sm justify-center items-center duration-200 `}>
            <div className="flex flex-col justify-center bg-black/50 items-center p-5 rounded-2xl duration-300">
                <div className="text-gray-300 text-xs sm:text-lg mb-2">{loadingMessage}</div>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 sm:w-24 sm:h-24 duration-200" viewBox="0 0 200 200"><path fill="#CDBFFF" stroke="#CDBFFF" strokeWidth="15" transformOrigin="center" d="m148 84.7 13.8-8-10-17.3-13.8 8a50 50 0 0 0-27.4-15.9v-16h-20v16A50 50 0 0 0 63 67.4l-13.8-8-10 17.3 13.8 8a50 50 0 0 0 0 31.7l-13.8 8 10 17.3 13.8-8a50 50 0 0 0 27.5 15.9v16h20v-16a50 50 0 0 0 27.4-15.9l13.8 8 10-17.3-13.8-8a50 50 0 0 0 0-31.7Zm-47.5 50.8a35 35 0 1 1 0-70 35 35 0 0 1 0 70Z"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="0;120" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></path></svg>
            </div>
        </div>
    </div>
  )
}

export default Login