'use client'
import { User } from 'lucide-react'
import { useEffect, useState } from 'react'
import datatableConfig from './config'
import DynamicMaster from '@/components/data-table'
import { form_config } from './currentFormConfig'
interface User {
  id: number
  firstName: string
  lastName: string
  age: number
  gender: string
  email: string
  phone: string
  username: string
  birthDate: string
  image: string
  bloodGroup: string
  height: number
  weight: number
  eyeColor: string
  hair: {
    color: string
    type: string
  }
  address: {
    address: string
    city: string
    state: string
    stateCode: string
    postalCode: string
    country: string
  }
  university: string
  company: {
    department: string
    name: string
    title: string
  }
  role: string
}

interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

export default function DataTableDemo() {
  const [currentFormConfig, setCurrentFormConfig] = useState(form_config)

  return (
    <div className="p-5">
      <DynamicMaster
        datatableConfig={datatableConfig}
        data={datatableConfig.data}
        formConfig={currentFormConfig}
        onFormConfigChange={setCurrentFormConfig}
      />
    </div>
  )
}
