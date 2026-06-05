import Device from "../models/deviceModel.js";
import mongoose from "mongoose";
import fs from "fs";

const cleanupFiles = (files) => {
  if (!files) return;
  for (const fieldFiles of Object.values(files)) {
    for (const file of fieldFiles) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }
  }
};

const parseJsonField = (value) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
};

const createDevice = async (request, response) => {
  try {
    const newDevice = {
      name: request.body.name,
      code: request.body.code,
      numericCode: request.body.numericCode,
      desc: request.body.desc,
      basePrice: request.body.basePrice,
      itens: parseJsonField(request.body.itens),
      createdBy: request.user._id,
      createdByName: request.user.name,
      updatedBy: request.user._id,
      updatedByName: request.user.name,
    };

    if (request.files?.banner?.[0]) {
      newDevice.banner = request.files.banner[0].path;
    }

    const device = await Device.create(newDevice);

    await device.populate("itens.item");

    return response.status(201).json({ success: true, message: "Dispositivo criado com sucesso", result: device });
  } catch (error) {
    cleanupFiles(request.files);
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

    const device = await Device.findById(id).populate("itens.item");
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

    if (device.banner && fs.existsSync(device.banner)) {
      fs.unlinkSync(device.banner);
    }

    return response.status(200).json({ success: true, message: `O dispositivo "${device.name}" foi excluído com sucesso` });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const deleteDeviceImage = async (request, response) => {
  try {
    const { id } = request.params;

    const device = await Device.findById(id);
    if (!device) {
      return response.status(404).json({ success: false, message: "Dispositivo não encontrado" });
    }

    if (!device.banner) {
      return response.status(404).json({ success: false, message: "Este dispositivo não possui banner" });
    }

    if (fs.existsSync(device.banner)) {
      fs.unlinkSync(device.banner);
    }

    await Device.findByIdAndUpdate(id, { banner: null });

    return response.status(200).json({ success: true, message: "Banner do dispositivo removido com sucesso" });
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
      updatedByName: request.user.name,
    };

    if (device.itens !== undefined) {
      updateData.itens = parseJsonField(device.itens);
    }

    if (request.files?.banner?.[0]) {
      const existing = await Device.findById(id);
      if (existing?.banner && fs.existsSync(existing.banner)) {
        fs.unlinkSync(existing.banner);
      }
      updateData.banner = request.files.banner[0].path;
    }

    const updatedDevice = await Device.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate("itens.item");

    if (!updatedDevice) {
      return response.status(404).json({ success: false, message: "Dispositivo não encontrado" });
    }

    return response.status(200).json({ success: true, message: "Dispositivo editado", result: updatedDevice });
  } catch (error) {
    cleanupFiles(request.files);
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

export { createDevice, findAllDevices, findDeviceById, deleteDevice, editDevice, deleteDeviceImage };
