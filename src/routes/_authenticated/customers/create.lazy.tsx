import { createLazyFileRoute } from '@tanstack/react-router'
import CustomerCreate from '@/features/customers/CustomerCreate'

export const Route = createLazyFileRoute('/_authenticated/customers/create')({
  component: CustomerCreate,
})
