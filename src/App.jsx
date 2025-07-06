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
    <div className="bg-slate-100 min-h-screen"> 
      <div className={`flex justify-center flex-col items-center relative duration-200 ${ shownAccounting ? 'top-0' : '-top-11 md:-top-16' }`}>
        <div className="bg-amber-600 py-3 px-8 md:py-4 font-sans font-bold md:px-12 relative rounded-b-xl text-sm md:text-lg h-11 md:h-16 max-w-2xs min-w-40 md:min-w-52 text-center">
          {
            Username ? (
              <h1>{Username.length <= 12 ? Username.charAt(0).toUpperCase() + Username.slice(1) : Username.slice(0, 12) + '...'}</h1>
            ) : (
              <div>
                <Link to={"/login"} className="underline">ثبت‌نام / ورود</Link>
              </div>
            )
          }
        </div>
        <div className="flex">
          <button onClick={() => { if(confirm('آیا میخواهید از حساب خود خارج شوید؟')) {localStorage.removeItem('NOTEBILLTOKEN'); setUsername(null)}}} className={`bg-red-500 text-xs sm:text-sm m-1 w-12 md:w-16 rounded-2xl justify-center items-center cursor-pointer hover:bg-red-600 duration-200 py-1 md:py-2 ${ shownAccounting && Username ? 'flex' : 'hidden'}`}>خروج</button>
          <div onClick={() => setShownAccounting(!shownAccounting)} className={`bg-green-500 ${ shownAccounting ? 'py-1 md:py-2 m-1 rounded-2xl w-12 md:w-16' : 'p-2 md:py-3 rounded-b-lg w-36 md:w-48' } text-nowrap overflow-hidden text-xs text-center md:text-sm cursor-pointer hover:bg-green-600 duration-200`}>{ shownAccounting ? 'بستن' : 'نمایش حساب کاربری'}</div>
        </div>
      </div>
      <Outlet/>
    </div>
  )
}

export default App