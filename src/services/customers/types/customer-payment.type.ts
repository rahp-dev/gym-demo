import { Sede } from '@/services/sedes/types/sede.types'

export type CustomerPayment = {
  id: string
  amount: number
  description: string
  dateOfPayment: Date
  updatedAt: Date

  sede: Sede

  paymentMethod: { id: number; name: string }

  userReceiver: { id: string; name: string; lastName: string }

  treatment: { id: string }

  customer: { id: string; name: string; lastName: string }
}

export type CreateCustomerPaymentBody = {
  treatmentId: string
  amount: number
  description: string
  dateOfPayment: Date
  sedeId: number
  paymentMethodId: number
  userReceiverId: number
}

export type CreateCustomerPaymentFormModel = {
  amount: number
  description: string
  sedeId: number
  userReceiverId: number
  dateOfPayment: Date
  paymentMethodId: number
}
