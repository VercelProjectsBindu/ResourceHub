class CRUDService {
  constructor(model) {
    this.model = model;
  }

  // Create
  async create(data) {
    try {
      const item = new this.model(data);
      return await item.save();
    } catch (error) {
      console.error('CRUD Create Error:', error);
      throw error;
    }
  }

  // Read (All)
  async getAll(query = {}) {
    try {
      return await this.model.find(query);
    } catch (error) {
      console.error('CRUD GetAll Error:', error);
      throw error;
    }
  }

  // Read (One by ID)
  async getById(id) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      console.error('CRUD GetById Error:', error);
      throw error;
    }
  }

  // Update
  async update(id, data) {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      console.error('CRUD Update Error:', error);
      throw error;
    }
  }

  // Delete
  async delete(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      console.error('CRUD Delete Error:', error);
      throw error;
    }
  }
}

module.exports = CRUDService;
