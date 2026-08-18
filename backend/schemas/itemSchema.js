import { z } from "zod";

const createItemSchema = z
  .object({
    name: z.string("Nome precisa ser uma String").trim().min(1, "Nome é obrigatório"),
    code: z.string("Código precisa ser uma String").trim().min(1, "Código Star é obrigatório"),
    desc: z.string("Descrição precisa ser uma String").trim().min(1, "Descrição é obrigatória"),
    price: z.number("Preço precisa ser um número").positive("Preço deve ser maior que zero"),
  })
  .strict(); 

const editItemSchema = createItemSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: "Pelo menos um campo deve ser fornecido para atualização",
});

export { createItemSchema, editItemSchema };