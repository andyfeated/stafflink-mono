import { create } from 'zustand'

const useUserStore = create((set) => ({
  id: null,
  name: '',
  email: '',
  role: '',
  companyId: null,
  setUser: (values) => set(() => {
    return { name: values.name, email: values.email, id: values.id, role: values.role, companyId: values.companyId }
  }),
}))

export default useUserStore