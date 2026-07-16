import { z } from "zod";

const createItemSchema = z
  .object({
    name: z.string().trim().min(1, "Nome é obrigatório"),
    code: z.string().trim().min(1, "Código Star é obrigatório"),
    desc: z.string().trim().optional(),
    price: z.number().positive("Preço deve ser maior que zero"),
  })
  .strict(); 

const editItemSchema = createItemSchema.partial();

export { createItemSchema, editItemSchema };