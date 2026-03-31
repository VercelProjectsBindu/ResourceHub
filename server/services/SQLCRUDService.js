class SQLCRUDService {
  constructor(tableName, db) {
    this.tableName = tableName;
    this.db = db;
  }

  // Create
  async create(data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map(() => '?').join(', ');
      const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
      const result = await this.db.query(sql, values);
      return { id: result.insertId, ...data };
    } catch (error) {
      console.error('SQL CRUD Create Error:', error);
      throw error;
    }
  }

  // Read (All)
  async getAll() {
    try {
      const sql = `SELECT * FROM ${this.tableName}`;
      return await this.db.query(sql);
    } catch (error) {
      console.error('SQL CRUD GetAll Error:', error);
      throw error;
    }
  }

  // Read (One by ID)
  async getById(id) {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
      const results = await this.db.query(sql, [id]);
      return results[0];
    } catch (error) {
      console.error('SQL CRUD GetById Error:', error);
      throw error;
    }
  }

  // Update
  async update(id, data) {
    try {
      const keys = Object.keys(data);
      const values = [...Object.values(data), id];
      const setClause = keys.map(key => `${key} = ?`).join(', ');
      const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
      await this.db.query(sql, values);
      return { id, ...data };
    } catch (error) {
      console.error('SQL CRUD Update Error:', error);
      throw error;
    }
  }

  // Delete
  async delete(id) {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
      const itemToDelete = await this.getById(id);
      const sqlDelete = `DELETE FROM ${this.tableName} WHERE id = ?`;
      await this.db.query(sqlDelete, [id]);
      return itemToDelete;
    } catch (error) {
      console.error('SQL CRUD Delete Error:', error);
      throw error;
    }
  }
}

module.exports = SQLCRUDService;
