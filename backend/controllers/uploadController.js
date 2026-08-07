import { signUpload as signUploadService, ENTITY_FOLDERS } from "../services/openinaryService.js";

const signUpload = async (request, response) => {
  try {
    const { entity } = request.body;

    if (!entity || !ENTITY_FOLDERS[entity]) {
      return response.status(400).json({
        success: false,
        message: `Entidade inválida: ${entity}`,
      });
    }

    const signed = await signUploadService(entity);

    return response.status(200).json({ success: true, result: signed });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

export { signUpload };
