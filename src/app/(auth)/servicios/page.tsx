'use client';
import React, { useEffect, useState } from "react";
import { useAppContext } from 'app/context';
import { serviceAPI } from 'app/axios';
import ActiveServices from "@/components/service/serviceCard";
import { ServiceRequest } from "app/interfaces";
import ReportPopup from "@/components/report/reportPopup";

export default function Chats() {

    const { currentUser } = useAppContext();

    const [activeChannels, setActiveChannels] = useState<ServiceRequest[]>([]);
    const [inactiveChannels, setInactiveChannels] = useState<ServiceRequest[]>([]);
    const [reportedUserID, setReportedUserID] = useState<string>('');
    const [reportedUserName, setReportedUserName] = useState<string>('');
    const [showReportInput, setShowReportInput] = useState(false)

    const handleReport = (userID: string, userName: string) => {
        setReportedUserID(userID);
        setReportedUserName(userName);
        setShowReportInput(true)
    }

    const fetchAndTrackChannels = async () => {
        if (currentUser?.role === 'handyman') {
            const channels = await serviceAPI.getHandymanRequests();
            categorizeChannels(channels);
        } else if (currentUser?.role === 'client') {
            const channels = await serviceAPI.getClientRequests();
            categorizeChannels(channels);
        }
    };

    const categorizeChannels = (channels: ServiceRequest[]) => {
        const inactiveStatuses = ['rejected', 'completed', 'expired', 'cancelled'];
        const active = channels.filter(channel => !inactiveStatuses.includes(channel.status));
        const inactive = channels.filter(channel => inactiveStatuses.includes(channel.status));

        setActiveChannels(active);
        setInactiveChannels(inactive);
    };

    useEffect(() => {
        fetchAndTrackChannels()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])

    return (
        <div>
            {/* Active Services Section */}
            <div className="services-container">
                <div>
                    <br></br>
                    <h2 className="text-center">Servicios Activos</h2>
                    <br></br>
                    {activeChannels.length > 0 ?
                        <div className="handymen-grid" style={{ minHeight: "fit-content" }}>
                            {activeChannels.map((channel: ServiceRequest) => (
                                <ActiveServices key={channel._id} channel={channel} onReport={handleReport} />
                            ))}
                        </div>
                        :
                        <div className="no-service-message" style={{ height: 150 }}>
                            <p>No hay un servicio activo actualmente.</p>
                        </div>
                    }
                </div>
                {
                    inactiveChannels.length > 0 &&
                    <div>
                        <br></br>
                        <h2 className="text-center">Servicios Inactivos</h2>
                        <br></br>
                        <div className="handymen-grid" style={{ minHeight: "fit-content" }}>
                            {inactiveChannels.map((channel: ServiceRequest) => (
                                <ActiveServices key={channel._id} channel={channel} onReport={handleReport} />
                            ))}
                        </div>
                    </div>
                }
            </div>
            <ReportPopup
                isOpen={showReportInput}
                onClose={() => setShowReportInput(false)}
                reportedUserId={reportedUserID}
                reportedUserName={reportedUserName}
            />
        </div >
    );
}