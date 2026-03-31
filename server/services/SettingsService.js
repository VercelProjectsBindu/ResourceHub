const sqlDB = require('./sqlDB');

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

      // Default values to insert if they perfectly match the static text currently deployed
      const defaults = [
        { key: 'siteName', val: 'Fintech Point' },
        { key: 'logoDisplay', val: 'text' }, // 'text' | 'image'
        { key: 'logoImageUrl', val: '' },
        { key: 'heroTitle', val: 'Building the Future of Digital Finance' },
        { key: 'heroSubtitle', val: 'We specialize in creating robust, scalable, and innovative web applications for businesses aiming to thrive in the modern digital ecosystem.' },
        { key: 'heroPrimaryBtnLabel', val: 'Our Work' },
        { key: 'heroSecondaryBtnLabel', val: 'Contact Us' },
        { key: 'aboutDescription', val: 'Fintech Point is an innovative software studio based in Bangladesh heavily focused on delivering cutting-edge SaaS platforms, Point of Sale systems, and robust web applications for global and localized markets.' },
        { key: 'contactAddress', val: 'Fintech Point, Mymensingh, Bangladesh' },
        { key: 'contactEmail', val: 'admin@fintechpoint.com' },
        { key: 'contactPhone', val: '+880 1234 567890' },
        { key: 'socialLinkedin', val: 'https://linkedin.com/company/fintechpoint' },
        { key: 'socialGithub', val: 'https://github.com/fintechpoint' },
        { key: 'socialX', val: 'https://x.com/fintechpoint' },
        { key: 'copyrightText', val: 'Fintech Point. All rights reserved.' },
        { key: 'maintenanceMode', val: 'false' }
      ];

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
