import { createLazyFileRoute } from '@tanstack/react-router'
import CustomerEdit from '@/features/customers/CustomerEdit'

export const Route = createLazyFileRoute('/_authenticated/customers/$id/edit')({
  component: CustomerEdit,
})
