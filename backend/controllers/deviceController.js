import Device from "../models/deviceModel.js";
import mongoose from "mongoose";

const createDevice = async (request, response) => {
  try {
    const newDevice = {
      name: request.body.name,
      code: request.body.code,
      desc: request.body.desc,
      basePrice: request.body.basePrice,
      itens: request.body.itens,
      banner: request.body.banner,
      createdBy: request.user._id,
      updatedBy: request.user._id,
    };

    const device = await Device.create(newDevice);

    await device.populate("itens.item");

    return response.status(201).json({ success: true, message: "Dispositivo criado com sucesso", result: device });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findAllDevices = async (request, response) => {
  try {
    // TODO: Lembrar de desativar o populate do findAll quando for fazer o front
    const allDevices = await Device.find({}).populate("itens.item");

    return response.status(200).json({ success: true, message: "Todos os dispositivos foram encontrados com sucesso", result: allDevices });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findDeviceById = async (request, response) => {
  try {
    const { id } = request.params;

    const device = await Device.findById(id).populate("itens.item").populate("createdBy", "name email").populate("updatedBy", "name email");
    if (!device) {
      return response.status(404).json({ success: false, message: "Nenhum dispositivo encontrado" });
    }

    return response.status(200).json({ success: true, message: "Dispositivo encontrado com sucesso", result: device });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const deleteDevice = async (request, response) => {
  try {
    const { id } = request.params;
    const device = await Device.findByIdAndDelete(id);

    if (!device) {
      return response.status(404).json({ success: false, message: "Dispositivo não encontrado" });
    }

    return response.status(200).json({ success: true, message: `O dispositivo "${device.name}" foi excluído com sucesso` });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const editDevice = async (request, response) => {
  try {
    const { id } = request.params;
    const device = request.body;

    const updateData = {
      ...device,
      updatedBy: request.user._id,
    };

    const updatedDevice = await Device.findByIdAndUpdate(id, updateData, { returnDocument: "after", runValidators: true })

    if (!updatedDevice) {
      return response.status(404).json({ success: false, message: "Dispositivo não encontrado" });
    }

    return response.status(200).json({ success: true, message: "Dispositivo editado", result: updatedDevice });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

export { createDevice, findAllDevices, findDeviceById, deleteDevice, editDevice };
