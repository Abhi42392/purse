"use client"
import React,{useState, createContext, useEffect} from "react"

export const AuthContext=createContext();

const AuthProvider = ({children}) => {
    const[userData,setUserData]=useState(null);
    const[loading,setLoading]=useState(true)
    useEffect(()=>{
        setLoading(true)
        const storedUserData=localStorage.getItem("userData");
        if(storedUserData){
            setUserData(JSON.parse(storedUserData))
        }
        setLoading(false)
    },[])
    const logout = () => {
      localStorage.removeItem('userData');
      setUserData(null);
    };
  return (
    <AuthContext.Provider value={{userData,setUserData,logout,loading,setLoading}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider