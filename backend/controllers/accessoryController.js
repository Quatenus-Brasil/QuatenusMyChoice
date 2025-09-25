import Accessory from "../models/accessoryModel.js";
import XLSX from "xlsx";
import fs from "fs";
import path from "path";

const findAll = async (request, response) => {
  try {
    const accessories = await Accessory.find({});
    return response.status(200).json(accessories);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: error.message });
  }
};

const uploadAccessories = async (request, response) => {
  const filePath = request.file.path;

  try {
    const fileExtension = path.extname(request.file.originalname);
    if (fileExtension !== ".xls" && fileExtension !== ".xlsx") {
      return response.status(400).json({ message: "Formato de arquivo inválido. Apenas arquivos xls ou xlsx são permitidos." });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = "BOM ACESSÓRIOS";
    const rawWorksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!workbook.Sheets[sheetName]) {
      return response.status(400).json({
        message: `Página "${sheetName}" não encontrada. Páginas encontradas: ${workbook.SheetNames.join(", ")}`,
      });
    }

    const nonEmptyRows = rawWorksheet.filter((row) => {
      return row["SHORT-DESC"] || row["Descrição do produto"];
    });

    let lastAccessoryName = null;
    let lastDescription = null;

    const processedWorksheet = nonEmptyRows.map((row) => {
      if (row["SHORT-DESC"]) {
        lastAccessoryName = row["SHORT-DESC"];
      }

      if (row["Descrição do produto"]) {
        lastDescription = row["Descrição do produto"];
      }

      return {
        ...row,
        "SHORT-DESC": row["SHORT-DESC"] || lastAccessoryName,
        "Descrição do produto": row["Descrição do produto"] || lastDescription,
      };
    });

    for (const row of processedWorksheet) {
      if (!row["SHORT-DESC"]) {
        return response.status(400).json({
          message: "Certifique-se de que 'SHORT-DESC' esteja preenchido em todas as linhas.",
        });
      }

      if (!row["Descrição do produto"]) {
        return response.status(400).json({
          message: "Certifique-se de que 'Descrição do produto' esteja preenchido em todas as linhas.",
        });
      }
    }

    const accessoriesMap = processedWorksheet.reduce((acc, row) => {
      const accessoryName = row["SHORT-DESC"];

      if (!acc[accessoryName]) {
        acc[accessoryName] = {
          name: accessoryName,
          desc: row["Descrição do produto"],
        };
      }

      return acc;
    }, {});

    for (const accessoryName in accessoriesMap) {
      const accessoryData = accessoriesMap[accessoryName];
      await Accessory.findOneAndUpdate({ name: accessoryName }, accessoryData, { upsert: true, new: true });
    }

    response.status(200).json({ message: `Sucesso ao fazer upload dos acessórios.` });
  } catch (error) {
    console.error("Erro ao processar o arquivo Excel:", error);
    response.status(500).json({ message: "Erro ao processar o arquivo Excel dos acessórios." });
  } finally {
    fs.unlinkSync(filePath);
  }
};

export { findAll, uploadAccessories };
