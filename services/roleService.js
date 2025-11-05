import Role from "../models/RoleSchema.js";

const createRole = async (data) => {
  const { name, description, permissions } = data;
  const createdRole = await Role.create({
    name,
    description,
    permissions,
  });
  return createdRole;
};

const getAllRoles = async () => {
  const roles = await Role.find(
    {},
    { _id: 1, name: 1, description: 1, permissions: 1 }
  ).lean();

  const formattedRoles = roles.map((r) => ({
    id: r._id.toString(),
    name: r.name,
    description: r.description,
    permissions: r.permissions,
  }));

  return formattedRoles;
};

const deleteRole = async (id) => {
  const deleted = await Role.findByIdAndDelete(id);

  return deleted;
};

const editRole = async (id, data) => {
    console.log(data)
  const updates = {};

  if (data.name !== undefined) updates.name = data.name;
  if (data.description !== undefined) updates.description = data.description;
  if (data.isActive !== undefined) updates.isActive = data.isActive;
  if (data.permissions !== undefined) updates.permissions = data.permissions;

  const updated = await Role.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updated) throw new Error("Role not found");

  return updated;
};

export { createRole, getAllRoles, deleteRole ,editRole};
