import { z } from "zod";

const createChipSchema = z
  .object({
    name: z.string().trim().min(1, "Nome é obrigatório"),
    code: z.string().trim().min(1, "Código é obrigatório"),
    desc: z.string().trim().optional(),
    price: z.number().positive("Preço deve ser maior que zero"),
  })
  .strict(); 

const editChipSchema = createChipSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: "Pelo menos um campo deve ser fornecido para atualização",
});

export { createChipSchema, editChipSchema };