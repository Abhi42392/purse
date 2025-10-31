"use client"
import React, { useContext } from 'react'
import AuthProvider, { AuthContext } from './context/AuthContext'
import Login from './components/Login'
import Loading from './components/Loading'
import { Mnemonic } from 'ethers'
function AuthWrapper({children}){
    const{userData,loading}=useContext(AuthContext)
    if(loading){
        return <Loading />
    }
    if(!userData){
        return <Login />
    }
    if(!userData.hasSeed){
        return <Mnemonic />
    }
    return children;
}
const ChildLayout = ({children}) => {
  return (
    <AuthProvider>
        <AuthWrapper>
            {children}
        </AuthWrapper>
    </AuthProvider>
  )
}

export default ChildLayout