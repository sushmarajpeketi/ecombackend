import { createModule,getModuleKeys, deleteModule, getDynamicModules, getModule, getModules ,getModulesNames, updateModule} from "../services/moduleServices.js";


export const createModuleController = async (req, res) => {
  try {
    const createdRole = await createModule(req.body);

    return res.status(201).json({
      success: true,
      message: "Module created successfully",
      data: createdRole,
    });
  } catch (error) {
    console.log("Create role error:", error.message);

    return res.status(400).json({ error: error.message });
  }
};

export const getModulesController = async(req,res)=>{
  try {
    const fetchedModules = await getModules();

    return res.status(201).json({
      success: true,
      message: "All modules fetched successfully",
      data: fetchedModules,
    });
  } catch (error) {
    console.log("fetch modules error:", error.message);

    return res.status(400).json({ error: error.message });
  }
}
export const getModuleController = async(req,res)=>{
  console.log(req.params)
  const {id} = req.params
  try {
    const fetchedModule = await getModule(id);

    return res.status(201).json({
      success: true,
      message: "Module fetched successfully",
      data: fetchedModule,
    });
  } catch (error) {
    console.log("fetch module error:", error.message);

    return res.status(400).json({ error: error.message });
  }
}

export const getModulesNamesController = async(req,res)=>{
    try {
    const fetchedModulesNames = await getModulesNames ();

    return res.status(201).json({
      success: true,
      message: "All modules fetched successfully",
      data: fetchedModulesNames,
    });
  } catch (error) {
    console.log("fetch modules-names error:", error.message);

    return res.status(400).json({ error: error.message });
  }
}


export const updateModuleController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await updateModule(id, updateData);
    return res.status(200).json({
      success: true,
      message: "Module updated successfully",
      data: updated,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
export const getAllModulesController = async (req, res) => {
  try {
    const query = req.query;
    const {  total,modules } = await getDynamicModules(query);
    return res.status(200).json({
      success: true,
      total,
      page: parseInt(req.query.page) || 0,
      rows: parseInt(req.query.rows) || 10,
      data: modules,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteModuleController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteModule(id);
    return res.status(200).json({
      success: true,
      message: "Module deleted successfully",
      data: deleted,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
//   try {
//     const fetchedModules = await getModules(req.body);

//     return res.status(201).json({
//       success: true,
//       message: "All modules fetched successfully",
//       data: fetchedModules,
//     });
//   } catch (error) {
//     console.log("fetch modules error:", error.message);

//     return res.status(400).json({ error: error.message });
//   }
// }
 