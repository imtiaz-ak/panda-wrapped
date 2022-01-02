import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { useEffect } from 'react'
import axios from 'axios'

export default function Home() {
  const { data: session, status } = useSession()

  useEffect(async() => {
    if(status != 'loading' && session != undefined){
      const response = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages`, {headers: {"Authorization": `Bearer ${session.accessToken}`}})
      // const response = fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', { 
      //   method: 'get', 
      //   headers: new Headers({
      //       'Authorization': 'Bearer '+session.accessToken, 
      //       'Content-Type': 'application/x-www-form-urlencoded'
      //   }), 
    // });
      console.log(response)
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
      <>
        Not signed in <br />
        <button onClick={() => signIn('google')}>Sign in</button>
      </>
    )
  }
}
