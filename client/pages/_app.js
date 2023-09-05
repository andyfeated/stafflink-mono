import '../styles/globals.css'
import { useEffect } from 'react';
import { useRouter } from 'next/router'
import useUserStore from '../stores/userStore';
import Head from 'next/head'


function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const setUser = useUserStore((state) => state.setUser)
  
  useEffect(() => {
    const userJSON = localStorage.getItem('currentEmployee');
    const parsedUser = JSON.parse(userJSON);

    if (parsedUser) {
      setUser({ name: parsedUser.name, email: parsedUser.email, id: parsedUser.id, role: parsedUser.role, companyId: parsedUser.companyId })
      router.push(router.asPath)
    } else {
      router.push('/login')
    }
  }, []);
  
  return (
    <>
      <Head>
        <title>Stafflink</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
