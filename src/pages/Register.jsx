import { useState } from 'react'
import { Link } from 'react-router-dom'
export default function Register() {
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

  const [form, setForm] = useState({ username: '', password: '' })

  const changeValue = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.toLowerCase() })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    loadingVisibilityChanger(true)
    setLoadingMessage('در حال ثبت‌نام...')

    const response = await fetch('https://notebill-backend.onrender.com/api/auth/register', { method : 'POST', headers : {'Content-Type' : 'application/json'}, body : JSON.stringify(form) })
    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('NOTEBILLTOKEN', data.token)
      window.location.href = data.redirect
      loadingVisibilityChanger(false)
    } else {
      alert(data + ' ❌ ')
      loadingVisibilityChanger(false)
    }
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-[#2a2e5c] to-[#3e497a] p-1 rounded-3xl shadow-2xl w-fit">
      <div className="bg-[#1f2333] text-white rounded-2xl px-6 py-8 sm:p-10 flex flex-col justify-center items-center relative w-full sm:w-[350px] md:w-[400px]">
        <span className="text-white/90 text-xl md:text-3xl font-bold mb-6 border-b border-[#4a516d] pb-3 w-full text-center">ثبت‌نام</span>

        <form className="w-full flex flex-col gap-5 mb-6" onSubmit={handleSubmit}>
          <input className="bg-[#2a2f45] border border-[#3e4462] text-white placeholder:text-white/60 rounded-xl p-3 text-center text-base outline-none focus:ring-2 focus:ring-purple-400 transition" onChange={changeValue} value={form.username} type="text" name="username" required placeholder="نام کاربری"/>
          <input className="bg-[#2a2f45] border border-[#3e4462] text-white placeholder:text-white/60 rounded-xl p-3 text-center text-base outline-none focus:ring-2 focus:ring-purple-400 transition" onChange={changeValue} value={form.password} type="text" name="password" required placeholder="رمز عبور" />
          <button type="submit" className="w-full bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] hover:from-[#5b21b6] hover:to-[#6d28d9] text-white font-bold py-2 rounded-xl transition duration-200" >ورود</button>
        </form>

        <div className="text-sm text-white/70">حساب دارید؟{" "}<Link to="/login" className="text-purple-300 hover:text-purple-200 underline transition">وارد شوید</Link> </div>

        <Link to="/" className="mt-6 w-full text-center bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl transition duration-200 font-medium" > خانه </Link>

        {/* Loading */}
        <div className={`${loadingDisplay} ${loadingOpacity} absolute rounded-2xl z-50 top-0 w-full h-full bg-black/30 backdrop-blur-sm justify-center items-center duration-200 flex`}>
          <div className="flex flex-col justify-center bg-black/50 items-center p-5 rounded-2xl duration-300">
            <div className="text-gray-300 text-sm sm:text-lg mb-2">{loadingMessage}</div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 sm:w-24 sm:h-24 duration-200" viewBox="0 0 200 200"><path fill="#CDBFFF" stroke="#CDBFFF" strokeWidth="15" transformOrigin="center" d="m148 84.7 13.8-8-10-17.3-13.8 8a50 50 0 0 0-27.4-15.9v-16h-20v16A50 50 0 0 0 63 67.4l-13.8-8-10 17.3 13.8 8a50 50 0 0 0 0 31.7l-13.8 8 10 17.3 13.8-8a50 50 0 0 0 27.5 15.9v16h20v-16a50 50 0 0 0 27.4-15.9l13.8 8 10-17.3-13.8-8a50 50 0 0 0 0-31.7Zm-47.5 50.8a35 35 0 1 1 0-70 35 35 0 0 1 0 70Z" ><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="0;120" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite" /></path></svg>
          </div>
        </div>
      </div>
    </div>
  )
}