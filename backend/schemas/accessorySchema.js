import { z } from "zod";

const createAccessorySchema = z
  .object({
    name: z.string().trim().min(1, "Nome é obrigatório"),
    code: z.string().trim().min(1, "Código é obrigatório"),
    desc: z.string().trim().min(1, "Descrição é obrigatória"),
    observation: z.string().trim().nullable(),
    itens: z.array(
      z.object({
        amount: z.number().positive("Quantidade deve ser maior que zero"),
        unit: z.enum(["un", "cm", "m", "kit", "sv"], "Unidade inválida"),
        item: z.string().trim().min(1, "Item é obrigatório"),
      }),
    ),
    installationService: z.string().trim().min(1, "Serviço de instalação é obrigatório"),
    banner: z.string().trim().nullable(),
  })
  .strict();

const editAccessorySchema = createAccessorySchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: "Pelo menos um campo deve ser fornecido para atualização",
});

export { createAccessorySchema, editAccessorySchema };
