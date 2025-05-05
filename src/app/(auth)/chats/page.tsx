'use client';
import React, { useEffect, useState } from "react";
import { useAppContext } from 'app/context';
import { serviceAPI } from 'app/axios';
import ActiveServices from "@/components/service/serviceCard";
import { ServiceRequest } from "app/interfaces";

export default function Chats() {

    const { currentUser } = useAppContext();

    const [channels, setChannels] = useState([]);

    const fetchAndTrackChannels = async () => {
        if (currentUser?.role === 'handyman') {
            const channels = await serviceAPI.getHandymanRequests();
            setChannels(channels);
        } else if (currentUser?.role === 'client') {
            const channels = await serviceAPI.getClientRequests();
            setChannels(channels);
        }
    };

    useEffect(() => {
        fetchAndTrackChannels()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])

    return (
        <div>
            <div className="services-container">
                <h2 className="text-center">Servicios Activos</h2>
                <div className="handymen-grid">
                    {channels.map((channel: ServiceRequest) => (
                        <ActiveServices key={channel._id} channel={channel} />
                    ))}
                </div>
            </div >
        </div >
    );
}