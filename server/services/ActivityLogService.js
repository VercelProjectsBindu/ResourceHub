const sqlDB = require('./sqlDB');

class ActivityLogService {
  static async log({ userId, username, action, entity, details, ipAddress }) {
    try {
      const sql = `
        INSERT INTO activity_logs (user_id, username, action, entity, details, ip_address)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const params = [
        userId || null,
        username || 'system/guest',
        action,
        entity,
        JSON.stringify(details || {}),
        ipAddress || ''
      ];
      await sqlDB.query(sql, params);
    } catch (error) {
      console.error('Failed to write activity log:', error);
      // Catch and swallow to prevent disrupting the main API flow
    }
  }
}

module.exports = ActivityLogService;
