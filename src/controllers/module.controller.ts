import { Request, Response } from "express";
import { Module } from "../models/Module.model";
import { ModuleTopic } from "../models/ModuleTopic.model";

/* ---------- PUBLIC: Get modules with topics ---------- */
export const getModules = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let modules = await Module.findAll({
      where: { 
        domainId, 
        courseId, 
        isActive: true 
      },
      include: [{
        model: ModuleTopic,
        where: { isActive: true },
        required: false,
        order: [['order', 'ASC']]
      }],
      order: [['order', 'ASC']],
    });

    // Fallback to domain level
    if (!modules.length && courseId > 0) {
      modules = await Module.findAll({
        where: { 
          domainId, 
          courseId: 0, 
          isActive: true 
        },
        include: [{
          model: ModuleTopic,
          where: { isActive: true },
          required: false,
          order: [['order', 'ASC']]
        }],
        order: [['order', 'ASC']],
      });
    }

    res.json(modules);
  } catch (error: any) {
    console.error("MODULE FETCH ERROR:", error);
    res.status(500).json({ 
      message: "Failed to fetch modules", 
      error: error.message 
    });
  }
};

/* ---------- ADMIN: Get ALL modules (including inactive) ---------- */
export const getAllModulesForAdmin = async (req: Request, res: Response) => {
  try {
    const modules = await Module.findAll({
      include: [{
        model: ModuleTopic,
        required: false,
        order: [['order', 'ASC']]
      }],
      order: [
     
        ['id', 'ASC']
      ],
    });
    
    res.json(modules);
  } catch (error: any) {
    console.error("Error fetching all modules:", error);
    res.status(500).json({ 
      message: "Failed to fetch all modules", 
      error: error.message 
    });
  }
};

/* ---------- GET MODULE BY ID ---------- */
export const getModuleById = async (req: Request, res: Response) => {
  try {
    const module = await Module.findByPk(req.params.id, {
      include: [{
        model: ModuleTopic,
        required: false,
        order: [['order', 'ASC']]
      }]
    });
    
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    
    res.json(module);
  } catch (error: any) {
    console.error("Error fetching module by ID:", error);
    res.status(500).json({ 
      message: "Failed to fetch module", 
      error: error.message 
    });
  }
};

/* ---------- CREATE MODULE ---------- */
export const createModule = async (req: Request, res: Response) => {
  // Use a transaction so if topics fail, the module isn't created alone
  const t = await Module.sequelize?.transaction();

  try {
    const { domainId, courseId, title, description, order, isActive, topics } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: "Module title is required" });
    }

    // 1. Create the Module
    const module = await Module.create({
      domainId: Number(domainId || 0),
      courseId: Number(courseId || 0),
      title: title.trim(),
      description: description ? description.trim() : null,
      order: Number(order || 0),
      isActive: isActive === undefined ? true : isActive,
    }, { transaction: t });

    // 2. If topics exist in the request, create them linked to this module
    if (topics && Array.isArray(topics) && topics.length > 0) {
      const topicsWithModuleId = topics.map((topic: any) => ({
        moduleId: module.id, // Link to the newly created module
        title: topic.title.trim(),
        description: topic.description ? topic.description.trim() : null,
        order: Number(topic.order || 0),
        isActive: topic.isActive ?? true,
      }));

      await ModuleTopic.bulkCreate(topicsWithModuleId, { transaction: t });
    }

    await t?.commit();

    // 3. Fetch the full module with topics included to return to frontend
    const fullModule = await Module.findByPk(module.id, {
      include: [ModuleTopic]
    });

    res.status(201).json({
      message: "Module and topics created successfully",
      module: fullModule
    });
  } catch (error: any) {
    await t?.rollback();
    console.error("MODULE CREATE ERROR:", error);
    res.status(400).json({ 
      message: "Module creation failed", 
      error: error.message 
    });
  }
};

/* ---------- UPDATE MODULE ---------- */
export const updateModule = async (req: Request, res: Response) => {
  const t = await Module.sequelize?.transaction();

  try {
    const { id } = req.params;
    const { domainId, courseId, title, description, order, isActive, topics } = req.body;

    const module = await Module.findByPk(id);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    // 1. Update Module Basic Info
    await module.update({
      domainId: domainId !== undefined ? Number(domainId) : module.domainId,
      courseId: courseId !== undefined ? Number(courseId) : module.courseId,
      title: title !== undefined ? title.trim() : module.title,
      description: description !== undefined ? description.trim() : module.description,
      order: order !== undefined ? Number(order) : module.order,
      isActive: isActive !== undefined ? isActive : module.isActive,
    }, { transaction: t });

    // 2. Handle Topics Sync
    if (topics && Array.isArray(topics)) {
      // Get IDs of topics coming from the frontend (new topics won't have real IDs yet)
      const frontendTopicIds = topics
        .filter((topic: any) => typeof topic.id === 'number' && topic.id < 1000000000000) // Filter out temp IDs
        .map((topic: any) => topic.id);

      // A. Remove topics that are no longer in the list
      await ModuleTopic.destroy({
        where: {
          moduleId: id,
          id: { [Symbol.for('notIn') as any]: frontendTopicIds } // Deletes topics not in frontend list
        },
        transaction: t
      });

      // B. Upsert (Update or Create) remaining topics
      for (const topicData of topics) {
        const isNew = typeof topicData.id !== 'number' || topicData.id >= 1000000000000;

        if (isNew) {
          // It's a brand new topic
          await ModuleTopic.create({
            moduleId: Number(id),
            title: topicData.title.trim(),
            description: topicData.description,
            order: Number(topicData.order || 0),
            isActive: topicData.isActive ?? true
          }, { transaction: t });
        } else {
          // It's an existing topic, update it
          await ModuleTopic.update({
            title: topicData.title.trim(),
            description: topicData.description,
            order: Number(topicData.order || 0),
            isActive: topicData.isActive ?? true
          }, { 
            where: { id: topicData.id, moduleId: id },
            transaction: t 
          });
        }
      }
    }

    await t?.commit();

    const updatedModule = await Module.findByPk(id, { include: [ModuleTopic] });
    res.json({ message: "Module and topics updated successfully", module: updatedModule });

  } catch (error: any) {
    await t?.rollback();
    console.error("MODULE UPDATE ERROR:", error);
    res.status(400).json({ message: "Module update failed", error: error.message });
  }
};

