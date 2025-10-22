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
    const sheetName = "TABELA-MYCHOICE";
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!workbook.Sheets[sheetName]) {
      return response.status(400).json({
        message: `Página "${sheetName}" não encontrada. Páginas encontradas: ${workbook.SheetNames.join(", ")}`,
      });
    }

    for (const row of worksheet) {
      if (!row.familyName) {
        return response.status(400).json({
          message: "Certifique-se de que familyName esteja preenchido em todas as linhas.",
        });
      }
    }

    for (const row of worksheet) {
      if (!row.familyQbmCode) {
        return response.status(400).json({
          message: "Certifique-se de que familyQbmCode esteja preenchido em todas as linhas.",
        });
      }
    }

    for (const row of worksheet) {
      if (!row.productName) {
        return response.status(400).json({
          message: "Certifique-se de que productName esteja preenchido em todas as linhas.",
        });
      }
    }

    for (const row of worksheet) {
      if (!row.productQbmCode) {
        return response.status(400).json({
          message: "Certifique-se de que productQbmCode esteja preenchido em todas as linhas.",
        });
      }
    }

    const familiesMap = worksheet.reduce((acc, row) => {
      if (!acc[row.familyName]) {
        acc[row.familyName] = {
          name: row.familyName,
          qbmCode: row.familyQbmCode,
          bannerLink: row.familyBannerLink,
          desc: row.familyDesc,
          observations: row.familyObservations,
          links: row.familyLinks
            ? row.familyLinks
                .split(";")
                .filter((curr) => curr.trim())
                .reduce((acc, curr) => {
                  const parts = curr.split(",");
                  if (parts.length === 2) {
                    const [title, url] = parts;
                    if (title && url) {
                      acc[title.trim()] = url.trim();
                    }
                  }
                  return acc;
                }, {})
            : {},
          canvaLink: row.familyCanvaLink,
          addInfoLink: row.familyAddInfoLink,
          products: [],
        };
      }

      const productDetails = {
        name: row.productName,
        qbmCode: row.productQbmCode,
        desc: row.productDesc,
        price: {
          withMembership: [
            row.productPriceWithMembership_adesao,
            row.productPriceWithMembership_12meses,
            row.productPriceWithMembership_24meses,
            row.productPriceWithMembership_36meses,
            row.productPriceWithMembership_48meses,
            row.productPriceWithMembership_60meses,
          ],
          noMembership: [
            row.productPriceNoMembership_12meses,
            row.productPriceNoMembership_24meses,
            row.productPriceNoMembership_36meses,
            row.productPriceNoMembership_48meses,
            row.productPriceNoMembership_60meses,
          ],
          renovation: [row.productPriceRenovation_12meses, row.productPriceRenovation_24meses, row.productPriceRenovation_36meses],
          closure: row.productPriceClosure,
        },
      };

      productDetails.tags = (productDetails.name || "").split(/\s+/).filter(Boolean);

      acc[row.familyName].products.push(productDetails);

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
