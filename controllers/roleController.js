import {
  createRole,
  deleteRole,
  editRole,
  getAllRoles,
} from "../services/roleService.js";

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

const getAllRolesController = async (req, res) => {
  try {
    const roles = await getAllRoles();

    return res.status(200).json({
      success: true,
      message: "Roles fetched successfully",
      data: roles,
    });
  } catch (error) {
    console.log("Create role error:", error.message);

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
  const data = req.body

  try {

    const edited = await editRole(id,data);

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
export { createRoleController, getAllRolesController, deleteRoleController,editRoleController };
