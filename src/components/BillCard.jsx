import React, { useState } from 'react'
import { Button, Input } from './index'
import { useBillContext } from '../context/provider';

function BillCard({ title, name, fullPrice, paidPrice, id }) {

  const billContext = useBillContext()

  const [paymentDisplay, setPaymentDisplay] = useState('hidden')
  const [paymentOpacity, setPaymentOpacity] = useState('opacity-0')

  const [paymentMessage, setPaymentMessage] = useState('مبلغ پرداخت شده')
  const [editMessage, setEditMessage] = useState('مبلغ کل بدهی')

  const [paymentInputLabelColor, setPaymentInputLabelColor] = useState('text-black')
  const [editInputLabelColor, setEditInputLabelColor] = useState('text-gray-700 md:text-lg lg:text-xl')

  const [editDisplay, setEditDisplay] = useState('hidden')
  const [editOpacity, setEditOpacity] = useState('opacity-0')

  const [input, setInput] = useState()
  

  const [nameState, setNameState] = useState(name)
  const [titleState, setTitleState] = useState(title)
  const [fullPriceState, setFullPriceState] = useState(fullPrice)
  
  
  // Text Transformers

  const englishTextTransformer = (str) => {
    if (!str) return 0;
  
    const clean = str.replace(/[,٬\s]/g, "");
  
    const english = clean.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  
    return Number(english);
  }

  const persianTextTransformer = (e) => {
    let raw = e.currentTarget.value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
    
    raw = raw.replace(/[^0-9]/g, "");
  
    if (raw !== "") {
      const formatted = Number(raw).toLocaleString("fa-IR");
      e.currentTarget.value = formatted;
    } else {
      e.currentTarget.value = "";
    }        
    hidePaymentError()

    setInput(e.currentTarget)    
  }

  const persianTextTransformerWithoutEvent = (value) => {
    
    let raw = value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
    
    raw = raw.replace(/[^0-9]/g, "");
    const formatted = Number(raw).toLocaleString("fa-IR");
    value = formatted;    

    
    return value
  }

  // Visibility

  function hidePayment() {
    setPaymentOpacity('opacity-0');
    setTimeout(() => { 
      setPaymentDisplay('hidden') 
      hidePaymentError()
      if (input) {
        input.value = ''
      }
    }, 200)
  }
  function showPayment() {
    if (paidPrice == fullPrice) return 
      setPaymentDisplay('flex'); 
      setTimeout(() => { 
        setPaymentOpacity('opacity-100') 
      }, 100)
  }

  function hideEdit() {
    setEditOpacity('opacity-0');
    setTimeout(() => { 
      setEditDisplay('hidden') 
    }, 200)
  }
  function showEdit() {
    setEditDisplay('flex'); 
    setTimeout(() => { 
      setEditOpacity('opacity-100') 
    }, 100)
  } 

  // Errors

  function showPaymentError(message, type = true) {
    setPaymentMessage(message ? message : 'رقم وارد شده اشتباه است' ) 
    setPaymentInputLabelColor('text-red-600')
    if (type === Error) {
      setTimeout(() => {
        setPaymentInputLabelColor('text-red-600 animate-error')
      }, 1);
    }
  }

  function hidePaymentError() {
    setPaymentMessage('مبلغ پرداخت شده')
    setPaymentInputLabelColor('text-black')
  }

  // Submitting

  function submitPayment(Id, Amount) {    
    if (Amount > 0) {
      if (Amount + paidPrice <= fullPrice) {
        billContext.addPaidAmount(Id, Amount)
        input.value = ''
        hidePayment()
      } else showPaymentError('مبلغ وارد شده بیش از مبلغ کل است', Error)
    } else showPaymentError('لطفا مبلغی را وارد کنید', Error)
  }

  function submitEdit(id, e) {    
    e.preventDefault()
    if (englishTextTransformer(e.currentTarget.querySelectorAll('input')[2].value) <= paidPrice) {
      setEditInputLabelColor('text-red-600 md:text-lg lg:text-xl')
      setTimeout(() => {
        setEditInputLabelColor('text-red-600 md:text-lg lg:text-xl animate-error')
      }, 1);
      setEditMessage('مبلغ وارد شده اشتباه است')
      return
    }
    setEditMessage('مبلغ کل بدهی')
    billContext.editBill(id, e.currentTarget.querySelectorAll('input'))
    
    hideEdit()
  }

  // Card Structure

  return (
    <div className="min-w-xs sm:min-w-sm lg:mx-5 mb-8">
      <div className="bg-white rounded-2xl shadow-xl md:py-8 mx-4 md:m-0 py-4 px-4 relative flex flex-col justify-center items-center">
        <h2 className="font-bold text-lg sm:text-xl md:text-3xl duration-200">{title}</h2>
        <div className="mt-5 border-2 bg-white md:text-lg text-sm rounded-xl text-center border-indigo-500 w-full text-[#111827] md:p-4 sm:px-5 py-2 flex justify-between">
          <span className="sm:w-1/3 w-1/2 duration-200">{name}</span>
          <span className="sm:w-1/3 hidden sm:inline-block duration-200 select-none">|</span>
          <span className="sm:w-1/3 w-1/2 duration-200">{Number.parseInt(fullPrice).toLocaleString('fa-IR')}</span>
        </div>
        <div className="flex w-full justify-between sm:px-5 mt-6">
          <div className="text-center w-1/2 mx-2">
            <h3 className="md:text-[16px] sm:text-sm text-xs font-bold duration-200 select-none">مانده :</h3>
            <span className="mt-2 block text-[#991B1B] text-xs sm:text-sm md:text-lg bg-red-300 rounded-2xl sm:px-5 px-1 sm:py-7 py-2 duration-200 text-center">{(fullPrice - paidPrice).toLocaleString('fa-IR')}</span>
          </div>
          <div className="text-center w-1/2 mx-2">
            <h3 className="md:text-[16px] sm:text-sm text-xs font-bold duration-200 text-nowrap select-none">پرداخت شده :</h3>
            <span className="mt-2 block text-[#065F46] text-xs sm:text-sm md:text-lg bg-green-200 rounded-2xl sm:px-5 px-1 sm:py-7 py-2 duration-200 text-center">{paidPrice.toLocaleString('fa-IR')}</span>
          </div>
        </div>
        <Button onClick={() => showPayment() } bgColor ={paidPrice == fullPrice ? 'bg-gray-300' : 'bg-orange-400'} hoverBgColor ={paidPrice == fullPrice ? 'hover:bg-gray-400' : 'hover:bg-orange-500'} value='افزایش پرداخت شده' classNames="select-none rounded-lg sm:mt-10 mt-5 border transition-all py-2 w-2/3 shadow-md hover:shadow-lg text-xs sm:text-lg"/>
        <Button onClick={() => showEdit() } value='📝' bgColor='bg-red-100' hoverBgColor='hover:bg-red-300' classNames="absolute top-0 left-0 text-sm rounded-br-2xl rounded-tl-2xl p-1.5"/>
        <span className={`${paymentDisplay} ${paymentOpacity} duration-200 absolute w-full h-full rounded-2xl bg-emerald-100 z-10 top-0 flex-col items-center justify-center`}>
          <Button onClick={() => hidePayment() } value='❌' bgColor='bg-red-100' hoverBgColor='hover:bg-red-300' classNames='absolute top-0 text-sm rounded-b-2xl p-1.5 w-1/2'/>
          <Input label={paymentMessage} labelColor={`${paymentInputLabelColor}`} onInput={(state) => persianTextTransformer(state)} placeHolder='مبلغ' classNames='bg-white p-2 rounded-lg text-center mt-5 outline-none w-3/4' parentClassNames={'flex w-full justify-center items-center flex-col'}/>
          <Button onClick={() => submitPayment(id, englishTextTransformer(input ? input.value : 0))} value='پرداخت' bgColor='bg-lime-400' hoverBgColor='hover:bg-lime-500' textColor='black' classNames='absolute bottom-5 sm:bottom-10 text-sm mt-10 font-bold rounded-2xl p-3 w-3/4'/>
        </span>
        <form onSubmit={(e) => submitEdit(id, e)} className={`${editDisplay} ${editOpacity} duration-200 absolute w-full h-full rounded-2xl bg-emerald-100 z-10 top-0 flex-col items-center justify-center`}>
          <span className='flex'>
            <Input placeHolder='موضوع' value={titleState} type='text' onChange={ (e) => { setTitleState(e.currentTarget.value) }} parentClassNames='text-center w-full flex flex-col items-center py-1 px-2' classNames='text-center bg-white shadow-inner outline-none w-full sm:w-5/6 py-2 mt-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 EditTitle' labelColor='text-gray-700 md:text-lg lg:text-xl' required />
            <Input placeHolder='نام' value={nameState} type='text' onChange={ (e) => { setNameState(e.currentTarget.value) }} parentClassNames='text-center w-full flex flex-col items-center py-1 px-2' classNames='text-center bg-white shadow-inner outline-none w-full sm:w-5/6 py-2 mt-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 EditName' labelColor='text-gray-700 md:text-lg lg:text-xl' required />            
          </span>
          <Input placeHolder='مبلغ' value={persianTextTransformerWithoutEvent(String(fullPriceState))} type='text' onInput={(e) => {setFullPriceState(e.currentTarget.value); setEditMessage('مبلغ کل بدهی'); setEditInputLabelColor('text-gray-700 md:text-lg lg:text-xl')}} parentClassNames='text-center w-full flex flex-col items-center py-1 sm:py-5 px-2' classNames='text-center bg-white shadow-inner outline-none w-full sm:w-5/6 py-2 mt-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400' labelColor={editInputLabelColor} label={editMessage} required />
          <Button type='submit' value='ذخیره' bgColor='bg-lime-400' hoverBgColor='hover:bg-lime-500' textColor='black' classNames='absolute bottom-2 sm:bottom-7 rounded-xl text-sm mt-10 font-bold p-2 sm:p-3 w-1/2 sm:w-3/4'/>
          <Button onClick={() => hideEdit() } value='❌' bgColor='bg-red-100' hoverBgColor='hover:bg-red-300' classNames='absolute top-0 text-sm rounded-b-2xl p-1.5 w-1/2'/>
        </form>
        <Button value='❌' onClick={() => billContext.removeBill(id, title) } bgColor='bg-red-100' hoverBgColor='hover:bg-red-300' classNames='absolute top-0 right-0 text-sm rounded-bl-2xl rounded-tr-2xl p-1.5'/>
      </div>
      
    </div>
  )
}

export default BillCard