import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './VisualizarPerfil.css';

const VisualizarPerfil = () => {
    const { user, isAuthenticated, loading: authLoading, error: authError } = useAuth();
    const [modal, setModal] = useState({
        show: false,
        title: '',
        message: '',
        showInput: false,
        showCancel: true,
        inputValue: '',
        resolve: null
    });
    const [loading, setLoading] = useState(false);

    const showModal = ({ title, message, showInput = false, showCancel = true }) => {
        return new Promise((resolve) => {
            setModal({
                show: true,
                title,
                message,
                showInput,
                showCancel,
                inputValue: '',
                resolve
            });
        });
    };

    const handleModalClose = (result) => {
        if (modal.resolve) {
            modal.resolve(result === 'ok' ? (modal.showInput ? modal.inputValue : true) : null);
        }
        setModal({ ...modal, show: false });
    };

    const handleInputChange = (e) => {
        setModal({ ...modal, inputValue: e.target.value });
    };

    const deactivateAccount = async () => {
        const confirmed = await showModal({
            title: "Confirmación",
            message: "¿Estás seguro que deseas desactivar tu cuenta? Esta acción no se puede deshacer.",
            showInput: false
        });

        if (!confirmed) return;

        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/deactivate`);
            
            await showModal({
                title: "Éxito",
                message: "Cuenta desactivada correctamente. Serás redirigido.",
                showInput: false,
                showCancel: false
            });
            
            logout();
            window.location.href = '/';
        } catch (error) {
            console.error('Error:', error);
            await showModal({
                title: "Error",
                message: error.response?.data?.message || "Error al desactivar la cuenta",
                showInput: false,
                showCancel: false
            });
        } finally {
            setLoading(false);
        }
    };

    const editPassword = async () => {
        const confirmChange = await showModal({
            title: "Confirmación",
            message: "¿Deseas cambiar tu contraseña?",
            showInput: false
        });

        if (!confirmChange) return;

        const newPassword = await showModal({
            title: "Nueva Contraseña",
            message: "Ingresa tu nueva contraseña:",
            showInput: true
        });

        if (!newPassword) return;

        const confirmPassword = await showModal({
            title: "Confirmar Contraseña",
            message: "Confirma tu nueva contraseña:",
            showInput: true
        });

        if (newPassword !== confirmPassword) {
            await showModal({
                title: "Error",
                message: "Las contraseñas no coinciden.",
                showInput: false,
                showCancel: false
            });
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/usuarios/changepassword`, {
                newPassword
            });

            await showModal({
                title: "Éxito",
                message: "Contraseña cambiada exitosamente.",
                showInput: false,
                showCancel: false
            });
        } catch (error) {
            console.error('Error:', error);
            await showModal({
                title: "Error",
                message: error.response?.data?.message || "Error al cambiar la contraseña",
                showInput: false,
                showCancel: false
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const initials = user?.nombre ? `${user.nombre.charAt(0)}${user.apellido?.charAt(0) || ''}` : '';

    if (authLoading) {
        return (
            <div className="main-container">
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    if (authError) {
        return (
            <div className="main-container">
                <div className="details-container">
                    <h2>Error</h2>
                    <p>Error al cargar los datos del usuario: {authError.message}</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="main-container">
                <div className="details-container">
                    <h2>Acceso no autorizado</h2>
                    <p>Por favor inicia sesión para ver tu perfil.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="main-container">
            {modal.show && (
                <div id="custom-modal" className="modal">
                    <div className="modal-content">
                        <h3 id="modal-title">{modal.title}</h3>
                        <p id="modal-message">{modal.message}</p>
                        {modal.showInput && (
                            <input
                                type={modal.title.includes('Contraseña') ? 'password' : 'text'}
                                id="modal-input"
                                className="modal-input"
                                value={modal.inputValue}
                                onChange={handleInputChange}
                                autoComplete="new-password"
                            />
                        )}
                        <div className="modal-buttons">
                            {modal.showCancel && (
                                <button
                                    id="modal-cancel"
                                    className="modal-btn cancel-btn"
                                    onClick={() => handleModalClose('cancel')}
                                    disabled={loading}>
                                    Cancelar
                                </button>
                            )}
                            <button
                                id="modal-ok"
                                className="modal-btn ok-btn"
                                onClick={() => handleModalClose('ok')}
                                disabled={loading}>
                                {loading ? 'Procesando...' : 'Aceptar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading && !modal.show && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}

            <div className="info-container">
                <div className="avatar-container">
                    <div className="avatar-placeholder">{initials}</div>
                </div>
                
                <div className="name-container">
                    <h1 id="user-name">{`${user.nombre} ${user.apellido || ''}`}</h1>
                    <p id="user-role">Estudiante</p>
                </div>
                
                <div className="reputation-container">
                    <span className="reputation-label">Reputación:</span>
                    <span className="reputation-value" id="user-reputation">{user.reputacion || 0}</span>
                    <div className="reputation-info">
                        <img src="question-mark.png" alt="?" />
                        <span className="reputation-tooltip">
                            La reputación es la suma de los likes que ha tenido el usuario en todos los comentarios.
                        </span>
                    </div>
                </div>
            </div>

            <div className="details-container">
                <h2>Información Personal</h2>
                <div className="details-grid">
                    <div className="detail-item">
                        <span className="detail-label">Nombre completo</span>
                        <span className="detail-value" id="full-name">{`${user.nombre} ${user.apellido || ''}`}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Usuario</span>
                        <span className="detail-value" id="username">{user.username || '-'}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Email</span>
                        <span className="detail-value" id="email">{user.email || '-'}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Año ingreso</span>
                        <span className="detail-value" id="year">{user.anio_ingreso || '-'}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Contraseña</span>
                        <div className="password-container">
                            <span className="detail-value">••••••••</span>
                            <button 
                                className="edit-password-btn" 
                                onClick={editPassword}
                                disabled={loading}
                            >
                                Editar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="status-container">
                <h2>Estado de la cuenta</h2>
                <div className="status-grid">
                    <div className="status-item">
                        <span className="status-label">Miembro desde:</span>
                        <span className="status-value" id="created-at">{formatDate(user.created_at)}</span>
                    </div>
                    <div className="deactivate-container">
                        <button 
                            className="deactivate-btn" 
                            onClick={deactivateAccount}
                            disabled={loading}
                        >
                            Desactivar cuenta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualizarPerfil;