'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const marketData = [
      // Quito
      {
        id: uuidv4(),
        ubicacion: 'quito',
        rango_edad: '18-25',
        gastos: JSON.stringify([35000, 28000, 22000, 18000, 15000]),
        fuentes_ingreso: JSON.stringify([600, 150, 50, 200]),
        tendencias: JSON.stringify({ 
          income: [800, 850, 900, 880, 920, 950], 
          expenses: [700, 720, 750, 800, 780, 810] 
        }),
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        ubicacion: 'quito',
        rango_edad: '26-35',
        gastos: JSON.stringify([42000, 31000, 25000, 20000, 17000]),
        fuentes_ingreso: JSON.stringify([1500, 400, 0, 300]),
        tendencias: JSON.stringify({ 
          income: [2200, 2250, 2300, 2350, 2400, 2450], 
          expenses: [1800, 1900, 1850, 2000, 2100, 2050] 
        }),
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        ubicacion: 'quito',
        rango_edad: '36-50',
        gastos: JSON.stringify([55000, 25000, 28000, 22000, 19000]),
        fuentes_ingreso: JSON.stringify([2500, 800, 0, 500]),
        tendencias: JSON.stringify({ 
          income: [3800, 3850, 3900, 4000, 4100, 4050], 
          expenses: [3000, 3100, 3200, 3150, 3300, 3400] 
        }),
        created_at: now,
        updated_at: now
      },
      // Guayaquil
      {
        id: uuidv4(),
        ubicacion: 'guayaquil',
        rango_edad: '18-25',
        gastos: JSON.stringify([38000, 26000, 24000, 20000, 13000]),
        fuentes_ingreso: JSON.stringify([650, 120, 80, 150]),
        tendencias: JSON.stringify({ 
          income: [850, 880, 910, 900, 940, 980], 
          expenses: [750, 780, 790, 820, 800, 850] 
        }),
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        ubicacion: 'guayaquil',
        rango_edad: '26-35',
        gastos: JSON.stringify([45000, 33000, 22000, 18000, 16000]),
        fuentes_ingreso: JSON.stringify([1600, 350, 0, 350]),
        tendencias: JSON.stringify({ 
          income: [2300, 2350, 2400, 2450, 2500, 2550], 
          expenses: [1900, 1950, 2000, 2100, 2150, 2200] 
        }),
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        ubicacion: 'guayaquil',
        rango_edad: '36-50',
        gastos: JSON.stringify([58000, 22000, 26000, 25000, 21000]),
        fuentes_ingreso: JSON.stringify([2800, 700, 0, 600]),
        tendencias: JSON.stringify({ 
          income: [4100, 4200, 4150, 4300, 4400, 4350], 
          expenses: [3200, 3300, 3400, 3350, 3500, 3600] 
        }),
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('market_intelligence', marketData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('market_intelligence', null, {});
  }
};
