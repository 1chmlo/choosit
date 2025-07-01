import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Profile.css';
import questionMark from './question-mark.png';
import { REACT_APP_BACKEND_URL } from '../config';

const Profile = () => {
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: '',
    showInput: false,
    showCancel: false,
    inputValue: '',
    onConfirm: null
  });
  
  // Nuevo estado para el modal de cambio de contraseña
  const [passwordModal, setPasswordModal] = useState({
    show: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    errors: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    showPasswords: {
      currentPassword: false,
      newPassword: false,
      confirmPassword: false
    }
  });
  
  const [actionLoading, setActionLoading] = useState(false);

  const getNombreLegible = (username) => {
    if (!username) return '';
    return username
      .replace(/[0-9]+$/, '') // Elimina número(s) al final
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  // Función para validar contraseña (8-40 caracteres)
  const validatePassword = (password) => {
    if (!password) return false;
    return password.length >= 8 && password.length <= 40;
  };

  const showModal = ({ title, message, showInput = false, showCancel = false }) => {
    return new Promise((resolve) => {
      setModal({
        show: true,
        title,
        message,
        showInput,
        showCancel,
        inputValue: '',
        onConfirm: resolve
      });
    });
  };

  const closeModal = (confirmed = false) => {
    if (modal.onConfirm) {
      modal.onConfirm(confirmed ? (modal.showInput ? modal.inputValue : true) : null);
    }
    setModal({ ...modal, show: false, showCancel: false });
  };

  // Nueva función para mostrar el modal de cambio de contraseña
  const showPasswordModal = () => {
    setPasswordModal({
      show: true,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      errors: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      showPasswords: {
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
      }
    });
  };

  // Función para cerrar el modal de contraseña
  const closePasswordModal = () => {
    setPasswordModal({
      show: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      errors: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      showPasswords: {
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
      }
    });
  };

  // Función para alternar la visibilidad de las contraseñas
  const togglePasswordVisibility = (field) => {
    setPasswordModal(prev => ({
      ...prev,
      showPasswords: {
        ...prev.showPasswords,
        [field]: !prev.showPasswords[field]
      }
    }));
  };
  const handlePasswordModalChange = (field, value) => {
    setPasswordModal(prev => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: ''
      }
    }));
  };

  // Función para validar el formulario de cambio de contraseña
  const validatePasswordForm = () => {
    const errors = {};
    let isValid = true;

    // Validar contraseña actual
    if (!passwordModal.currentPassword) {
      errors.currentPassword = 'La contraseña actual es requerida';
      isValid = false;
    }

    // Validar nueva contraseña
    if (!passwordModal.newPassword) {
      errors.newPassword = 'La nueva contraseña es requerida';
      isValid = false;
    } else if (!validatePassword(passwordModal.newPassword)) {
      errors.newPassword = 'La contraseña debe tener entre 8 y 40 caracteres';
      isValid = false;
    }

    // Validar confirmación de contraseña
    if (!passwordModal.confirmPassword) {
      errors.confirmPassword = 'Debes confirmar la nueva contraseña';
      isValid = false;
    } else if (passwordModal.newPassword !== passwordModal.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    setPasswordModal(prev => ({
      ...prev,
      errors
    }));

    return isValid;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    try {
      setActionLoading(true);
      
      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/api/users/changepassword`,
        {
          contrasena: passwordModal.currentPassword,
          nueva_contrasena: passwordModal.newPassword
        },
        {
          withCredentials: true
        }
      );

      if (response.data.ok) {
        closePasswordModal(); // Cerrar primero
        setActionLoading(false);
        await showModal({
          title: "Éxito",
          message: "Contraseña cambiada correctamente"
        });
      } else {
        throw new Error(response.data.message || "Error al cambiar la contraseña");
      }
    } catch (error) {
      closePasswordModal(); // CERRAR EL MODAL DE CONTRASEÑAS PRIMERO
      setActionLoading(false);
      await showModal({
        title: "Error",
        message: error.response?.data?.message || error.message || "Error al cambiar la contraseña"
      });
    }
  };

  const handleDeactivateAccount = async () => {
    const confirmed = await showModal({
      title: "Desactivar cuenta",
      message: "¿Estás seguro que deseas desactivar tu cuenta? Esta acción no se puede deshacer.",
      showCancel: true
    });
    
    if (!confirmed) return;

    try {
      setActionLoading(true);
      
      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/api/auth/deactivate`,
        {},
        { withCredentials: true }
      );

      if (response.data.ok) {
        setActionLoading(false);
        await showModal({
          title: "Cuenta desactivada",
          message: "Tu cuenta ha sido desactivada. Serás redirigido."
        });
        
        logout();
        window.location.href = '/';
      } else {
        throw new Error(response.data.message || "Error al desactivar la cuenta");
      }
    } catch (error) {
      setActionLoading(false);
      await showModal({
        title: "Error",
        message: error.response?.data?.message || error.message || "Error al desactivar la cuenta"
      });
    }
  };

  if (loading) {
    return (
      <div className="profile-wrapper">
        <div className="profile-container">
          <div className="profile-loading">
            <h2>Cargando perfil...</h2>
            <div className="loader"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-wrapper">
        <div className="profile-container">
          <div className="profile-error">
            <h2>Error al cargar el perfil</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="profile-wrapper">
        <div className="profile-container">
          <div className="profile-unauthenticated">
            <h2>No has iniciado sesión</h2>
            <p>Por favor, inicia sesión para ver tu perfil</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const initials = user.username
    ? user.username
        .split('.')
        .map(p => p.charAt(0).toUpperCase())
        .join('')
    : '';

  return (
    <div className="profile-wrapper">
      <div className="profile-container">

        {/* Modal original para mensajes simples */}
        {modal.show && (
          <div className="profile-modal">
            <div className="modal-content">
              <h3>{modal.title}</h3>
              <p>{modal.message}</p>

              {modal.showInput && (
                <input
                  type={modal.title.includes('contraseña') ? 'password' : 'text'}
                  value={modal.inputValue}
                  onChange={(e) => setModal({...modal, inputValue: e.target.value})}
                  autoFocus
                  className="modal-input"
                />
              )}

              <div className="modal-actions">
                {/* Mostrar Cancelar si showInput o showCancel es true */}
                {(modal.showInput || modal.showCancel) && (
                  <button onClick={() => closeModal(false)}>Cancelar</button>
                )}
                <button
                  onClick={() => closeModal(true)}
                  disabled={actionLoading}
                  className={(modal.showInput || modal.showCancel) ? "" : "primary-button"}
                >
                  {actionLoading ? 'Procesando...' : 'Aceptar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nuevo modal para cambio de contraseña */}
        {passwordModal.show && (
          <div className="profile-modal">
            <div className="modal-content password-modal-content">
              <h3>Cambiar contraseña</h3>
              
              <div className="password-form">
                <div className="form-group">
                  <label>Contraseña actual:</label>
                  <div className="password-container">
                    <input
                      type={passwordModal.showPasswords.currentPassword ? "text" : "password"}
                      value={passwordModal.currentPassword}
                      onChange={(e) => handlePasswordModalChange('currentPassword', e.target.value)}
                      className={`modal-input ${passwordModal.errors.currentPassword ? 'input-error' : ''}`}
                      placeholder="Ingresa tu contraseña actual"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('currentPassword')}
                      className="toggle-password"
                    >
                      {passwordModal.showPasswords.currentPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                  {passwordModal.errors.currentPassword && (
                    <span className="error-message">{passwordModal.errors.currentPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Nueva contraseña:</label>
                  <div className="password-container">
                    <input
                      type={passwordModal.showPasswords.newPassword ? "text" : "password"}
                      value={passwordModal.newPassword}
                      onChange={(e) => handlePasswordModalChange('newPassword', e.target.value)}
                      className={`modal-input ${passwordModal.errors.newPassword ? 'input-error' : ''}`}
                      placeholder="Ingresa tu nueva contraseña (8-40 caracteres)"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('newPassword')}
                      className="toggle-password"
                    >
                      {passwordModal.showPasswords.newPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                  {passwordModal.errors.newPassword && (
                    <span className="error-message">{passwordModal.errors.newPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Confirmar nueva contraseña:</label>
                  <div className="password-container">
                    <input
                      type={passwordModal.showPasswords.confirmPassword ? "text" : "password"}
                      value={passwordModal.confirmPassword}
                      onChange={(e) => handlePasswordModalChange('confirmPassword', e.target.value)}
                      className={`modal-input ${passwordModal.errors.confirmPassword ? 'input-error' : ''}`}
                      placeholder="Confirma tu nueva contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      className="toggle-password"
                    >
                      {passwordModal.showPasswords.confirmPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                  {passwordModal.errors.confirmPassword && (
                    <span className="error-message">{passwordModal.errors.confirmPassword}</span>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={closePasswordModal} disabled={actionLoading}>
                  Cancelar
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={actionLoading}
                  className="primary-button"
                >
                  {actionLoading ? 'Procesando...' : 'Cambiar contraseña'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="profile-header">
          <div className="profile-avatar avatar-placeholder">
            {initials}
          </div>
          <div className="profile-info">
            <h1>{getNombreLegible(user.username)}</h1>
            <p>@{user.username}</p>
            <div className="reputation-container">
              <span>Reputación:</span>
              <span className="reputation-value">{user.reputacion || 0}</span>
              <div className="reputation-info">
                <img
                  src={questionMark}
                  alt="Información"
                  className="reputation-icon"
                  style={{ width: '16px', height: '16px', marginLeft: '5px' }}
                />
                <div className="reputation-tooltip">
                  La reputación refleja la calidad de tus contribuciones a la comunidad.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-details separated-container">
          <div className="detail-section">
            <h2>Información personal</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Año de ingreso:</span>
                <span className="detail-value">{user.anio_ingreso || '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Miembro desde:</span>
                <span className="detail-value">{formatDate(user.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-details separated-container">
          <div className="detail-section">
            <h2>Seguridad</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Contraseña:</span>
                <div className="password-action">
                  <span className="detail-value">••••••••</span>
                  <button
                    className="edit-password-btn"
                    onClick={showPasswordModal}
                    disabled={actionLoading}
                  >
                    Cambiar
                  </button>
                </div>
              </div>
              <div className="detail-item deactivate-btn-container">
                <button
                  className="danger-button deactivate-btn"
                  onClick={handleDeactivateAccount}
                  disabled={actionLoading}
                >
                  Desactivar cuenta
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;