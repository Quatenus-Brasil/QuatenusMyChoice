import { z } from "zod";

const createGamaSchema = z
  .object({
    name: z.string().trim().min(1, "Nome é obrigatório"),
    code: z.string().trim().min(1, "Código é obrigatório"),
    desc: z.string().trim().min(1, "Descrição é obrigatória"),
  })
  .strict();

const editGamaSchema = createGamaSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: "Pelo menos um campo deve ser fornecido para atualização",
});

export { createGamaSchema, editGamaSchema };
