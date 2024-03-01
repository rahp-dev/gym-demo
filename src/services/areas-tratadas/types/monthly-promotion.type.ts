export type MonthlyPromotion = {
  id: string
  startDate: Date
  endDate: Date
  packageAmount: number
  amountPackOfFour: number
  individualPrice: number

  treatedArea: { id: string; name: string }
}

export type CreateMonthlyPromotionFormModel = {
  packageAmount: number
  amountPackOfFour: number
  individualPrice: number
}

export type CreateMonthlyPromotionBody = {
  packageAmount: number
  individualPrice: number
  amountPackOfFour: number
  treatedAreaId: number
}
