import Device from "../models/deviceModel.js";
import Accessory from "../models/accessoryModel.js";

const findAllImages = async (request, response) => {
  try {
    const [devices, accessories] = await Promise.all([
      Device.find({ image: { $ne: null } }, "_id name code image"),
      Accessory.find({ image: { $ne: null } }, "_id name code image"),
    ]);

    const baseUrl = `${request.protocol}://${request.get("host")}`;

    const result = {
      devices: devices.map((d) => ({
        _id: d._id,
        name: d.name,
        code: d.code,
        imageUrl: `${baseUrl}/${d.image.replace(/\\/g, "/")}`,
      })),
      accessories: accessories.map((a) => ({
        _id: a._id,
        name: a.name,
        code: a.code,
        imageUrl: `${baseUrl}/${a.image.replace(/\\/g, "/")}`,
      })),
    };

    return response.status(200).json({ success: true, message: "Imagens encontradas com sucesso", result });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

export { findAllImages };
