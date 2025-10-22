"use client"
import Image from "next/image";
import React,{useState,useContext, useEffect} from "react";
import { AuthContext } from "./context/AuthContext";
import Mnemonic from "./components/Mnemonic";

export default function Home() {
  const{userData}=useContext(AuthContext)
  const[hasSeed,setHasSeed]=useState(false)
  useEffect(()=>{
    if(userData){
      setHasSeed(userData?.user?.hasSeed)
    }
  },[])
  return (
    <div>
      {!hasSeed&&<Mnemonic />}
    </div>
  );
}
