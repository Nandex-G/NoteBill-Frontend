import { useEffect, useState } from "react"
import { BillCard, BillForm, Button } from "../components/index"
import { BillContextProvider } from "../context/provider"

function Bills() {

  const [ Username, setUsername ] = useState(null)

  const [ bills, setBills ] = useState([])
  const [ billFormVisibility, setBillFormVisibility] = useState(false)

  const [ loadingDisplay, setLoadingDisplay] = useState('flex')
  const [ loadingOpacity, setLoadingOpacity] = useState('opacity-100')
  const [ loadingMessage, setLoadingMessage] = useState('درحال بارگذاری...')

  const englishTextTransformer = (str) => {
    if (!str) return 0;
  
    const clean = str.replace(/[,٬\s]/g, "");
  
    const english = clean.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  
    return Number(english);
  }

  const addBill = (bill) => {
    const token = localStorage.getItem('NOTEBILLTOKEN')
    loadingVisibilityChanger(true)
    fetch('https://notebill-backend.onrender.com/create-bill', { method : 'POST', headers : {'Content-Type': 'application/json', 'x-auth-token' : token}, body : JSON.stringify(bill) })
      .then( response => response.json() )
      .then( bill => {
        setBills( prev => [...prev, bill]); 
        setLoadingMessage('بدهی با موفقیت اضافه شد'); 
        setTimeout(() => { loadingVisibilityChanger(false); setLoadingMessage('درحال بارگذاری...') }, 500) 
      })
      .catch(() => { alert('اضافه کردن بدهی با شکست مواجه شد.'); loadingVisibilityChanger(false) })
  }

  const removeBill = (ID, billTitle) => {
    if (confirm(`آیا میخواهید بدهی به نام "${billTitle}" را حذف کنید؟`)) {
      loadingVisibilityChanger(true)
      setLoadingMessage('درحال حذف بدهی...')
      fetch(`https://notebill-backend.onrender.com/delete-bill/${ID}`, { method : 'DELETE'})
        .then(() => {
          setLoadingMessage('بدهی با موفقیت حذف شد.'); 
          setBills( bills.filter( bill => bill._id !== ID)); 
          setTimeout(() => { loadingVisibilityChanger(false); setLoadingMessage('درحال بارگذاری...') }, 500 )
        })
        .catch(() => { alert('حدف کردن بدهی با شکست مواجه شد.'); loadingVisibilityChanger(false) })
    }  
  }

  const editBill = (ID, inputList) => {
    loadingVisibilityChanger(true)
    setLoadingMessage('...درحال ویرایش کردن بدهی')
    fetch(`https://notebill-backend.onrender.com/edit-bill/${ID}`, { method : 'PUT', headers : {'Content-Type': 'application/json'}, body : JSON.stringify({ title : inputList[0].value, name : inputList[1].value, fullPrice : englishTextTransformer(inputList[2].value) }) })
      .then( response => response.json() )
      .then( response => {
        setLoadingMessage('بدهی با موفقیت ویرایش شد.')
        setTimeout(() => {
          loadingVisibilityChanger(false)
        }, 500);
        setBills( prev => prev.map( bill => bill._id == ID ? response : bill ) )
        console.log(bills);
      })
  }

  const addPaidAmount = (ID , amount) => {
    let billPaidPrice = 0
    bills.map( bill => {
      if (bill._id === ID) {
        billPaidPrice = bill.paidPrice + amount
      }
    })
    fetch(`https://notebill-backend.onrender.com/increase-paid/${ID}`, { method : 'PUT', headers : {'Content-Type': 'application/json'}, body : JSON.stringify( {paidPrice :billPaidPrice} ) })
      .then( () => {
        setBills( (prev) =>
          prev.map( (bill) => {
            if (bill._id === ID) {
              return { ...bill , paidPrice : billPaidPrice }
            } else {
              return bill
            }                
          })
        )
      })
      .catch( () => alert('عملیات اضافه کردن مبلغ پرداخت شده با شکست مواجه شد.') )
  }

  const billFormVisibilityChanger = (boolean) => {
    setBillFormVisibility(boolean)
  }

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
      }, 300);    
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('NOTEBILLTOKEN')
    fetch('https://notebill-backend.onrender.com/', { method : 'GET', headers : {'x-auth-token' : token} })
      .then( response => response.json() )
      .then( billList => {setBills(Array.isArray(billList) ? billList : []);; loadingVisibilityChanger(false)} )  
      .catch( (error) => console.log('There was an error when fetching Bills from database:',error) )
    if (token) {
      fetch('https://notebill-backend.onrender.com/api/auth/user', { headers : {'x-auth-token': token} })
        .then( response => response.json() )
        .then( data => {setUsername(data.username); data.msg == 'توکن نامعتبر است' ? localStorage.removeItem('NOTEBILLTOKEN') : null} )
        .catch( error => { console.log('There wan an error in fetching account : ======>', error); setTimeout(() => location.reload(), 5000) } )
    }
  }, [])


  return (
    <BillContextProvider value={{bills, addBill, removeBill, editBill, addPaidAmount, billFormVisibilityChanger}} >
      <div className="w-full h-full py-12 flex flex-col items-center">
        <div className="bg-slate-100 opa md:px-12 pb-5 scroll0 flex gap-3 flex-wrap justify-center">
          {
            
            bills && bills.map((bill) => {              
              return <BillCard title={bill.title} name={bill.name} key={bill._id} fullPrice={bill.fullPrice} paidPrice={bill.paidPrice} id={bill._id}/>
            })
          }
        </div>
        <div className="inline">
          <Button hoverBgColor="hover:bg-green-700" bgColor="bg-green-600" classNames={`shadow-xl py-2 px-8 rounded-2xl font-bold text-xs sm:text-sm md:text-lg ${Username ? 'opacity-100' : 'opacity-50'}`} value="اضافه کردن بدهی جدید" onClick={() => Username ? billFormVisibilityChanger(true) : alert('ّابتدا باید وارد حساب خود شوید')} />  
        </div>
      </div>
      <div className={`${loadingDisplay} ${loadingOpacity} none absolute z-50 top-0 w-full h-full bg-black/30 backdrop-blur-sm justify-center items-center duration-200 `}>
        <div className="flex flex-col justify-center bg-black/50 items-center p-5 rounded-2xl duration-300">
          <div className="text-gray-300 text-sm sm:text-xl mb-2">{loadingMessage}</div>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 sm:w-32 sm:h-32 duration-200" viewBox="0 0 200 200"><path fill="#CDBFFF" stroke="#CDBFFF" strokeWidth="15" transformOrigin="center" d="m148 84.7 13.8-8-10-17.3-13.8 8a50 50 0 0 0-27.4-15.9v-16h-20v16A50 50 0 0 0 63 67.4l-13.8-8-10 17.3 13.8 8a50 50 0 0 0 0 31.7l-13.8 8 10 17.3 13.8-8a50 50 0 0 0 27.5 15.9v16h20v-16a50 50 0 0 0 27.4-15.9l13.8 8 10-17.3-13.8-8a50 50 0 0 0 0-31.7Zm-47.5 50.8a35 35 0 1 1 0-70 35 35 0 0 1 0 70Z"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="0;120" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></path></svg>
        </div>
      </div>
      <BillForm visibility={billFormVisibility}/>
    </BillContextProvider>
  )
}

export default Bills
