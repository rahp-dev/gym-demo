import { DepilatoryMachine } from '@/services/deplilatory-machines/types/depilatory-machines.type'
import { CustomerPayment } from './customer-payment.type'
import { Sede } from '@/services/sedes/types/sede.types'

export type Treatment = {
  id: number
  datetime: Date
  treatedArea: string
  session: string
  invoiceNumber: string
  amount: number
  balanceDue: number
  isComplete: boolean
  machineInitialCounter: string
  machineFinalCounter: string

  sede: Sede

  specialist: { id: string; name: string; lastName: string }

  customer: { id: string; name: string; lastName: string }

  depilatory_machine: DepilatoryMachine

  payments: Array<CustomerPayment>
}

export type CreateTreatmentFormModel = {
  datetime: Date
  treatedArea: string
  session: string
  invoiceNumber: string
  amount: number
  specialistId: number
  depilatoryMachineId: number
  sedeId: number
}

export type CreateTreatmentBody = {
  datetime: Date
  treatedArea: string
  session: string
  invoiceNumber: string
  amount: number
  specialistId: number
  depilatoryMachineId: number
  customerId: string
  sedeId: number
}
