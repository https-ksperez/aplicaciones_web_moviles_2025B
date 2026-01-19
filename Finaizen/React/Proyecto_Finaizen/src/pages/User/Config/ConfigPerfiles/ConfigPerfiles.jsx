import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import apiService from '../../../../services/apiService';
import { Toast, ConfirmDialog } from '../../../../components/ui';
import ProfileCard from '../../../../components/cards/ProfileCard';
import ProfileModal from '../../../../components/modals/ProfileModal';
import styles from './ConfigPerfiles.module.css';

const ConfigPerfiles = () => {
  const { currentUser, perfiles, cambiarPerfil, actualizarPerfiles, currentPerfil } = useAuth();
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [perfilToDelete, setPerfilToDelete] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleOpenModal = (perfil = null) => {
    setEditingPerfil(perfil);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPerfil(null);
  };

  const handleSubmit = async (formData) => {
    if (!formData.nombre.trim()) {
      showToast('El nombre del perfil es requerido', 'error');
      return;
    }

    try {
      if (editingPerfil) {
        // Editar perfil existente
        await apiService.perfiles.update(editingPerfil.id, {
          nombre: formData.nombre,
          moneda: formData.moneda
        });

        actualizarPerfiles();
        handleCloseModal();
        showToast('✅ Perfil actualizado correctamente', 'success');
      } else {
        // Crear nuevo perfil
        const simbolosMoneda = {
          'USD': '$',
          'EUR': '€',
          'MXN': '$',
          'COP': '$'
        };
        
        await apiService.perfiles.create({
          userId: currentUser.id,
          nombre: formData.nombre,
          moneda: formData.moneda,
          simboloMoneda: simbolosMoneda[formData.moneda] || '$'
        });

        actualizarPerfiles();
        handleCloseModal();
        showToast('✅ Perfil creado correctamente', 'success');
      }
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      showToast('❌ Error al guardar el perfil', 'error');
    }
  };

  const handleDelete = (perfil) => {
    if (perfiles.length <= 1) {
      showToast('⚠️ Debes tener al menos un perfil', 'warning');
      return;
    }

    if (perfil.id === currentPerfil?.id) {
      showToast('⚠️ No puedes eliminar el perfil activo', 'warning');
      return;
    }

    setPerfilToDelete(perfil);
    setShowConfirmDialog(true);
  };

  const handleSwitchPerfil = (perfil) => {
    if (perfil.id === currentPerfil?.id) {
      showToast('ℹ️ Este perfil ya está activo', 'info');
      return;
    }

    cambiarPerfil(perfil.id);
    showToast(`✅ Cambiado a perfil: ${perfil.nombre}`, 'success');
  };

  const confirmDelete = async () => {
    if (!perfilToDelete) return;

    try {
      await apiService.perfiles.delete(perfilToDelete.id);

      showToast('✅ Perfil eliminado correctamente', 'success');
      actualizarPerfiles();
    } catch (error) {
      console.error('Error al eliminar perfil:', error);
      showToast('❌ Error al eliminar el perfil', 'error');
    }

    setShowConfirmDialog(false);
    setPerfilToDelete(null);
  };

  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
    setPerfilToDelete(null);
  };

  return (
    <div className={styles.configPerfilesPage}>
      <div className={styles.profilesManagementCard}>
        <h1>💼 Administrar perfiles</h1>
        <p className={styles.subtitle}>
          Gestiona tus perfiles de finanzas para mantener todo organizado.
        </p>

        <div className={styles.profilesContainer}>
          {perfiles.map(perfil => (
            <ProfileCard
              key={perfil.id}
              perfil={perfil}
              isActive={perfil.id === currentPerfil?.id}
              onSwitch={handleSwitchPerfil}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          ))}

          {/* Card para agregar */}
          <article 
            className={styles.profileCardAdd}
            onClick={() => handleOpenModal()}
          >
            <div className={styles.addIcon}>➕</div>
            <div>Agregar Perfil</div>
          </article>
        </div>
      </div>

      <ProfileModal
        show={showModal}
        perfil={editingPerfil}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que quieres eliminar el perfil "${perfilToDelete?.nombre}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={handleCancelConfirm}
      />

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

export default ConfigPerfiles;
