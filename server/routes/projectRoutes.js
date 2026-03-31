const express = require('express');
const router = express.Router();
const SQLCRUDService = require('../services/SQLCRUDService');
const sqlDB = require('../services/sqlDB');
const { verifyToken } = require('../middleware/authMiddleware');

const projectService = new SQLCRUDService('projects', sqlDB);

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await projectService.getAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await projectService.getById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new project
router.post('/', verifyToken, async (req, res) => {
  try {
    const newProject = await projectService.create(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedProject = await projectService.update(req.params.id, req.body);
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedProject = await projectService.delete(req.params.id);
    res.json({ message: 'Project deleted', project: deletedProject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
