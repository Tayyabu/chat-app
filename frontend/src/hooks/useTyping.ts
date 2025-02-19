import { useEffect, useState } from "react"

export  function useTyping(time:number) {

    const [isTyping,setIsTying] = useState(false)
 
    useEffect(()=>{

        const timeOut = setTimeout(()=>{
          setIsTying(false)
        },time)
        
        
        return ()=>{
          clearTimeout(timeOut)
        }
        
        },[isTyping,time])
        
        
    
    
    return [isTyping,setIsTying] as [typeof isTyping,typeof setIsTying]
}
