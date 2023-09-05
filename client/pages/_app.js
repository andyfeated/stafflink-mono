import '../styles/globals.css'
import { useEffect } from 'react';
import { useRouter } from 'next/router'
import useUserStore from '../stores/userStore';



function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const setUser = useUserStore((state) => state.setUser)
  const id = useUserStore((state) => state.id)
  
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
  
  return <Component {...pageProps} />
}

export default MyApp
