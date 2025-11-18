import {
  createRole,
  deleteRole,
  editRole,
  getRoles,
  getAllRoles,
  getModulesAndPermissions,
  getRoleById,
  createRoleN,
} from "../services/roleService.js";

const getAllRolesController = async (req, res) => {
  try {
    const roles = await getAllRoles();
    return res.status(200).json({
      success: true,
      message: "Roles fetched successfully",
      data: roles,
    });
  } catch (error) {
    console.log("Get roles error:", error.message);
    return res.status(400).json({ error: error.message });
  }
};
const getRoleByIdController = async (req, res) => {
  try {
    const role = await getRoleById(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Role fetched successfully",
      data: role,
    });
  } catch (error) {
    console.log("Get role error:", error.message);
    return res.status(400).json({ error: error.message });
  }
};
const createRoleController = async (req, res) => {
  try {
    const createdRole = await createRole(req.body);

    return res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: createdRole,
    });
  } catch (error) {
    console.log("Create role error:", error.message);

    return res.status(400).json({ error: error.message });
  }
};
const createRoleNController = async (req, res) => {
  try {
    const createdRole = await createRoleN(req.body);

    return res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: createdRole,
    });
  } catch (error) {
    console.log("Create role error:", error.message);

    return res.status(400).json({ error: error.message });
  }
};

const getRolesController = async (req, res) => {
  try {
    const { roles, total } = await getRoles(req.query);
    return res.status(200).json({
      success: true,
      message: "Roles fetched successfully",
      data: roles,
      ...(total !== undefined ? { total } : {}),
    });
  } catch (error) {
    console.log("Get roles error:", error.message);
    return res.status(400).json({ error: error.message });
  }
};

const deleteRoleController = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await deleteRole(id);

    return res.status(200).json({
      success: true,
      message: "Role deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.log("delete role error:", error.message);

    return res.status(400).json({ error: error.message });
  }
};
const editRoleController = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  console.log("data is ", data);
  try {
    const edited = await editRole(id, data);

    return res.status(200).json({
      success: true,
      message: "Role edited successfully",
      data: edited,
    });
  } catch (error) {
    console.log("edit role error:", error.message);

    return res.status(400).json({ error: error.message });
  }
};

const getModulesAndPermissionsController = async (req, res) => {
  try {
    const { modules, permissions } = await getModulesAndPermissions();

    return res.status(200).json({
      success: true,
      message: "Modules & permissions fetched successfully",
      data: { modules, permissions },
    });
  } catch (error) {
    console.log("fetch roles and permissions error:", error.message);
    return res.status(400).json({ error: error.message });
  }
};
export {
  createRoleController,
  createRoleNController,
  getRolesController,
  getAllRolesController,
  deleteRoleController,
  editRoleController,
  getModulesAndPermissionsController,
  getRoleByIdController,
};
