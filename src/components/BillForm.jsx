import { useEffect, useState } from 'react'
import { Button, Input } from './index'
import { useBillContext } from '../context/provider'

function BillForm({ visibility }) {

    const billContext = useBillContext()
    
    const [ billFormOpacity, setBillFormOpacity ] = useState('opacity-0')
    const [ billFormDisplay, setBillFormDisplay ] = useState('hidden')

    const parsePersianNumber = (str) => {
        if (!str) return 0;
      
        const clean = str.replace(/[,٬\s]/g, "");
      
        const english = clean.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
      
        return Number(english);
    }

    const textTransformer = (e) => {
        let raw = e.target.value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
      
        raw = raw.replace(/[^0-9]/g, "");
      
        if (raw !== "") {
          const formatted = Number(raw).toLocaleString("fa-IR");
          e.target.value = formatted;
        } else {
          e.target.value = "";
        }        
    }


    const handleSubmit = (e) => {
        e.preventDefault()    
        
        e.target[2].value = parsePersianNumber(e.target[2].value)

        billContext.addBill({ title : e.target[0].value, name : e.target[1].value, fullPrice :  e.target[2].value, paidPrice : 0 })

        e.target[0].value = ''
        e.target[1].value = ''
        e.target[2].value = ''

        billContext.billFormVisibilityChanger(false)
        // document.body.classList.remove('overflow-hidden')
        // setBillFormOpacity('opacity-0')
        // setTimeout(() => {
        //     setBillFormDisplay('hidden')
        // }, 200);
    }


    useEffect(() => {
        if (visibility) {
            document.body.classList.add('overflow-hidden')
            window.scroll(0, 0)

            setBillFormDisplay('flex')
            setTimeout(() => {
                setBillFormOpacity('opacity-100')
            }, 200);
        } else {
            document.body.classList.remove('overflow-hidden')

            setBillFormOpacity('opacity-0')
            setTimeout(() => {
                setBillFormDisplay('hidden')
            }, 200);
        }        
    }, [visibility])

  return (
    <div className={`absolute z-20 top-0 w-screen h-screen bg-black/50 backdrop-blur-sm justify-center items-center duration-200 ${billFormDisplay} ${billFormOpacity}`}>
        <Button onClick={() => billContext.billFormVisibilityChanger(false)} classNames='absolute top-5 sm:top-10 md:top-15 rounded-lg w-1/2 md:text-lg text-white' bgColor='bg-red-500' hoverBgColor='hover:bg-red-600' value='بستن'/>
        <form onSubmit={(e) => handleSubmit(e)} className='w-5/6 sm:w-4/6 h-2/3 max-w-xl md:max-h-1/2 sm:min-h-[450px] bg-[#f0f4f9] text-gray-800 rounded-2xl shadow-2xl flex justify-between py-5 flex-col items-center'>
            <div className='flex items-center gap-2 sm:gap-5 flex-col w-full h-4/5'>
                <Input placeHolder='موضوع' type='text' parentClassNames='text-center w-full flex flex-col items-center py-3 px-2' classNames='text-center bg-white shadow-inner outline-none w-full sm:w-5/6 py-2 mt-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400' labelColor='text-gray-700 md:text-lg lg:text-xl' label='موضوع بدهی' required />
                <Input placeHolder='نام' type='text' parentClassNames='text-center w-full flex flex-col items-center py-3 px-2' classNames='text-center bg-white shadow-inner outline-none w-full sm:w-5/6 py-2 mt-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400' labelColor='text-gray-700 md:text-lg lg:text-xl' label='نام بستانکار' required />
                <Input placeHolder='مبلغ' type='text' onInput={(e) => textTransformer(e)} parentClassNames='text-center w-full flex flex-col items-center py-3 px-2' classNames='text-center bg-white shadow-inner outline-none w-full sm:w-5/6 py-2 mt-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400' labelColor='text-gray-700 md:text-lg lg:text-xl' label='مبلغ کل بدهی' required />
            </div>
            <Button type='submit' bgColor='bg-emerald-500' hoverBgColor='hover:bg-emerald-600' textColor='text-white' classNames='rounded-xl w-2/3 py-2' value='اضافه کردن' />
        </form>
    </div>
  )
}

export default BillForm