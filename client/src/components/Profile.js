import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Profile.css';

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
      const newPassword = await showModal({
        title: "Cambiar contraseña",
        message: "Ingresa tu nueva contraseña:",
        showInput: true
      });
      
      if (!newPassword) return;

      const confirmPassword = await showModal({
        title: "Confirmar contraseña",
        message: "Vuelve a ingresar tu nueva contraseña:",
        showInput: true
      });

      if (newPassword !== confirmPassword) {
        await showModal({
          title: "Error",
          message: "Las contraseñas no coinciden"
        });
        return;
      }

      setActionLoading(true);
      
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/changepassword`,
        { newPassword },
        { withCredentials: true }
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
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/deactivate`,
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
      <div className="profile-container">
        <div className="profile-loading">
          <h2>Cargando perfil...</h2>
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>Error al cargar el perfil</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="profile-container">
        <div className="profile-unauthenticated">
          <h2>No has iniciado sesión</h2>
          <p>Por favor, inicia sesión para ver tu perfil</p>
        </div>
      </div>
    );
  }


  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };


  const initials = `${user.nombre?.charAt(0) || ''}${user.apellido?.charAt(0) || ''}`;

  return (
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
        <div className="profile-avatar">
          {initials}
        </div>
        <div className="profile-info">
          <h1>{user.nombre} {user.apellido}</h1>
          <p>@{user.username}</p>
          <div className="reputation">
            <span>Reputación: {user.reputacion || 0}</span>
          </div>
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-section">
          <h2>Información personal</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <span>Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="detail-item">
              <span>Año de ingreso:</span>
              <span>{user.anio_ingreso || '-'}</span>
            </div>
            <div className="detail-item">
              <span>Estado:</span>
              <span>{user.activo ? 'Activo' : 'Inactivo'}</span>
            </div>
            <div className="detail-item">
              <span>Verificado:</span>
              <span>{user.verificado ? 'Sí' : 'No'}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h2>Seguridad</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <span>Contraseña:</span>
              <div className="password-action">
                <span>••••••••</span>
                <button 
                  onClick={handleChangePassword}
                  disabled={actionLoading}
                >
                  Cambiar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h2>Cuenta</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <span>Miembro desde:</span>
              <span>{formatDate(user.created_at)}</span>
            </div>
            <div className="detail-item">
              <span>Última actualización:</span>
              <span>{formatDate(user.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button 
          className="danger-button"
          onClick={handleDeactivateAccount}
          disabled={actionLoading}
        >
          Desactivar cuenta
        </button>
      </div>
    </div>
  );
};

export default Profile;