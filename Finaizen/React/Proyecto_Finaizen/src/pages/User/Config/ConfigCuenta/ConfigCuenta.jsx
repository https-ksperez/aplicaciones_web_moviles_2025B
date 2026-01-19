import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import apiService from '../../../../services/apiService';
import { Card, Button, Input, Select, Toast } from '../../../../components/ui';
import styles from './ConfigCuenta.module.css';

const ConfigCuenta = () => {
  const { currentUser, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: '',
    pais: '',
    ciudad: '',
    genero: ''
  });
  const [originalEmail, setOriginalEmail] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const userData = {
        nombre: currentUser.nombre || '',
        apellido: currentUser.apellido || '',
        email: currentUser.correo || currentUser.email || '',
        fechaNacimiento: currentUser.fechaNacimiento ? 
          (currentUser.fechaNacimiento instanceof Date ? 
            currentUser.fechaNacimiento.toISOString().split('T')[0] : 
            new Date(currentUser.fechaNacimiento).toISOString().split('T')[0]) : '',
        pais: currentUser.pais || '',
        ciudad: currentUser.ciudad || '',
        genero: currentUser.genero || ''
      };
      setFormData(userData);
      setOriginalEmail(currentUser.correo || currentUser.email || '');
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar que todos los campos requeridos estén llenos
      if (!formData.nombre || !formData.apellido || !formData.email) {
        showToast('Por favor completa todos los campos requeridos', 'error');
        setIsLoading(false);
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showToast('Por favor ingresa un email válido', 'error');
        setIsLoading(false);
        return;
      }

      // Verificar si el email cambió
      const emailChanged = formData.email !== originalEmail;

      // Actualizar usuario mediante el API
      const updatedUser = await apiService.users.update(currentUser.id, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.email,
        fechaNacimiento: formData.fechaNacimiento || null,
        pais: formData.pais,
        ciudad: formData.ciudad,
        genero: formData.genero
      });

      // Actualizar contexto con el usuario actualizado
      updateUser(updatedUser);

      // Si el email cambió, actualizar la referencia
      if (emailChanged) {
        setOriginalEmail(formData.email);
      }

      showToast('✅ Información actualizada correctamente', 'success');
      
    } catch (error) {
      console.error('Error al actualizar cuenta:', error);
      showToast('❌ Error al actualizar la información', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const generoOptions = [
    { value: '', label: 'Seleccionar...', disabled: true },
    { value: 'Hombre', label: 'Hombre' },
    { value: 'Mujer', label: 'Mujer' },
    { value: 'Otro', label: 'Otro' },
    { value: 'Prefiero no decirlo', label: 'Prefiero no decirlo' }
  ];

  return (
    <div className={styles.configCuentaPage}>
      <Card>
        <h1 className={styles.title}>👤 Cuenta</h1>
        <p className={styles.subtitle}>Actualiza tu información personal aquí.</p>

        <form onSubmit={handleSubmit} className={styles.accountForm}>
          {/* Fila 1: Nombre y Apellido */}
          <div className={styles.formRow}>
            <Input
              label="Nombre"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Juan"
            />
            <Input
              label="Apellido"
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              placeholder="Ej: Pérez"
            />
          </div>

          {/* Fila 2: Correo */}
          <div>
            <Input
              label="Correo"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ejemplo@correo.com"
            />
            {formData.email !== originalEmail && (
              <small className={styles.warningText}>
                ⚠️ Cambiar el email afectará tu inicio de sesión
              </small>
            )}
          </div>

          {/* Fila 3: Fecha de Nacimiento */}
          <Input
            label="Fecha de nacimiento"
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
          />

          {/* Fila 4: País y Ciudad */}
          <div className={styles.formRow}>
            <Input
              label="País"
              type="text"
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              placeholder="Ej: Ecuador"
            />
            <Input
              label="Ciudad"
              type="text"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              placeholder="Ej: Quito"
            />
          </div>

          {/* Fila 5: Género */}
          <Select
            label="Género"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            options={generoOptions}
          />

          {/* Acciones */}
          <div className={styles.formActions}>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Guardando...' : '💾 Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Card>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default ConfigCuenta;
