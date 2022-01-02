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
      <div className="flex flex-col justify-center items-center w-screen h-screen">
        <p>Welcome to Panda Wrapped</p>
        <p>The unofficial tool to get your foodpanda wrapped for the year 2021</p>
        <p>Disclaimer: PandaWrapped has no affiliation with foodpanda. It is a 3rd party tool that uses the foodpanda receipts in your email inbox to create your foodpanda wrapped.</p>
        <p>In order to get your foodpanda wrapped, you need to verify your gmail address used by your foodpanda account.</p>
        <button onClick={() => signIn('google')}>Sign in</button>
      </div>
    )
  }
}
