import Family from "../models/familyModel.js";
import mongoose from "mongoose";
import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const downloadFamilies = async (request, response) => {
  try {
    const families = await Family.find({});

    // Transformando os dados para o formato que será exportado
    const data = families.flatMap((family) =>
      family.products.map((product) => {
        const priceWithMembership = product.price?.withMembership || [];
        const priceNoMembership = product.price?.noMembership || [];
        const priceRenovation = product.price?.renovation || [];

        return {
          familyName: family.name,
          familyQbmCode: family.qbmCode,
          familyDesc: family.desc,
          familyObservations: family.observations,
          familyBannerLink: family.bannerLink,
          familyCanvaLink: family.canvaLink,
          familyAddInfoLink: family.addInfoLink,
          familyLinks: family.links
            ? Object.entries(family.links)
                .map(([linkTitle, linkUrl]) => `${linkTitle}, ${linkUrl}`)
                .join("; ")
            : "",
          productName: product.name,
          productQbmCode: product.qbmCode,
          productDesc: product.desc,
          productTelemetryDigital: product.telemetry?.digital || "",
          productTelemetryAnalog: product.telemetry?.analog || "",
          productPriceWithMembership_adesao: priceWithMembership[0] || "",
          productPriceWithMembership_12meses: priceWithMembership[1] || "",
          productPriceWithMembership_24meses: priceWithMembership[2] || "",
          productPriceWithMembership_36meses: priceWithMembership[3] || "",
          productPriceNoMembership_12meses: priceNoMembership[0] || "",
          productPriceNoMembership_24meses: priceNoMembership[1] || "",
          productPriceNoMembership_36meses: priceNoMembership[2] || "",
          productPriceNoMembership_48meses: priceNoMembership[3] || "",
          productPriceNoMembership_60meses: priceNoMembership[4] || "",
          productPriceRenovation_12meses: priceRenovation[0] || "",
          productPriceRenovation_24meses: priceRenovation[1] || "",
          productPriceRenovation_36meses: priceRenovation[2] || "",
          productPriceClosure: product.price?.closure || "",
        };
      })
    );

    // Criando uma nova planilha Excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Families");

    // Definindo o caminho para salvar o arquivo temporário
    const filePath = path.join(__dirname, "mychoice.xlsx");
    XLSX.writeFile(workbook, filePath);

    // Enviando o arquivo como resposta
    response.download(filePath, "mychoice.xlsx", (error) => {
      if (error) {
        console.error("Erro ao fazer o download do arquivo:", error);
      }
      fs.unlinkSync(filePath); // Remove o arquivo temporário após o download
    });
  } catch (error) {
    console.error("Erro ao gerar o arquivo Excel:", error);
    response.status(500).json({ message: "Erro ao gerar o arquivo Excel" });
  }
};

const uploadFamilies = async (request, response) => {
  const filePath = request.file.path;

  try {
    // Verificar a extensão do arquivo
    const fileExtension = path.extname(request.file.originalname);
    if (fileExtension !== ".xls" && fileExtension !== ".xlsx") {
      return response.status(400).json({ message: "Formato de arquivo inválido. Apenas arquivos xls ou xlsx são permitidos." });
    }

    // Lendo o arquivo Excel
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Verificar se todos os campos obrigatórios estão presentes
    for (const row of worksheet) {
      if (!row.familyName || !row.familyQbmCode || !row.familyDesc) {
        return response.status(400).json({
          message: "Certifique-se de que familyName, familyQbmCode e familyDesc estejam presentes em todas as linhas.",
        });
      }
    }

    // Agrupando as linhas pelo familyName
    const familiesMap = worksheet.reduce((acc, row) => {
      if (!acc[row.familyName]) {
        acc[row.familyName] = {
          name: row.familyName,
          qbmCode: row.familyQbmCode,
          bannerLink: row.familyBannerLink,
          desc: row.familyDesc,
          observations: row.familyObservations,
          links: row.familyLinks
            ? row.familyLinks.split(";").reduce((acc, curr) => {
                const [title, url] = curr.split(",");
                acc[title.trim()] = url.trim();
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

      // Adiciona o campo telemetry apenas se houver dados
      if (row.productTelemetryDigital || row.productTelemetryAnalog) {
        productDetails.telemetry = {
          digital: row.productTelemetryDigital || "",
          analog: row.productTelemetryAnalog || "",
        };
      }

      acc[row.familyName].products.push(productDetails);

      return acc;
    }, {});

    // Iterando sobre as famílias agrupadas e criando ou atualizando os documentos no MongoDB
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

export { findAll, findById, deleteFamily, downloadFamilies, uploadFamilies };
