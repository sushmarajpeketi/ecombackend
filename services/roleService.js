// services/roleService.js
import Role from "../models/RoleSchema.js";
import dayjs from "dayjs";

const createRole = async (data) => {
  const { name, description, permissions } = data;
  const createdRole = await Role.create({
    name,
    description,
    permissions,
   
  });
  return createdRole;
};
    
const createRoleN = async (data) => {
  const { name, description, modules } = data;
 
  const createdRole = await Role.create({
    name,
    description,
    modules ,
  })
   await createdRole.populate("modules")
 
 
  createdRole.modules.forEach((el)=>{
      return {[el.name]:[el.permissions],}
  })
  return createdRole;
};

const SORTABLE = new Set(["name", "description", "createdAt"]);

const getAllRoles = async () => {
  const roles = await Role.aggregate([
    {
      $match: {},
    },
    {
      $lookup: {
        from: "modules",
        localField: "modules",
        foreignField: "_id",
        as: "result",
      },
    },
    {
      $project: {
        "result.name": 1,
        "result.permissions": 1,
        name: 1,
        description: 1,
        isActive: 1,
        createdAt: 1,
        modules: 1,
      },
    },
  ]);
  console.log(roles)
};

const getRoles = async (query) => {
  const {
    page = 0,
    rows = 10,
    searchWord,
    from,
    to,
    module,
    operation,
    isActive,
    fetchTotal = "false",
    sort = "createdAt",
    order = "desc",
  } = query;

  const filter = {};

  const q = typeof searchWord === "string" ? searchWord.trim() : "";
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  if (isActive === "true" || isActive === "false") {
    filter.isActive = isActive === "true";
  }

  const created = {};
  if (from) created.$gte = dayjs(from).startOf("day").toDate();
  if (to) created.$lte = dayjs(to).endOf("day").toDate();
  if (created.$gte || created.$lte) filter.createdAt = created;

  if (module && operation) {
    filter[`permissions.${module}`] = { $in: [operation] };
  } else if (module) {
    filter[`permissions.${module}`] = { $exists: true };
  }

  const sortField = SORTABLE.has(sort) ? sort : "createdAt";
  const sortDir = order?.toLowerCase() === "asc" ? 1 : -1;

  const rolesRaw = await Role.find(filter, { __v: 0, updatedAt: 0 })
    .sort({ [sortField]: sortDir })
    .skip(Number(page) * Number(rows))
    .limit(Number(rows))
    .lean();

  const toPlainPermissions = (p) => {
    if (!p) return {};
    if (p instanceof Map) return Object.fromEntries(p);
    if (typeof p === "object") return p;
    return {};
  };

  const roles = rolesRaw.map((r) => ({
    id: r._id.toString(),
    name: r.name,
    description: r.description,
    permissions: toPlainPermissions(r.permissions),
    isActive: r.isActive,
    createdAt: r.createdAt,
  }));

  const total =
    fetchTotal === "true" ? await Role.countDocuments(filter) : undefined;

  return { roles, total };
};

const deleteRole = async (id) => {
  const deleted = await Role.findByIdAndDelete(id).lean();
  return deleted;
};

const editRole = async (id, data) => {
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

const createFallbackRole = async () => {
  const exists = await Role.findOne({ name: "user" });
  if (!exists) {
    await Role.create({
      name: "user",
      description: "Default fallback role",
      permissions: {
        users: ["read"],
        products: ["read"],
        dashboard: ["read"],
      },
      isActive: true,
    });
  }
};

const getModulesAndPermissions = async () => {
  return {
    modules: MODULES,
    permissions: OPERATIONS,
  };
};

const getRoleById = async (id) => {
  const r = await Role.findById(id, { __v: 0, updatedAt: 0 }).lean();
  if (!r) throw new Error("Role not found");

  const toPlainPermissions = (p) => {
    if (!p) return {};
    if (p instanceof Map) return Object.fromEntries(p);
    if (typeof p === "object") return p;
    return {};
  };

  return {
    id: r._id.toString(),
    name: r.name,
    description: r.description,
    permissions: toPlainPermissions(r.permissions),
    isActive: r.isActive,
    createdAt: r.createdAt,
  };
};

export {
  createRole,
  getRoles,
  getAllRoles,
  deleteRole,
  editRole,
  createFallbackRole,
  getModulesAndPermissions,
  getRoleById,
  createRoleN
};
