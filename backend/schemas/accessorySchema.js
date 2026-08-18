import { z } from "zod";

const createAccessorySchema = z
  .object({
    name: z.string("Nome precisa ser uma String").trim().min(1, "Nome é obrigatório"),
    code: z.string("Código precisa ser uma String de números").trim().min(1, "Código é obrigatório").regex(/^\d+$/, "Código deve conter apenas números"),
    desc: z.string("Descrição precisa ser uma String").trim().min(1, "Descrição é obrigatória"),
    banner: z.string("Banner precisa ser uma String").trim().nullable(),
    observation: z.string("Observação precisa ser uma String").trim().nullable(),
    itens: z.array(
      z.object({
        amount: z.number("Quantidade precisa ser um número").positive("Quantidade deve ser maior que zero").min(1, "Quantidade é obrigatória"),
        unit: z.enum(["un", "cm", "m", "kit", "sv"], "Unidade inválida"),
        item: z.string("Item precisa ser uma String").trim().min(1, "Item é obrigatório"),
      }),
    ),
    installationCost: z.number("Custo de instalação precisa ser um número").positive("Custo de instalação deve ser maior que zero"),
  })
  .strict();

const editAccessorySchema = createAccessorySchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: "Pelo menos um campo deve ser fornecido para atualização",
});

export { createAccessorySchema, editAccessorySchema };
