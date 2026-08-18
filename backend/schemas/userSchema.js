import { z } from "zod";

const createUserSchema = z
  .object({
    active: z.boolean("Ativo deve ser verdadeiro ou falso"),
    name: z.string("Nome precisa ser uma String").trim().min(1, "Nome é obrigatório"),
    email: z.string("Email precisa ser uma String").trim().email("Email inválido"),
    password: z.string("Senha precisa ser uma String").trim().min(6, "Senha deve ter no mínimo 6 caracteres"),
    sector: z.string("Setor precisa ser uma String").trim().min(1, "Setor é obrigatório"),
    admin: z.boolean("Admin deve ser verdadeiro ou falso"),
    manager: z.boolean("Gestão deve ser verdadeiro ou falso"),
  })
  .strict(); 

const editUserSchema = createUserSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: "Pelo menos um campo deve ser fornecido para atualização",
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string("Senha atual precisa ser uma String").trim().min(6, "Senha atual deve ter no mínimo 6 caracteres"),
    newPassword: z.string("Nova senha precisa ser uma String").trim().min(6, "Nova senha deve ter no mínimo 6 caracteres"),
  })
  .strict();

export { createUserSchema, editUserSchema, changePasswordSchema };