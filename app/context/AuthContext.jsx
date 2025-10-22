"use client"
import React,{useState, createContext, useEffect} from "react"

export const AuthContext=createContext();

const AuthProvider = ({children}) => {
    const[userData,setUserData]=useState(null);
    const[loading,setLoading]=useState(false)
    useEffect(()=>{
        const storedUserData=localStorage.getItem("userData");
        if(storedUserData){
            setUserData(storedUserData)
        }
    },[])
    const logout = () => {
      localStorage.removeItem('userData');
      if (userData) {
        localStorage.removeItem(`userData`);
      }
      setUserData(null);
    };
  return (
    <AuthContext.Provider value={{userData,setUserData,logout,loading,setLoading}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider