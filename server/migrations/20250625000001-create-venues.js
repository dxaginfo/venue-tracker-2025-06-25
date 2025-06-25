'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('venues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'USA'
      },
      postal_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      technical_specs: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      load_in_notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      venue_type: {
        type: Sequelize.ENUM('club', 'theater', 'arena', 'festival', 'bar', 'outdoor', 'other'),
        allowNull: false,
        defaultValue: 'other'
      },
      last_contacted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      location_coordinates: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('venues', ['name']);
    await queryInterface.addIndex('venues', ['city', 'state']);
    await queryInterface.addIndex('venues', ['venue_type']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('venues');
  }
};