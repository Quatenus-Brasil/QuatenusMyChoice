import { z } from "zod";

const createProductInstallationCategorySchema = z
  .object({
    name: z.string().trim().min(1, "Nome é obrigatório"),
    code: z.string().trim().min(1, "Código é obrigatório"),
    price: z.number().positive("Preço deve ser maior que zero"),
  })
  .strict();

const editProductInstallationCategorySchema = createProductInstallationCategorySchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: "Pelo menos um campo deve ser fornecido para atualização",
});

export { createProductInstallationCategorySchema, editProductInstallationCategorySchema };
