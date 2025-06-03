import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Profile.css';
import questionMark from './question-mark.png';

const Profile = () => {
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: '',
    showInput: false,
    inputValue: '',
    onConfirm: null
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

  const showModal = ({ title, message, showInput = false }) => {
    return new Promise((resolve) => {
      setModal({
        show: true,
        title,
        message,
        showInput,
        inputValue: '',
        onConfirm: resolve
      });
    });
  };

  const closeModal = (confirmed = false) => {
    if (modal.onConfirm) {
      modal.onConfirm(confirmed ? (modal.showInput ? modal.inputValue : true) : null);
    }
    setModal({ ...modal, show: false });
  };

  const handleChangePassword = async () => {
    try {
      const contrasena = await showModal({
        title: "Ingresa tu contraseña",
        message: "Ingresa tu contraseña actual:",
        showInput: true
      });
      const nueva_contrasena = await showModal({
        title: "Cambiar contraseña",
        message: "Ingresa tu nueva contraseña:",
        showInput: true
      });
      
      if (!nueva_contrasena) return;

      const confirmPassword = await showModal({
        title: "Confirmar contraseña",
        message: "Vuelve a ingresar tu nueva contraseña:",
        showInput: true
      });

      if (nueva_contrasena !== confirmPassword) {
        await showModal({
          title: "Error",
          message: "Las contraseñas no coinciden"
        });
        return;
      }

      setActionLoading(true);
      
      const response = await axios.post(
        `http://localhost:3000/api/users/changepassword`, // Cambiar
        {
          contrasena,
          nueva_contrasena
        },
        {
          withCredentials: true
        }
      );

      if (response.data.ok) {
        await showModal({
          title: "Éxito",
          message: "Contraseña cambiada correctamente"
        });
      } else {
        throw new Error(response.data.message || "Error al cambiar la contraseña");
      }
    } catch (error) {
      await showModal({
        title: "Error",
        message: error.response?.data?.message || error.message || "Error al cambiar la contraseña"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivateAccount = async () => {
    const confirmed = await showModal({
      title: "Desactivar cuenta",
      message: "¿Estás seguro que deseas desactivar tu cuenta? Esta acción no se puede deshacer."
    });
    
    if (!confirmed) return;

    try {
      setActionLoading(true);
      
      const response = await axios.post(
        `http://localhost:3000/api/auth/deactivate`, // Cambiar
        {},
        { withCredentials: true }
      );

      if (response.data.ok) {
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
      await showModal({
        title: "Error",
        message: error.response?.data?.message || error.message || "Error al desactivar la cuenta"
      });
    } finally {
      setActionLoading(false);
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
                <button onClick={() => closeModal(false)}>Cancelar</button>
                <button
                  onClick={() => closeModal(true)}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Procesando...' : 'Aceptar'}
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
                    onClick={handleChangePassword}
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