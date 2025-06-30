import { useId } from "react"

function Input({ label, labelColor = 'text-white' , type = 'text', classNames = '', placeHolder = 'Input', parentClassNames = '', onInput, ...props}) {

  const id = useId()
  
  return (
    <div className={`${parentClassNames}`}>
      <label className={`${labelColor} font-bold`} htmlFor={id}>{label}</label>
      <input onInput={onInput} {...props} id={id} className={classNames} placeholder={placeHolder} type={type}/>
    </div>
  )
}

export default Input