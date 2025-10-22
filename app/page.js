"use client"
import Image from "next/image";
import React,{useContext} from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./components/Login";

export default function Home() {
  const{token}=useContext(AuthContext)
  if(!token){
    return <Login />
  }
  return (
    <div>
      
    </div>
  );
}
