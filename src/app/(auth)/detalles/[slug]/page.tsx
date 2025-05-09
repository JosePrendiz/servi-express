'use client';
import { RequestPayoutDetails } from "app/interfaces";
import React, { useEffect, useState } from "react";
import { useAppContext } from 'app/context';
import { serviceAPI } from "app/axios";
import { useParams } from 'next/navigation';
import Loading from "@/components/loader";

const TransactionDetails = () => {

    const { currentUser } = useAppContext();
    const { slug } = useParams();

    const [requestDetails, setRequestDetails] = useState<RequestPayoutDetails>()

    const getDetails = async () => {
        if (currentUser?.role === 'handyman') {
            const data = await serviceAPI.handymanPayoutDetails(slug as string)
            setRequestDetails(data)
        } else if (currentUser?.role === 'client') {
            const data = await serviceAPI.clientPayoutDetails(slug as string)
            setRequestDetails(data)
        }
    }

    useEffect(() => {
        getDetails()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    return (
        <div className="details-container">
            <h1 className="title">Detalles de la Transacción</h1>
            {requestDetails ?
                <div>
                    <div className="space-y-2">
                        <h3 style={{ textAlign: "center" }}>Detalles del Servicio</h3>
                        {currentUser?.role === 'handyman' ?
                            <div className="row-data-display"><div className="value-skills">Cliente:</div> {requestDetails?.clientName} {requestDetails?.clientLastName}</div>
                            :
                            <div className="row-data-display"><div className="value-skills">Handyman:</div> {requestDetails?.handymanName} {requestDetails?.handymanLastName}</div>
                        }
                        <div className="row-data-display"><div className="value-skills">Título:</div> {requestDetails?.requestTitle}</div>
                        <div className="row-data-display"><div className="value-skills">Descripción:</div> <p style={{ textAlign: 'right' }}>{requestDetails?.requestDescription}</p></div>
                    </div>
                    <br></br>
                    <br></br>
                    <div className="space-y-2">
                        <h3 style={{ textAlign: "center" }}>Detalles del Pago</h3>
                        {currentUser?.role === 'handyman' ?
                            <>
                                <div className="row-data-display"><div className="value-skills">Pagado por Cliente:</div> ${requestDetails?.clientPaymentAmount.toFixed(2)}</div>
                                <div className="row-data-display"><div className="value-skills">Comisión de PayPal:</div> ${requestDetails?.paypalFeeOnClientPayment?.toFixed(2)}</div>
                                <div className="row-data-display"><div className="value-skills">Comisión de la Plataforma:</div> ${requestDetails?.appCommission?.toFixed(2)}</div>
                                <div className="row-data-display"><div className="value-skills">Pago Final:</div> ${requestDetails?.handymanNetAmount?.toFixed(2)}</div>
                            </>
                            :
                            <div className="row-data-display"><div className="value-skills">Total Pagado:</div> ${requestDetails?.clientPaymentAmount.toFixed(2)}</div>
                        }

                        <div className="completion-section">
                            <div className="row-data-display">
                                <div className="value-skills" style={{ color: "#000" }}>Fecha Inicio:</div>
                                {formatDate(requestDetails?.createdAt)}
                            </div>
                            <div className="row-data-display">
                                <div className="value-skills" style={{ color: "#000" }}>Fecha Cierre:</div>
                                {formatDate(requestDetails?.completedAt)}
                            </div>
                        </div>
                    </div>
                    <div className="no-service-message" style={{ height: 50, marginTop: 50 }}>
                        <p>Gracias por usar Servi Express!!!</p>
                    </div>
                </div> :
                <Loading message="Cargando Datos del Recibo"></Loading>
            }
        </div >
    );
};

export default TransactionDetails;
