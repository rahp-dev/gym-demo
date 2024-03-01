export type Customer = {
  id: string
  name: string
  lastName: string
  birthDate: string
  cedula: string
  phone: string
  skinType: string
  hairColor: string
  image: string

  createdAt: string
  updatedAt: string

  address: {
    street: string
    city: string
    state: string
    country: string
  }
  session: {
    id: string
    timesLoggedIn: number
    lastAccess: string
    email: string
    type: { id: number; name: string }
    rol: { id: number; name: string }
    status: { id: number; name: string }
  }
  sede: {
    id: number
    name: string
    image: string
    address: {
      street: string
      city: string
      state: string
      country: string
    }
  }
}

export type CreateCustomerBody = {
  name: string
  lastName: string
  sedeId: number
  email: string
  birthDate: Date | null
  cedula: string
  phones: Array<string>
  skinType: string
  hairColor: string
  address: {
    street: string
    city: string
    state: string
  }
  treatment: {
    treatedAreaId: number
    totalSessions: number
    amount: number
  }
}

export type CreateCustomerFormModel = {
  name: string
  lastName: string
  email: string
  height: string
  cedula: string
  phones: Array<string>
  weight: string
  street: string
  city: string
  state: string
}

export type CreatePlanFormModel = {
  selectTime: string
  planName: string
  selectExercise: string
}
