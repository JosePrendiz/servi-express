'use client';
import React, { useState } from 'react';
import { usersAPI } from 'app/axios';

interface ReportPopupProps {
    isOpen: boolean;
    onClose: () => void;
    reportedUserId: string;
    reportedUserName: string,
}

const ReportPopup: React.FC<ReportPopupProps> = ({ isOpen, onClose, reportedUserId, reportedUserName }) => {
    const [reportTitle, setReportTitle] = useState('');
    const [reportDescription, setReportDescription] = useState('');

    const submitReport = async () => {
        await usersAPI.reportUser({
            reportedUserId,
            title: reportTitle,
            description: reportDescription,
        });
        onClose();
        setReportTitle('');
        setReportDescription('');
    };

    if (!isOpen) return null;

    return (
        <div className="overlay" onClick={onClose}>
            <div className="report-popup" onClick={(e) => {
                e.stopPropagation();
            }}>
                <h4>Reportar a : {reportedUserName}</h4>
                <input
                    type="text"
                    placeholder="Título del Reporte"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                />
                <textarea
                    placeholder="Descripción del Reporte"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <button onClick={submitReport}>Reportar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ReportPopup;