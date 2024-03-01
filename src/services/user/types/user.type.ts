import { Rol } from '@/services/roles/types/Rol.types'
import { Sede } from '@/services/sedes/types/sede.types'

export type User = {
  id: string
  name: string
  lastName: string
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date
  image: string | null
  sede: Sede
  session: {
    id: string
    timesLoggedIn: number
    lastAccess: Date
    email: string
    password: string
    type: { id: number; name: string }
    rol: Rol
    status: { id: number; name: string }
  }
}
