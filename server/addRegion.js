const db = require('./services/sqlDB');
async function setup() {
  await db.query(`
    ALTER TABLE analytics 
    ADD COLUMN region VARCHAR(100) NULL AFTER ip_address,
    ADD COLUMN countryCode VARCHAR(10) NULL AFTER region;
  `).catch(e => console.log('Columns might already exist', e.message));
  console.log('Analytics schema updated with region tracking.');
  process.exit(0);
}
setup();