/* ---------- DELETE MODULE ---------- */
export const deleteModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Find the module
    const module = await Module.findByPk(id);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    // 2. Manually delete associated topics first
    await ModuleTopic.destroy({
      where: { moduleId: id }
    });

    // 3. Now delete the module
    await module.destroy();

    res.json({ 
      success: true, 
      message: "Module and all associated topics deleted successfully" 
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Module deletion failed", 
      error: error.message 
    });
  }
};

/* ---------- TOPIC MANAGEMENT ---------- */

/* ---------- GET ALL TOPICS FOR ADMIN ---------- */
export const getAllTopicsForAdmin = async (req: Request, res: Response) => {
  try {
    const topics = await ModuleTopic.findAll({
      include: [{
        model: Module,
        attributes: ['id', 'title', 'domainId', 'courseId']
      }],
      order: [
        ['moduleId', 'ASC'],
        ['order', 'ASC'],
        ['id', 'ASC']
      ],
    });
    
    res.json(topics);
  } catch (error: any) {
    console.error("Error fetching all topics:", error);
    res.status(500).json({ 
      message: "Failed to fetch all topics", 
      error: error.message 
    });
  }
};

/* ---------- ADD MODULE TOPIC ---------- */
export const addModuleTopic = async (req: Request, res: Response) => {
  try {
    const { moduleId, title, description, order, isActive } = req.body;
    
    if (!moduleId) {
      return res.status(400).json({ message: "Module ID is required" });
    }
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: "Topic title is required" });
    }

    // Verify module exists
    const module = await Module.findByPk(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const topic = await ModuleTopic.create({
      moduleId: Number(moduleId),
      title: title.trim(),
      description: description ? description.trim() : null,
      order: Number(order || 0),
      isActive: isActive === undefined ? true : isActive,
    });

    res.status(201).json({
      message: "Topic added successfully",
      topic
    });
  } catch (error: any) {
    console.error("TOPIC CREATE ERROR:", error);
    res.status(400).json({ 
      message: "Topic creation failed", 
      error: error.message 
    });
  }
};

/* ---------- UPDATE MODULE TOPIC ---------- */
export const updateModuleTopic = async (req: Request, res: Response) => {
  try {
    const topic = await ModuleTopic.findByPk(req.params.id);
    
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    await topic.update({
      title: req.body.title !== undefined ? req.body.title.trim() : topic.title,
      description: req.body.description !== undefined ? req.body.description.trim() : topic.description,
      order: req.body.order !== undefined ? Number(req.body.order) : topic.order,
      isActive: req.body.isActive !== undefined ? req.body.isActive : topic.isActive,
    });

    res.json({
      message: "Topic updated successfully",
      topic
    });
  } catch (error: any) {
    console.error("TOPIC UPDATE ERROR:", error);
    res.status(400).json({ 
      message: "Topic update failed", 
      error: error.message 
    });
  }
};

/* ---------- DELETE MODULE TOPIC ---------- */
export const deleteModuleTopic = async (req: Request, res: Response) => {
  try {
    const topic = await ModuleTopic.findByPk(req.params.id);
    
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    await topic.destroy();
    
    res.json({ 
      message: "Topic deleted successfully",
      success: true
    });
  } catch (error: any) {
    console.error("TOPIC DELETE ERROR:", error);
    res.status(400).json({ 
      message: "Topic deletion failed", 
      error: error.message 
    });
  }
};

/* ---------- BULK UPDATE ORDERS ---------- */
export const updateModuleOrders = async (req: Request, res: Response) => {
  try {
    const { modules, topics } = req.body;
    
    if (modules && Array.isArray(modules)) {
      const modulePromises = modules.map(({ id, order }: { id: number; order: number }) =>
        Module.update({ order }, { where: { id } })
      );
      await Promise.all(modulePromises);
    }
    
    if (topics && Array.isArray(topics)) {
      const topicPromises = topics.map(({ id, order }: { id: number; order: number }) =>
        ModuleTopic.update({ order }, { where: { id } })
      );
      await Promise.all(topicPromises);
    }
    
    res.json({ 
      message: "Orders updated successfully",
      success: true
    });
  } catch (error: any) {
    console.error("ORDER UPDATE ERROR:", error);
    res.status(400).json({ 
      message: "Failed to update orders", 
      error: error.message 
    });
  }
};