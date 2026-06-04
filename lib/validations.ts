import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  phone: z.string().optional(),
  role: z.enum(["LANDLORD", "TENANT"]),
})

export const propertySchema = z.object({
  title: z.string().min(10, "El título debe tener al menos 10 caracteres").max(80),
  description: z.string().min(30, "La descripción debe tener al menos 30 caracteres").max(600),
  type: z.enum(["HABITACION", "DEPARTAMENTO", "CASA", "OFICINA", "LOCAL"]),
  condition: z.enum(["SIN_MUEBLES", "SEMI_AMOBLADO", "AMOBLADO"]),
  district: z.string().min(1, "Selecciona un distrito"),
  address: z.string().optional(),
  area: z.number().min(10).optional(),
  rooms: z.number().min(1).default(1),
  bathrooms: z.number().min(1).default(1),
  parking: z.number().min(0).default(0),
  price: z.number().min(100, "El precio mínimo es S/ 100"),
  deposit: z.number().min(0).default(1),
  minDuration: z.number().min(1).default(12),
  availableFrom: z.coerce.date().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  tenantProfile: z.array(z.string()).optional(),
  conditions: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
})

export const contractSchema = z.object({
  propertyId: z.string(),
  tenantId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  monthlyRent: z.number().min(0),
  deposit: z.number().min(0),
  terms: z.string().optional(),
})

export const paymentSchema = z.object({
  contractId: z.string(),
  amount: z.number().min(0),
  dueDate: z.date(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
})
