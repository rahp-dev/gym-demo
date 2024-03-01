import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { HiArrowLeft, HiOutlineUser } from 'react-icons/hi'

import { Button, Card, Skeleton } from '@/components/ui'
import Tabs from '@/components/ui/Tabs'
import { useGetAreaTratadaByIdQuery } from '@/services/RtkQueryService'
import Tab1 from './tab1/Tab1'
import Tab2 from './tab2/Tab2'
import {
  CreateTreatedAreaFormModel,
  TreatedArea,
} from '@/services/areas-tratadas/types/areas-tratadas.type'
import { CreateMonthlyPromotionFormModel } from '@/services/areas-tratadas/types/monthly-promotion.type'

const { TabNav, TabList, TabContent } = Tabs

export default function AreaDetail() {
  const { areaId } = useParams()
  const navigate = useNavigate()
  const [isEditingFields, setIsEditingFields] = useState(false)
  const [editingInitialValues, setEditingInitialValues] =
    useState<CreateTreatedAreaFormModel>({
      name: '',
      packageAmount: 0,
      amountPackOfFour: 0,
      individualPrice: 0,
    })
  const [monthlyPromotionData, setMonthlyPromotionData] = useState<
    CreateMonthlyPromotionFormModel & { id: number }
  >({
    id: 0,
    individualPrice: 0,
    amountPackOfFour: 0,
    packageAmount: 0,
  })

  const { data, isFetching } = useGetAreaTratadaByIdQuery(areaId, {
    refetchOnMountOrArgChange: true,
  })

  const handleToggleEditing = () => {
    setIsEditingFields((prevIsEditingFields) => !prevIsEditingFields)
  }

  const getLabelIsInPromotion = (data: TreatedArea) => {
    const [monthlyPromotion] = data.monthlyPromotion

    if (!monthlyPromotion) {
      return ''
    }

    return '(En Promoción)'
  }

  const getpackageAmount = () => {
    const [monthlyPromotion] = data.monthlyPromotion

    if (!monthlyPromotion) {
      return data.packageAmount
    }

    return monthlyPromotion.packageAmount
  }

  const getAmountPackOfFour = () => {
    const [monthlyPromotion] = data.monthlyPromotion

    if (!monthlyPromotion) {
      return data.amountPackOfFour
    }

    return monthlyPromotion.amountPackOfFour
  }

  const getIndividualPrice = () => {
    const [monthlyPromotion] = data.monthlyPromotion

    if (!monthlyPromotion) {
      return data.individualPrice
    }

    return monthlyPromotion.individualPrice
  }

  useEffect(() => {
    if (data && !isFetching) {
      setEditingInitialValues({
        name: data.name,
        packageAmount: data.packageAmount,
        amountPackOfFour: data.amountPackOfFour,
        individualPrice: data.individualPrice,
      })

      const [monthlyPromotion] = data.monthlyPromotion

      setMonthlyPromotionData({
        id: Number(monthlyPromotion?.id) || 0,
        individualPrice: monthlyPromotion?.individualPrice || 0,
        amountPackOfFour: monthlyPromotion?.amountPackOfFour || 0,
        packageAmount: monthlyPromotion?.packageAmount || 0,
      })
    } else {
      setEditingInitialValues({
        name: '',
        packageAmount: 0,
        amountPackOfFour: 0,
        individualPrice: 0,
      })
    }
  }, [data, isFetching])

  const cardFooter = (
    <div>
      <Button
        block
        variant="solid"
        color="pink-500"
        icon={<FaEdit />}
        onClick={() => handleToggleEditing()}
      >
        Editar
      </Button>
    </div>
  )

  return (
    <div>
      <div className="flex justify-between items-center justify between mb-4">
        <h3>Detalles Área Tratada</h3>
        <Button
          size="sm"
          variant="solid"
          color="pink-500"
          onClick={() => navigate(-1)}
          icon={<HiArrowLeft />}
        >
          Regresar
        </Button>
      </div>

      <div className="container mx-auto h-full">
        <div className="flex flex-col xl:flex-row gap-4">
          <Card className="xl:w-[400px] xl:h-[120%]" footer={cardFooter}>
            <div className="flex flex-col xl:justify-between h-full mx-auto">
              <div className="flex flex-col items-center mb-6">
                {isFetching ? (
                  <Skeleton className="mt-2" width={200} height={15} />
                ) : (
                  <h4 className="font-bold flex text-center">
                    {data?.name} <br /> {getLabelIsInPromotion(data)}
                  </h4>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-8">
                <div className="flex flex-col">
                  <span className="font-semibold dark:text-white/80">
                    Nombre del Área Tratada:
                  </span>
                  {isFetching ? (
                    <Skeleton width={200} height={18} />
                  ) : (
                    <span className="text-gray-700 font-semibold dark:text-white/80">
                      {data?.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold dark:text-white/80">
                    Precio del paquete:
                  </span>
                  {isFetching ? (
                    <Skeleton width={200} height={18} />
                  ) : (
                    <span className="text-gray-700 font-semibold dark:text-white/80">
                      {getpackageAmount() || 'N/A'}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold dark:text-white/80">
                    Precio de 4 Sesiones:
                  </span>
                  {isFetching ? (
                    <Skeleton width={200} height={18} />
                  ) : (
                    <span className="text-gray-700 font-semibold dark:text-white/80">
                      {getAmountPackOfFour() || 'N/A'}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold dark:text-white/80">
                    Precio del Individual:
                  </span>
                  {isFetching ? (
                    <Skeleton width={200} height={18} />
                  ) : (
                    <span className="text-gray-700 font-semibold dark:text-white/80">
                      {getIndividualPrice() || 'N/A'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="w-full">
            <Tabs defaultValue="tab1">
              <TabList>
                <TabNav value="tab1" icon={<HiOutlineUser />}>
                  Área Tratada
                </TabNav>
                <TabNav value="tab2" icon={<HiOutlineUser />}>
                  Promocion Del Mes
                </TabNav>
              </TabList>
              <div className="p-4">
                <TabContent value="tab1">
                  <Tab1
                    areaId={areaId}
                    isEditingFields={isEditingFields}
                    initialValues={editingInitialValues}
                    setIsEditingFields={setIsEditingFields}
                  />
                </TabContent>
                <TabContent value="tab2">
                  <Tab2
                    areaId={areaId}
                    isEditingFields={isEditingFields}
                    data={monthlyPromotionData}
                    setIsEditingFields={setIsEditingFields}
                  />
                </TabContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}
