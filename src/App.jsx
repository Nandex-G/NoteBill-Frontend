import { useEffect, useState } from "react"
import { Link, Outlet } from "react-router-dom"



function App() {
  const [ shownAccounting, setShownAccounting ] = useState(false)

  const [ Username, setUsername ] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('NOTEBILLTOKEN')
    if (token) {
      fetch('https://notebill-backend.onrender.com/api/auth/user', { headers : {'x-auth-token': token} })
        .then( response => response.json() )
        .then( data => {setUsername(data.username); data.msg == 'توکن نامعتبر است' ? localStorage.removeItem('NOTEBILLTOKEN') : null} )
        .catch( error => { console.log('There wan an error in fetching account : ======>', error); setTimeout(() => location.reload(), 5000) } )
    }
  }, [])
  


  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-950 min-h-screen"> 
      <div className={`flex flex-col items-center relative duration-200 ${shownAccounting ? 'top-0' : '-top-11 md:-top-16'}`}>
        <div className="bg-gradient-to-br from-[#3f2a55] to-[#5c406c] hover:from-[#502c63] hover:to-[#6d4e7b] text-white text-opacity-95 ring-1 ring-[#6e5c80] py-3 px-8 md:py-4 font-sans font-semibold md:px-12 rounded-b-2xl shadow-lg max-w-xs min-w-[200px] sm:min-w-[250px] md:min-w-[300px] text-center flex justify-center items-center text-sm sm:text-lg md:text-xl select-none transition duration-200">
          {Username ? (
            <h1 className="truncate max-w-full text-white/90 drop-shadow-sm"> {Username.length <= 12 ? Username.charAt(0).toUpperCase() + Username.slice(1) : Username.slice(0, 12) + '...'} </h1>
          ) : (
            <Link to="/login" className="underline text-white/70 hover:text-white transition duration-200" >ثبت‌نام / ورود</Link>
          )}
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={() => { if (confirm('آیا میخواهید از حساب خود خارج شوید؟')) { localStorage.removeItem('NOTEBILLTOKEN'); setUsername(null); location.reload(); } }} className={`w-20 sm:w-24 bg-gradient-to-br from-[#5b2733] to-[#7c2d3a] hover:from-[#471d27] hover:to-[#641f2f] border border-[#893944] flex justify-center items-center text-white text-opacity-95 text-sm md:text-base py-2 md:py-2.5 rounded-xl transition duration-200 ${ shownAccounting && Username ? 'flex' : 'hidden' }`} > خروج </button>
          <button onClick={() => setShownAccounting(!shownAccounting)} className={`bg-[#3a3a6e] hover:bg-[#312e5b] border-2 border-[#3b3a6d] text-white text-opacity-90 text-sm md:text-base py-2 md:py-2.5 duration-200 ${shownAccounting ? 'w-20 sm:w-24' : 'w-44 sm:w-60' } rounded-xl transition`} >{shownAccounting ? 'بستن' : 'نمایش حساب کاربری'}</button>
        </div>
      </div>
      <Outlet/>
    </div>
  )
}

export default App