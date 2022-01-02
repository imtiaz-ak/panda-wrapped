import Head from 'next/head'
import Image from 'next/image'
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { useEffect } from 'react'
import axios from 'axios'

export default function Home() {
  const { data: session, status } = useSession()

  useEffect(async() => {
    if(status != 'loading' && session != undefined){
      const QUERY = 'from:(info@mail.foodpanda.com.bd)%20subject:(Your%20order%20has%20been%20placed)%20after:2021/01/01%20before:2021/12/31'
      const response = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${QUERY}`, {headers: {"Authorization": `Bearer ${session.accessToken}`}})
      let receiptData
      const receiptArray = await response.data.messages.map(async(item) => {
        receiptData = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}`, {headers: {"Authorization": `Bearer ${session.accessToken}`}})
        return (receiptData.data.payload.parts[1].body.data)
      })

      let statArray = []
      let arrLength = receiptArray.length
      for (let i=0; i < arrLength; i++){
        console.log(i)
        receiptArray[i] = await receiptArray[i]
        // console.log(receiptArray[i])
        // send receiptArray[i] to a func and populate the statArray with returned data
        let base64ToString = Buffer.from(receiptArray[i], "base64").toString();
        statArray.push(base64ToString)
      }
      console.log(statArray[0])
    }
    console.log(session)
  }, [status])

  if (status==='loading'){
    return (
      <div>Loading...</div>
    )
  }

  if (status!='loading' && session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        { session && session.accessToken }
      </>
    )
  }
  if (status!='loading' && !session){
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <h2>Not signed in </h2>
        <button onClick={() => signIn('google')}>Sign in</button>
      </div>
    )
  }
}
