'use client';
import React, { useEffect, useState } from "react";
import { useAppContext } from 'app/context';
import { serviceAPI } from 'app/axios';
import ActiveServices from "@/components/service/serviceCard";
import { ServiceRequest } from "app/interfaces";

export default function Chats() {

    const { currentUser } = useAppContext();

    const [activeChannels, setActiveChannels] = useState<ServiceRequest[]>([]);
    const [inactiveChannels, setInactiveChannels] = useState<ServiceRequest[]>([]);

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
                <h2 className="text-center">Servicios Activos</h2>
                {activeChannels.length > 0 ?
                    <div className="handymen-grid">
                        {activeChannels.map((channel: ServiceRequest) => (
                            <ActiveServices key={channel._id} channel={channel} />
                        ))}
                    </div>
                    :
                    <div className="no-service-message" style={{ height: 150 }}>
                        <p>No hay un servicio activo actualmente.</p>
                    </div>
                }
            </div>

            {/* Inactive Services Section */}
            {
                inactiveChannels.length > 0 &&
                <div className="services-container">
                    <h2 className="text-center">Servicios Inactivos</h2>
                    <div className="handymen-grid">
                        {inactiveChannels.map((channel: ServiceRequest) => (
                            <ActiveServices key={channel._id} channel={channel} />
                        ))}
                    </div>
                </div>
            }
        </div >
    );
}