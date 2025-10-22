"use client"
import React,{useState, createContext, useEffect} from "react"

export const AuthContext=createContext();
const AuthProvider = ({children}) => {
    const[token,setToken]=useState("");
    useEffect(()=>{
        const storedToken=localStorage.getItem("token");
        if(storedToken){
            setToken(storedToken)
        }
    },[])
  return (
    <AuthContext.Provider value={{token,setToken}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider