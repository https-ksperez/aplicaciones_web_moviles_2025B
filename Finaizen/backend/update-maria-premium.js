const { User } = require('./src/models');

async function updateMaria() {
  try {
    const [updatedRows] = await User.update(
      { 
        isPremium: true,
        premiumSince: new Date(),
        subscriptionType: 'anual',
        subscriptionEndDate: new Date(Date.now() + 365*24*60*60*1000) // 1 año
      }, 
      { 
        where: { correo: 'maria@example.com' } 
      }
    );

    if (updatedRows > 0) {
      console.log('✅ María actualizada a usuario PREMIUM por 1 año');
      
      // Verificar
      const maria = await User.findOne({ where: { correo: 'maria@example.com' } });
      console.log('Usuario:', maria.nombre, maria.apellido);
      console.log('Premium:', maria.isPremium);
      console.log('Tipo:', maria.subscriptionType);
      console.log('Desde:', maria.premiumSince);
      console.log('Hasta:', maria.subscriptionEndDate);
    } else {
      console.log('❌ No se encontró el usuario');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateMaria();
