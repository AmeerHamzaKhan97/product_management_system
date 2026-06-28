'use strict';

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin@1234';
const ADMIN_ID = 'a0000000-0000-4000-a000-000000000001';

module.exports = {
  async up(queryInterface) {
    const existing = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = '${ADMIN_EMAIL}' LIMIT 1`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (existing.length > 0) {
      console.log('Admin user already exists — skipping seed.');
      return;
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const now = new Date();

    await queryInterface.bulkInsert('users', [
      {
        id: ADMIN_ID,
        email: ADMIN_EMAIL,
        password: passwordHash,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    console.log(`Admin user created: ${ADMIN_EMAIL}`);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: ADMIN_EMAIL });
  },
};
