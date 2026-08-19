import { z } from "zod";

const createFamilyBomSchema = z
  .object({
    name: z.string("Nome precisa ser uma String").trim().min(1, "Nome é obrigatório"),
    code: z.string("Código precisa ser uma String").trim().min(1, "Código é obrigatório"),
    desc: z.string("Descrição precisa ser uma String").trim().min(1, "Descrição é obrigatória"),
    observation: z.string("Observação precisa ser uma String").trim().nullable(),
    itens: z.array(
      z.object({
        amount: z.number("Quantidade precisa ser um número").positive("Quantidade deve ser maior que zero").min(1, "Quantidade é obrigatória"),
        unit: z.enum(["un", "cm", "m", "kit", "sv"], "Unidade inválida"),
        item: z.string("Item precisa ser uma String").trim().min(1, "Item é obrigatório"),
      }),
    ),
    accessories: z.array(
      z.object({
        amount: z.number("Quantidade precisa ser um número").positive("Quantidade deve ser maior que zero").min(1, "Quantidade é obrigatória"),
        accessory: z.string("Acessório precisa ser uma String").trim().min(1, "Acessório é obrigatório"),
      }),
    ),
    device: z.string("Dispositivo precisa ser uma String").trim().min(1, "Dispositivo é obrigatório"),
    activationGuide: z.string("Guia de ativação precisa ser uma String").trim().nullable(),
    altDevice: z.string("Dispositivo alternativo precisa ser uma String").trim().nullable(),
    altActivationGuide: z.string("Guia de ativação alternativa precisa ser uma String").trim().nullable(),
    chip: z.string("Chip precisa ser uma String").trim().nullable(),
    riskFactor: z.number("Fator de risco precisa ser um número").nonnegative("Fator de risco não pode ser negativo"),
    commitment12Months: z.number("Adesão 12 meses precisa ser um número").nonnegative("A12 não pode ser negativo"),
    commitment24Months: z.number("Adesão 24 meses precisa ser um número").nonnegative("A24 não pode ser negativo"),
    commitment36Months: z.number("Adesão 36 meses precisa ser um número").nonnegative("A36 não pode ser negativo"),
    commitment48Months: z.number("Adesão 48 meses precisa ser um número").nonnegative("A48 não pode ser negativo"),
    commitment60Months: z.number("Adesão 60 meses precisa ser um número").nonnegative("A60 não pode ser negativo"),
    installationCost: z.number("Custo de instalação precisa ser um número").nonnegative("Custo de instalação não pode ser negativo"),
  })
  .strict();

const editFamilyBomSchema = createFamilyBomSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: "Pelo menos um campo deve ser fornecido para atualização",
});

export { createFamilyBomSchema, editFamilyBomSchema };
