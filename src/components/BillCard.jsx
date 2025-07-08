import React, { useState } from 'react'
import { Button, Input } from './index'
import { useBillContext } from '../context/provider';

function BillCard({ title, name, fullPrice, paidPrice, id }) {

  const billContext = useBillContext()

  const [paymentDisplay, setPaymentDisplay] = useState('hidden')
  const [paymentOpacity, setPaymentOpacity] = useState('opacity-0')

  const [paymentMessage, setPaymentMessage] = useState('مبلغ پرداخت شده')
  const [editMessage, setEditMessage] = useState('مبلغ کل بدهی')

  const [paymentInputLabelColor, setPaymentInputLabelColor] = useState('text-gray-300');
  const [editInputLabelColor, setEditInputLabelColor] = useState('text-gray-300')

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
    setPaymentInputLabelColor('text-red-600 font-bold')
    if (type === Error) {
      setTimeout(() => {
        setPaymentInputLabelColor('text-red-600 font-bold animate-error')
      }, 1);
    }
  }

  function hidePaymentError() {
    setPaymentMessage('مبلغ پرداخت شده')
    setPaymentInputLabelColor('text-gray-300')
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
      <div className="bg-[#1f2333] rounded-2xl shadow-xl md:py-8 mx-4 md:m-0 py-4 px-6 relative flex flex-col justify-center items-center border border-[#2b305e]">
        <h2 className="font-bold text-lg sm:text-xl md:text-3xl text-white select-none">{title}</h2>
        <div className="mt-5 border-2 bg-[#24284a] md:text-lg text-sm rounded-xl text-center border-indigo-500 w-full text-gray-200 md:p-4 sm:px-5 py-2 flex justify-between select-text">
          <span className="sm:w-1/3 w-1/2 truncate">{name}</span>
          <span className="sm:w-1/3 hidden sm:inline-block text-gray-400 select-none">|</span>
          <span className="sm:w-1/3 w-1/2 truncate">{Number.parseInt(fullPrice).toLocaleString('fa-IR')}</span>
        </div>
        <div className="flex w-full justify-between sm:px-5 mt-6">
          <div className="text-center w-1/2 mx-2">
            <h3 className="md:text-[16px] sm:text-sm text-xs font-bold text-gray-300 select-none">مانده :</h3>
            <span className="mt-2 block text-xs sm:text-sm md:text-lg bg-red-800 bg-opacity-30 rounded-2xl sm:px-5 px-2 sm:py-7 py-2 text-center select-text text-gray-100">{(fullPrice - paidPrice).toLocaleString('fa-IR')}</span>
          </div>
          <div className="text-center w-1/2 mx-2">
            <h3 className="md:text-[16px] sm:text-sm text-xs font-bold text-gray-300 select-none">پرداخت شده :</h3>
            <span className="mt-2 block text-xs sm:text-sm md:text-lg bg-green-800 bg-opacity-30 rounded-2xl sm:px-5 px-2 sm:py-7 py-2 text-center select-text w text-gray-100">{paidPrice.toLocaleString('fa-IR')}</span>
          </div>
        </div>
        <Button onClick={() => showPayment()} bgColor={paidPrice === fullPrice ? 'bg-gray-700' : 'bg-[#c75e03]'} hoverBgColor={paidPrice === fullPrice ? 'hover:bg-gray-600' : 'hover:bg-[#9a4700]'} value="افزایش پرداخت شده" classNames="select-none rounded-lg sm:mt-10 mt-5 border border-transparent transition-all py-2 w-2/3 shadow-md hover:shadow-lg text-xs sm:text-lg text-white" />
        <Button onClick={() => showEdit()} value="📝" bgColor="bg-red-800 bg-opacity-20" hoverBgColor="hover:bg-red-700 hover:bg-opacity-30" classNames="absolute w-8 h-8 top-0 left-0 text-sm rounded-br-2xl rounded-tl-2xl p-1.5 text-white" />
        <span className={`${paymentDisplay} ${paymentOpacity} duration-200 absolute w-full h-full rounded-2xl bg-emerald-900 bg-opacity-20 z-10 top-0 flex flex-col items-center justify-center`} >
          <Button onClick={() => hidePayment()} value="❌" bgColor="bg-red-800 bg-opacity-20" hoverBgColor="hover:bg-red-700 hover:bg-opacity-30" classNames="absolute top-0 text-sm rounded-b-2xl p-1.5 w-1/2 text-white" />
          <Input label={paymentMessage} labelColor={paymentInputLabelColor} onInput={(state) => persianTextTransformer(state)} placeHolder="مبلغ" classNames="bg-[#475569] text-[#f0f5ff] placeholder:text-[#cbd5e1] p-2 rounded-lg text-center mt-5 outline-none w-3/4 border border-[#64748b] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400 shadow-inner duration-200" parentClassNames="flex w-full justify-center items-center flex-col" />
          <Button onClick={() => submitPayment(id, englishTextTransformer(input ? input.value : 0))} value="پرداخت" bgColor="bg-lime-600" hoverBgColor="hover:bg-lime-500" textColor="black" classNames="absolute bottom-5 sm:bottom-10 text-sm mt-10 font-bold rounded-2xl p-3 w-3/4" />
        </span>
        <form onSubmit={(e) => submitEdit(id, e)} className={`${editDisplay} ${editOpacity} duration-200 absolute w-full h-full rounded-2xl bg-[#1f2333cc] z-10 top-0 flex flex-col items-center justify-center`} >
          <span className="flex w-full sm:w-auto gap-2 sm:gap-5 px-4">
            <Input placeHolder="موضوع" value={titleState} type="text" onChange={(e) => setTitleState(e.currentTarget.value)} parentClassNames="text-center w-full flex flex-col items-center py-1 px-2" classNames="text-center bg-[#2a2f45] text-white shadow-inner outline-none w-full sm:w-5/6 py-2 mt-3 rounded-xl border border-[#3e4462] focus:ring-2 focus:ring-emerald-400" labelColor={editInputLabelColor} required />
            <Input placeHolder="نام" value={nameState} type="text" onChange={(e) => setNameState(e.currentTarget.value)} parentClassNames="text-center w-full flex flex-col items-center py-1 px-2" classNames="text-center bg-[#2a2f45] text-white shadow-inner outline-none w-full sm:w-5/6 py-2 mt-3 rounded-xl border border-[#3e4462] focus:ring-2 focus:ring-emerald-400" labelColor={editInputLabelColor} required />
          </span>
          <Input placeHolder="مبلغ" value={persianTextTransformerWithoutEvent(String(fullPriceState))} type="text" onInput={(e) => { setFullPriceState(e.currentTarget.value); setEditMessage('مبلغ کل بدهی'); setEditInputLabelColor('text-gray-300 md:text-lg lg:text-xl'); }} parentClassNames="text-center w-full flex flex-col items-center py-1 sm:py-5 px-2" classNames="text-center bg-[#2a2f45] text-white shadow-inner outline-none w-full sm:w-5/6 py-2 mt-3 rounded-xl border border-[#3e4462] focus:ring-2 focus:ring-emerald-400" labelColor={editInputLabelColor} label={editMessage} required />
          <Button type="submit" value="ذخیره" bgColor="bg-lime-600" hoverBgColor="hover:bg-lime-500" textColor="black" classNames="absolute bottom-2 sm:bottom-7 rounded-xl text-sm mt-10 font-bold p-2 sm:p-3 w-1/2 sm:w-3/4" />
          <Button onClick={() => hideEdit()} value="❌" bgColor="bg-red-800 bg-opacity-20" hoverBgColor="hover:bg-red-700 hover:bg-opacity-30" classNames="absolute top-0 text-sm rounded-b-2xl p-1.5 w-1/2 text-white" />
        </form>
        <Button value="✖" onClick={() => billContext.removeBill(id, title)} bgColor="bg-red-800 bg-opacity-20" hoverBgColor="hover:bg-red-700 hover:bg-opacity-30" classNames="absolute top-0 right-0 text-sm rounded-bl-2xl rounded-tr-2xl p-1.5 text-white w-8 h-8" />
      </div>
    </div>
  )
}

export default BillCard