import { z } from "zod";

const createUserSchema = z
  .object({
    active: z.boolean("Ativo deve ser verdadeiro ou falso"),
    name: z.string().trim().min(1, "Nome é obrigatório"),
    email: z.string().trim().email("Email inválido"),
    password: z.string().trim().min(6, "Senha deve ter no mínimo 6 caracteres"),
    sector: z.string().trim().min(1, "Setor é obrigatório"),
    admin: z.boolean("Admin deve ser verdadeiro ou falso"),
    manager: z.boolean("Gestão deve ser verdadeiro ou falso"),
  })
  .strict(); 

const editUserSchema = createUserSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: "Pelo menos um campo deve ser fornecido para atualização",
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string("Senha atual é obrigatória"),
    newPassword: z.string().trim().min(6, "Nova senha deve ter no mínimo 6 caracteres"),
  })
  .strict();

export { createUserSchema, editUserSchema, changePasswordSchema };