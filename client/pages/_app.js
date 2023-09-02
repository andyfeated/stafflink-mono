import '../styles/globals.css'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'



function MyApp({ Component, pageProps }) {
  const router = useRouter()
  
  useEffect(() => {
    const userJSON = localStorage.getItem('currentEmployee');
    const parsedUser = JSON.parse(userJSON);

    if (parsedUser) {
      router.push('/')
    } else {
      router.push('/login')
    }
  }, []);

  
  return <Component {...pageProps} />
}

export default MyApp
