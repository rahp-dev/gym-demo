import React from 'react'
import { Button, Card } from '@/components/ui'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import NewPlansForm from './NewPlansForm'

const NewPlans = () => {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3>Crear Plan de Entrenamiento</h3>
        <Button
          size="sm"
          variant="solid"
          color="blue-500"
          onClick={() => navigate(-1)}
          icon={<HiArrowLeft />}
        >
          Regresar
        </Button>
      </div>

      <div className="flex justify-center">
        <Card className="w-full">
          <NewPlansForm />
        </Card>
      </div>
    </div>
  )
}

export default NewPlans
