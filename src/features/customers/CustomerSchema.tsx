// CustomerSchema.ts
import { z } from 'zod';

// Definisikan skema validasi menggunakan Zod
const customerSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string()
    .optional() // Mengizinkan field ini untuk tidak ada
    .nullable() // Mengizinkan field ini untuk bernilai null
    .refine(value => !value || z.string().email().safeParse(value).success, {
      message: "Invalid email format",
    }), // Memvalidasi email jika tidak kosong
  phone: z.string()
    .regex(/^0[0-9]*$/, "Nomor Handphone hanya boleh angka dan dimulai dari angka 0")
    .optional() // Mengizinkan field ini untuk tidak ada
    .nullable() // Mengizinkan field ini untuk bernilai null
    .or(z.literal('')), // Mengizinkan field ini untuk bernilai string kosong
  
  created_by: z.string().optional(),

  updated_by: z.string().optional(),

  is_activated: z.boolean().optional() // Mengizinkan field ini untuk tidak ada
  .nullable() // Mengizinkan field ini untuk bernilai null
  .or(z.literal('')), // Mengizinkan field ini untuk bernilai string kosong

  created_at: z.string()
    .optional()
    .refine((value) => {
      // Memeriksa apakah value sesuai dengan format tanggal YYYY-MM-DD
      return !value || /^\d{4}-\d{2}-\d{2}$/.test(value);
    }, {
      message: "Invalid date format. Expected format: YYYY-MM-DD",
    }),
  updated_at: z.string().optional(),
});


// Tipe data untuk form
type CustomerFormData = z.infer<typeof customerSchema>;

export { customerSchema, CustomerFormData };