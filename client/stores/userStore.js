import { create } from 'zustand'

const useUserStore = create((set) => ({
  name: '',
  email: '',
  setUser: (values) => set(() => {
    return { name: values.name, email: values.email }
  }),
}))

export default useUserStore