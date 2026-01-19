'use strict';

/**
 * Migración para agregar campo fecha_limite a ingresos y egresos
 * Permite definir hasta cuándo debe ejecutarse una transacción recurrente
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar fecha_limite a ingresos
    await queryInterface.addColumn('ingresos', 'fecha_limite', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Fecha hasta la cual la transacción recurrente estará activa'
    });

    // Agregar fecha_limite a egresos
    await queryInterface.addColumn('egresos', 'fecha_limite', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Fecha hasta la cual la transacción recurrente estará activa'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ingresos', 'fecha_limite');
    await queryInterface.removeColumn('egresos', 'fecha_limite');
  }
};
