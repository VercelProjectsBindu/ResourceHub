const sqlDB = require('./sqlDB');

class StatsService {
  static async recordView(ip, userAgent) {
    try {
      // 24-hour unique IP throttle (YouTube-style unique views)
      const sqlCheck = `SELECT id FROM analytics WHERE type = 'page_view' AND ip_address = ? AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR) LIMIT 1`;
      const existing = await sqlDB.query(sqlCheck, [ip]);
      
      if (existing.length === 0) {
        let region = 'Unknown', countryCode = 'UN';
        try {
          if (ip && ip !== '::1' && ip !== '127.0.0.1') {
            const geoRes = await fetch(`http://ip-api.com/json/${ip}`).then(r => r.json());
            if (geoRes.status === 'success') {
              region = geoRes.country;
              countryCode = geoRes.countryCode;
            }
          }
        } catch(e) {}

        await sqlDB.query(
          "INSERT INTO analytics (type, ip_address, region, countryCode, user_agent) VALUES ('page_view', ?, ?, ?, ?)",
          [ip, region, countryCode, userAgent]
        );
      }
    } catch (error) {
      console.error('Failed to record page view:', error.message);
    }
  }

  static async recordEngagement(action, ip) {
    try {
      await sqlDB.query(
        "INSERT INTO analytics (type, action, ip_address) VALUES ('engagement', ?, ?)",
        [action, ip]
      );
    } catch (error) {
      console.error('Failed to record engagement:', error.message);
    }
  }

  static async getSummary() {
    try {
      const viewsResults = await sqlDB.query("SELECT COUNT(*) as count FROM analytics WHERE type = 'page_view'");
      const engageResults = await sqlDB.query("SELECT COUNT(*) as count FROM analytics WHERE type = 'engagement'");
      
      return {
        views: viewsResults[0]?.count || 0,
        engagement: engageResults[0]?.count || 0
      };
    } catch (error) {
      console.error('Failed to fetch stats summary:', error);
      throw error;
    }
  }

  static async getChartData(timeframe = 'daily') {
    try {
      let sql, results, chartData = [];
      
      if (timeframe === 'monthly') {
        sql = `
          SELECT DATE_FORMAT(created_at, '%Y-%m') as date,
                 SUM(CASE WHEN type = 'page_view' THEN 1 ELSE 0 END) as views,
                 SUM(CASE WHEN type = 'engagement' THEN 1 ELSE 0 END) as engagements
          FROM analytics
          WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 11 MONTH)
          GROUP BY DATE_FORMAT(created_at, '%Y-%m')
          ORDER BY date ASC
        `;
        results = await sqlDB.query(sql);
        
        for (let i = 11; i >= 0; i--) {
          const d = new Date();
          // Fix JS month rollover bug (e.g. Jan 31 - 1 month = Feb 31 -> Mar 3)
          d.setDate(1); 
          d.setMonth(new Date().getMonth() - i);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dString = `${yyyy}-${mm}`;
          
          const found = results.find(r => r.date === dString);
          chartData.push({
            date: d.toLocaleDateString('en-US', { month: 'short' }),
            views: found ? Number(found.views) : 0,
            engagements: found ? Number(found.engagements) : 0
          });
        }
      } else if (timeframe === 'weekly') {
        sql = `
          SELECT YEARWEEK(created_at, 1) as date,
                 SUM(CASE WHEN type = 'page_view' THEN 1 ELSE 0 END) as views,
                 SUM(CASE WHEN type = 'engagement' THEN 1 ELSE 0 END) as engagements
          FROM analytics
          WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK)
          GROUP BY YEARWEEK(created_at, 1)
          ORDER BY date ASC
        `;
        results = await sqlDB.query(sql);
        const recent4 = results.slice(-4);
        chartData = recent4.map((r, i) => ({
          date: `W${i+1}`,
          views: Number(r.views),
          engagements: Number(r.engagements)
        }));
        while(chartData.length < 4) chartData.unshift({ date: 'W?', views: 0, engagements: 0 });
        chartData.forEach((d, i) => d.date = `Week ${i+1}`);
      } else {
        sql = `
          SELECT DATE(created_at) as date,
                 SUM(CASE WHEN type = 'page_view' THEN 1 ELSE 0 END) as views,
                 SUM(CASE WHEN type = 'engagement' THEN 1 ELSE 0 END) as engagements
          FROM analytics
          WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
          GROUP BY DATE(created_at)
          ORDER BY date ASC
        `;
        results = await sqlDB.query(sql);
        
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dString = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
          
          const found = results.find(r => {
             const rStr = r.date instanceof Date 
                  ? new Date(r.date.getTime() - (r.date.getTimezoneOffset() * 60000)).toISOString().split('T')[0]
                  : r.date;
             return rStr === dString;
          });
          
          chartData.push({
            date: d.toLocaleDateString('en-US', { weekday: 'short' }),
            views: found ? Number(found.views) : 0,
            engagements: found ? Number(found.engagements) : 0
          });
        }
      }
      return chartData;
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
      throw error;
    }
  }

  static async getRegionalData() {
    try {
      const sql = `
        SELECT countryCode, region, COUNT(*) as hits 
        FROM analytics 
        WHERE type = 'page_view' AND countryCode IS NOT NULL 
        GROUP BY countryCode, region 
        ORDER BY hits DESC 
        LIMIT 5
      `;
      const results = await sqlDB.query(sql);
      return results.map(r => ({
        countryCode: r.countryCode,
        region: r.region,
        hits: Number(r.hits)
      }));
    } catch(e) {
      return [];
    }
  }
}

module.exports = StatsService;
