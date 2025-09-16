import Family from "../models/familyModel.js";
import mongoose from "mongoose";
import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const findAll = async (request, response) => {
  try {
    const allFamilies = await Family.find({});
    return response.status(200).json(allFamilies);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: error.message });
  }
};

const findById = async (request, response) => {
  try {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "Mongo ID inválido" });
    }

    const family = await Family.findById(id);

    if (!family) {
      return response.status(404).json({ message: "Nenhuma família encontrada" });
    }

    return response.status(200).json(family);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: error.message });
  }
};

const deleteFamily = async (request, response) => {
  try {
    const { id } = request.params;
    const family = await Family.findByIdAndDelete(id);

    if (!family) {
      return response.status(404).json({ message: "Família não encontrada" });
    }
    return response.status(200).json({ message: `A família ${family.name.toLocaleUpperCase()} foi excluida com sucesso` });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: error.message });
  }
};

const uploadFamilies = async (request, response) => {
  const filePath = request.file.path;

  try {
    const fileExtension = path.extname(request.file.originalname);
    if (fileExtension !== ".xls" && fileExtension !== ".xlsx") {
      return response.status(400).json({ message: "Formato de arquivo inválido. Apenas arquivos xls ou xlsx são permitidos." });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = "CUSTO PRODUTOS (COMBO)"
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!workbook.Sheets[sheetName]) {
      return response.status(400).json({ 
        message: `Página "${sheetName}" não encontrada. Páginas encontradas: ${workbook.SheetNames.join(', ')}` 
      });
    }

    for (const row of worksheet) {
      if (!row["NOME DA FAMILIA"]) {
        return response.status(400).json({
          message: "Certifique-se de que NOME DA FAMILIA esteja preenchido em todas as linhas.",
        });
      }
    }

    for (const row of worksheet) {
      if (!row["CÓDIGO FAMÍLIA"]) {
        return response.status(400).json({
          message: "Certifique-se de que CÓDIGO FAMÍLIA esteja preenchido em todas as linhas.",
        });
      }
    }

    for (const row of worksheet) {
      if (!row["NOME DO PRODUTO"]) {
        return response.status(400).json({
          message: "Certifique-se de que NOME DO PRODUTO esteja preenchido em todas as linhas.",
        });
      }
    }

    for (const row of worksheet) {
      if (!row["CÓDIGO PRODUTO (COMBO)"]) {
        return response.status(400).json({
          message: "Certifique-se de que CÓDIGO PRODUTO (COMBO) esteja preenchido em todas as linhas.",
        });
      }
    }

    const familiesMap = worksheet.reduce((acc, row) => {
      if (!acc[row["NOME DA FAMILIA"]]) {
        acc[row["NOME DA FAMILIA"]] = {
          name: row["NOME DA FAMILIA"],
          qbmCode: row["CÓDIGO FAMÍLIA"],
          bannerLink: row["LINK DO BANNER"],
          desc: row["DESCRIÇÃO PRODUTO (COMBO)"],
          observations: row["OBSERVAÇÕES"],
          links: row["LINKS ÚTEIS"]
            ? row["LINKS ÚTEIS"].split(";").reduce((acc, curr) => {
                const [title, url] = curr.split(",");
                acc[title.trim()] = url.trim();
                return acc;
              }, {})
            : {},
          canvaLink: row["LINK O CANVA"],
          addInfoLink: row["LINK DA INFO ADICIONAL"],
          products: [],
        };
      }

      const productDetails = {
        name: row["NOME DO PRODUTO"],
        qbmCode: row["CÓDIGO PRODUTO (COMBO)"],
        desc: row["DESCRIÇÃO PRODUTO (COMBO)"],
        price: {
          withMembership: [
            row["ADESÃO"],
            row["12 MESES COM ADESÃO"],
            row["24 MESES COM ADESÃO"],
            row["36 MESES COM ADESÃO"],
          ],
          noMembership: [
            row["12 MESES SEM ADESÃO"],
            row["24 MESES SEM ADESÃO"],
            row["36 MESES SEM ADESÃO"],
            row["48 MESES SEM ADESÃO"],
            row["60 MESES SEM ADESÃO"],
          ],
          renovation: [row["RENOVAÇÃO 12 MESES"], row["RENOVAÇÃO 24 MESES"], row["RENOVAÇÃO 36 MESES"]],
          closure: row["FECHO"],
        },
      };

      productDetails.tags = (productDetails.name || "").split(/\s+/).filter(Boolean);

      acc[row["NOME DA FAMILIA"]].products.push(productDetails);

      return acc;
    }, {});

    for (const familyName in familiesMap) {
      const familyData = familiesMap[familyName];
      await Family.findOneAndUpdate({ name: familyName }, familyData, { upsert: true, new: true });
    }

    response.status(200).json({ message: `Sucesso ao fazer upload` });
  } catch (error) {
    console.error("Erro ao processar o arquivo Excel:", error);
    response.status(500).json({ message: "Erro ao processar o arquivo Excel" });
  } finally {
    fs.unlinkSync(filePath);
  }
};

export { findAll, findById, deleteFamily, uploadFamilies };
