import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, loading, error, isAuthenticated } = useAuth();

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

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.nombre.charAt(0)}{user.apellido.charAt(0)}
          </div>
          <h1 className="profile-name">{user.nombre} {user.apellido}</h1>
          <p className="profile-username">@{user.username}</p>
        </div>
        
        <div className="profile-info">
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Año de ingreso:</span>
            <span className="info-value">{user.anio_ingreso}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Reputación:</span>
            <span className="info-value">{user.reputacion}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Estado:</span>
            <span className="info-value">{user.activo ? 'Activo' : 'Inactivo'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Verificado:</span>
            <span className="info-value">{user.verificado ? 'Sí' : 'No'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Fecha de registro:</span>
            <span className="info-value">{new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;