export type TreatedArea = {
  id: string
  name: string
  packageAmount: number
  amountPackOfFour: number
  individualPrice: number
  monthlyPromotion: Array<{
    id: string
    startDate: Date
    endDate: Date
    packageAmount: number
    amountPackOfFour: number
    individualPrice: number
  }>
}

export type CreateTreatedAreaFormModel = {
  name: string
  packageAmount: number
  amountPackOfFour: number
  individualPrice: number
}

export type CreateTreatedAreaBody = {
  name: string
  packageAmount: number
  amountPackOfFour: number
  individualPrice: number
}
