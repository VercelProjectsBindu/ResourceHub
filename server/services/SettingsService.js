const sqlDB = require('./sqlDB');
const defaultSettings = require('../config/defaultSettings');

class SettingsService {
  static async initDB() {
    try {
      // Ensure the table exists
      await sqlDB.query(`
        CREATE TABLE IF NOT EXISTS site_settings (
          setting_key VARCHAR(100) UNIQUE PRIMARY KEY,
          setting_value TEXT
        )
      `);

      // Default values mapping to the modularized configuration logic
      const defaults = defaultSettings;
      // Insert defaults if missing utilizing IGNORE keyword
      for (const def of defaults) {
        await sqlDB.query(
          "INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES (?, ?)",
          [def.key, def.val]
        );
      }
    } catch (error) {
      console.error('Settings init failed:', error);
    }
  }

  static async getAll() {
    try {
      const results = await sqlDB.query("SELECT setting_key, setting_value FROM site_settings");
      const settings = {};
      results.forEach(r => {
        settings[r.setting_key] = r.setting_value;
      });
      return settings;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async updateAll(settingsObj) {
    try {
      const keys = Object.keys(settingsObj);
      for (const key of keys) {
        // Upsert logic for MySQL:
        await sqlDB.query(
          "INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
          [key, settingsObj[key], settingsObj[key]]
        );
      }
      return await this.getAll();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SettingsService;
