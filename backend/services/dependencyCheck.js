import Accessory from "../models/accessoryModel.js";
import Device from "../models/deviceModel.js";
import FamilyBom from "../models/familyBomModel.js";

const findDependents = async (configs, targetId) => {
  const results = await Promise.all(
    configs.map(async ({ model, field, buildQuery, type, projection = "name" }) => {
      const filter = buildQuery ? buildQuery(targetId) : { [field]: targetId };
      const docs = await model.find(filter).select(projection).lean();
      return docs.map((d) => ({ id: d._id, name: d.name, type }));
    }),
  );
  return results.flat();
};

const findItemDependents = async (itemId) => {
  return findDependents(
    [
      { model: Accessory, field: "itens.item", type: "Acessório" },
      { model: Device, field: "itens.item", type: "Dispositivo" },
      { model: FamilyBom, field: "itens.item", type: "BOM da Família" },
    ],
    itemId,
  );
};

const findAccessoryDependents = async (accessoryId) => {
  return findDependents([{ model: FamilyBom, field: "accessories.accessory", type: "BOM da Família" }], accessoryId);
};

const findDeviceDependents = async (deviceId) => {
  return findDependents(
    [
      {
        model: FamilyBom,
        buildQuery: (id) => ({ $or: [{ device: id }, { altDevice: id }] }),
        type: "BOM da Família",
      },
    ],
    deviceId,
  );
};

export { findDependents, findItemDependents, findAccessoryDependents, findDeviceDependents };
