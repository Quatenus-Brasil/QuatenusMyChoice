import axios from "axios";

const ENTITY_FOLDERS = {
  device: "devices",
  accessory: "accessories",
};

const signUpload = async (entity) => {
  const folder = ENTITY_FOLDERS[entity];

  if (!folder) {
    throw new Error(`Entidade inválida: ${entity}`);
  }

  const response = await axios.post(
    `${process.env.OPENINARY_URL}/api/upload/sign`,
    { folder, expiresIn: 300 },
    { headers: { Authorization: `Bearer ${process.env.OPENINARY_API_KEY}` } },
  );

  return response.data;
};

const deleteImage = async (bannerPath) => {
  try {
    await axios.delete(`${process.env.OPENINARY_URL}/api/storage/${bannerPath}`, {
      headers: { Authorization: `Bearer ${process.env.OPENINARY_API_KEY}` },
    });
  } catch (error) {
    console.log(`Falha ao deletar imagem ${bannerPath} do Openinary: ${error.message}`);
  }
};

export { signUpload, deleteImage, ENTITY_FOLDERS };
