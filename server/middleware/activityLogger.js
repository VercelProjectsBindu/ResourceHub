const ActivityLogService = require('../services/ActivityLogService');

const activityLogger = (req, res, next) => {
  // We only care to log state-changing activities for this audit trail
  if (req.method === 'GET' || req.method === 'OPTIONS') {
    return next();
  }

  // Hook into response finish to ensure we only log completed actions (or attempted actions)
  res.on('finish', () => {
    try {
      // Determine the business entity (e.g. /api/projects -> projects)
      const pathSegments = req.originalUrl.split('?')[0].split('/').filter(Boolean);
      const isApi = pathSegments[0] === 'api';
      
      if (!isApi) return; // Only track API calls
      
      const entity = pathSegments.length > 1 ? pathSegments[1] : 'general';
      const action = `${req.method} ${req.path}`;
      
      // Sanitize payload (remove passwords/tokens)
      const details = { ...req.body };
      if (details.password) details.password = '[REDACTED]';
      
      // Identify the user if authentication middleware (verifyToken) mapped them
      const userId = req.user ? req.user.id : null;
      const username = req.user ? req.user.username : null;
      
      // Asynchronously log the physical database hit representation
      ActivityLogService.log({
        userId,
        username,
        action,
        entity,
        details,
        ipAddress: req.ip || req.connection.remoteAddress
      });
    } catch (err) {
      console.error('Error in activityLogger middleware:', err);
    }
  });

  next();
};

module.exports = activityLogger;
