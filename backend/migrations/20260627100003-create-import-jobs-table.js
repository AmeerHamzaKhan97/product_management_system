'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('import_jobs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      jobId: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      fileName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      filePath: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      totalRows: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      processedRows: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      successfulRows: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      failedRows: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      errorCsvPath: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      startedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      completedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('import_jobs', ['status'], {
      name: 'import_jobs_status_idx',
    });

    await queryInterface.addIndex('import_jobs', ['createdBy'], {
      name: 'import_jobs_created_by_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('import_jobs');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_import_jobs_status";'
    );
  },
};
