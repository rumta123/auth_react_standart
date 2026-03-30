import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length ? value : undefined))
  .optional();

export const loginSchema = z.object({
  email: z.string().trim().email("Некорректный формат email"),
  password: z.string().min(1, "Введите пароль"),
});

export const registerSchema = z.object({
  email: z.string().trim().email("Некорректный формат email"),
  password: z.string().min(6, "Минимум 6 символов"),
  first_name: optionalText,
  middle_name: optionalText,
  last_name: optionalText,
  phone: optionalText.refine(
    (value) => !value || /^\+\d{10,15}$/.test(value),
    "Укажите в формате +79991234567",
  ),
  birth_date: optionalText.refine(
    (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value),
    "Дата в формате YYYY-MM-DD",
  ),
  role: z.enum(["user", "manager", "admin"]).default("user"),
  status: z.boolean().default(true),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;