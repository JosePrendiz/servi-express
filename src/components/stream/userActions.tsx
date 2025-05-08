import { quotationAPI, serviceAPI } from 'app/axios';
import { UserChatActions } from 'app/interfaces';
import './chatStyles.css';
import React from 'react';

const UserActions: React.FC<UserChatActions> = ({ role, channel }) => {

    const handleAcceptRequest = async () => {
        try {
            await serviceAPI.handymanAcceptRequests(channel.data.id.split('-')[1])
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    const handleRejectRequest = async () => {
        try {
            await serviceAPI.handymanRejectRequests(channel.data.id.split('-')[1])
        } catch (error) {
            console.error("Error canceling request:", error);
        }
    };

    const handleAcceptQuote = async () => {
        try {
            await quotationAPI.clientAcceptQuote(channel.data.quotationId)
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    const handleRejectQuote = async () => {
        try {
            await quotationAPI.clientRejectQuote(channel.data.quotationId)
        } catch (error) {
            console.error("Error canceling request:", error);
        }
    };

    const getActionData = () => {
        if (role === 'handyman') {
            switch (channel.data.requestStatus) {
                case 'pending':
                    return {
                        title: '¿Aceptar esta solicitud?',
                        description: 'Por favor confirma si deseas aceptar o rechazar esta solicitud antes de continuar.',
                        buttons: [
                            { label: 'Aceptar', onClick: handleAcceptRequest, className: 'accept-btn' },
                            { label: 'Rechazar', onClick: handleRejectRequest, className: 'reject-btn' },
                        ],
                    };
                case 'rejected':
                    return {
                        title: 'Solicitud Rechazada',
                        description: 'Rechazaste la solicitud de este cliente.',
                        buttons: [
                            { label: "Aceptar", onClick: () => { window.location.reload(); }, className: "accept-btn" }
                        ],
                    };
                case 'quoted':
                    return {
                        title: 'Cotización Enviada',
                        description: 'Esperando confirmación del cliente.',
                        buttons: [],
                    };
                case 'completed':
                    return {
                        title: 'Servicio Terminado',
                        description: 'Pronto Recibirá su pago, la notificación le llegará a su correo',
                        buttons: [
                            { label: 'Aceptar', onClick: () => { window.location.href = `/` }, className: 'accept-btn' },
                        ],
                    };
                default:
                    return { title: '', description: '', buttons: [] };
            }
        } else if (role === 'client') {
            switch (channel.data.requestStatus) {
                case 'rejected':
                    return {
                        title: 'Solicitud Rechazada',
                        description: 'Su solicitud fue rechazada por el handyman.',
                        buttons: [
                            { label: "Aceptar", onClick: () => { window.location.reload(); }, className: "accept-btn" }
                        ],
                    };
                case 'quoted':
                    return {
                        title: 'Cotización Recibida',
                        description: `Por favor confirma si deseas aceptar o rechazar la cotización de $${channel.data.quotationValue}.`,
                        buttons: [
                            { label: 'Aceptar', onClick: handleAcceptQuote, className: 'accept-btn' },
                            { label: 'Rechazar', onClick: handleRejectQuote, className: 'reject-btn' },
                        ],
                    };
                default:
                    return { title: '', description: '', buttons: [] };
            }
        }
        return { title: '', description: '', buttons: [] };
    };

    const { title, description, buttons } = getActionData();

    if (!title && !description) return null;

    return (
        <div className="chat-overlay">
            <div className="action-modal">
                <h2>{title}</h2>
                <p>{description}</p>
                <div className="button-group">
                    {buttons.map((button, index) => (
                        <button
                            key={index}
                            className={button.className}
                            onClick={button.onClick}
                        >
                            {button.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserActions;
