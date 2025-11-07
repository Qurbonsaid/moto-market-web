import { z } from "zod";

export const productSchema = z.object({
  nomi: z.string().trim().min(1, "Mahsulot nomi kiritilishi shart"),
  model: z.string().trim().min(1, "Model kiritilishi shart"),
  miqdor: z.number().int().min(0, "Miqdor 0 dan kichik bo'lmasligi kerak"),
  kirimNarxi: z.number().min(0, "Kirim narxi 0 dan kichik bo'lmasligi kerak"),
  sotishNarxi: z.number().min(0, "Sotish narxi 0 dan kichik bo'lmasligi kerak"),
});

export const sellerSchema = z.object({
  ism: z.string().trim().min(1, "Ism kiritilishi shart"),
  telefon: z.string().optional(),
});

export const saleSchema = z.object({
  mahsulotId: z.string().min(1, "Mahsulot tanlanishi shart"),
  miqdor: z.number().int().min(1, "Miqdor 1 dan kichik bo'lmasligi kerak"),
  narx: z.number().min(0, "Narx 0 dan kichik bo'lmasligi kerak"),
  sotuvchi: z.string().min(1, "Sotuvchi tanlanishi shart"),
  mijoz: z.string().optional(),
});

export const expenseSchema = z.object({
  sana: z.string().min(1, "Sana kiritilishi shart"),
  tavsif: z.string().trim().min(1, "Tavsif kiritilishi shart"),
  summa: z.number().min(0, "Summa 0 dan kichik bo'lmasligi kerak"),
  kategoriya: z.string().optional(),
});

export const incomingStockSchema = z.object({
  sana: z.string().min(1, "Sana kiritilishi shart"),
  mahsulotId: z.string().min(1, "Mahsulot tanlanishi shart"),
  miqdor: z.number().int().min(1, "Miqdor 1 dan kichik bo'lmasligi kerak"),
  kirimNarxi: z.number().min(0, "Kirim narxi 0 dan kichik bo'lmasligi kerak"),
  izoh: z.string().optional(),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Joriy parol kiritilishi shart"),
  newPassword: z.string().min(4, "Yangi parol kamida 4 ta belgidan iborat bo'lishi kerak"),
  confirmPassword: z.string().min(1, "Parolni tasdiqlang"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Parollar mos kelmadi",
  path: ["confirmPassword"],
});

export type ProductFormData = z.infer<typeof productSchema>;
export type SellerFormData = z.infer<typeof sellerSchema>;
export type SaleFormData = z.infer<typeof saleSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type IncomingStockFormData = z.infer<typeof incomingStockSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
