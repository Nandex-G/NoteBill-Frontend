import { useEffect, useState } from "react"
import { BillCard, BillForm, Button } from "./components/index"
import { BillContextProvider } from "./context/provider"

function App() {

  const [ bills, setBills ] = useState([])
  const [ billFormVisibility, setBillFormVisibility] = useState(false)

  const englishTextTransformer = (str) => {
    if (!str) return 0;
  
    const clean = str.replace(/[,٬\s]/g, "");
  
    const english = clean.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  
    return Number(english);
  }

  const addBill = (bill) => {
    setBills(prev => [ { id : Date.now(), ...bill }, ...prev ])
  }

  const removeBill = (ID, billTitle) => {
    if (confirm(`آیا میخواهید بدهی به نام "${billTitle}" را حذف کنید؟`)) {
      setBills(prev => prev.filter((bill) => bill.id !== ID))  
    }  
  }

  const editBill = (ID, inputList) => {
    bills.map(bill => {
      if (bill.id === ID) {
        for (let i = 0; i < inputList.length; i++) {
          const input = inputList[i];         
          if ( input.classList.contains('EditTitle') ) {
            bill.title = input.value
          } else if ( input.classList.contains('EditName') ) {
            bill.name = input.value
          } else if ( input.classList.contains('EditFullPrize') ) {
            bill.fullPrize = englishTextTransformer(input.value)      
          }
        }
        setBills( prev => prev.filter( (bill) => bill.id === ID ? bill : prev ))
      }
    })
  }

  const addPaidAmount = (id , amount) => { 
    setBills( (prev) =>
      prev.map( (bill) => {
        if (bill.id === id) {
          return { ...bill , paidPrize : bill.paidPrize + amount }
        } else {
          return bill
        }                
      })
    )
  }

  const billFormVisibilityChanger = (boolean) => {
    setBillFormVisibility(boolean)
  }

  useEffect(() => {
    if (localStorage.getItem('BillList')) {
      setBills(JSON.parse(localStorage.getItem('BillList')))
    }
    fetch('https://notebill-backend.onrender.com/', { method : 'GET' })
      .then( result => console.log(result) )
  }, [])
  
  useEffect(() => {        
    if (bills) {
      localStorage.setItem('BillList', JSON.stringify(bills))
    }    
  }, [bills])


  return (
    <BillContextProvider value={{bills, addBill, removeBill, editBill, addPaidAmount, billFormVisibilityChanger}} >
      <div className="w-full min-h-screen bg-slate-100 py-12 flex flex-col items-center">
        <div className="bg-slate-100 md:px-12 pb-5 scroll0 flex gap-3 flex-wrap justify-center">
          {
            bills && bills.map((bill) => {
              return <BillCard title={bill.title} name={bill.name} key={bill.id} fullPrize={bill.fullPrize} paidPrize={bill.paidPrize} id={bill.id}/>
            })
          }
        </div>
        <div className="inline">
          <Button hoverBgColor="hover:bg-green-700" bgColor="bg-green-600" classNames='shadow-xl py-2 px-8 rounded-2xl font-bold text-xs sm:text-sm md:text-lg' value="اضافه کردن بدهی جدید" onClick={() => billFormVisibilityChanger(true)} />  
        </div>
      </div>
      <BillForm visibility={billFormVisibility}/>
    </BillContextProvider>
  )
}

export default App
