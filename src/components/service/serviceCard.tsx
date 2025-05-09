'use client';
import React, { useEffect, useState } from 'react';
import { ServiceRequest } from 'app/interfaces';
import { useAppContext } from 'app/context';
import { StreamChat } from 'stream-chat';

const ActiveServices = ({ channel, onReport }: { channel: ServiceRequest, onReport: (userID: string, userName: string) => void; }) => {

    const { currentUser, chatToken } = useAppContext();
    const client = new StreamChat("6ksqur8952g5");

    const [newMessage, setNewMessage] = useState(false)

    const getNewMessages = async () => {
        if (!client.userID) {
            await client.connectUser(
                { id: currentUser?._id as string, name: currentUser?.name },
                chatToken
            );
        }
        const unreadMessage = await client.getUnreadCount(currentUser?._id as string);
        const targetChannel = unreadMessage.channels.find(
            (ch) => ch.channel_id === `messaging:request-${channel._id}`
        );
        setNewMessage((targetChannel?.unread_count ?? 0) > 0);
    }

    const markAsRead = async () => {
        if (!client.userID) {
            await client.connectUser(
                { id: currentUser?._id as string, name: currentUser?.name },
                chatToken
            );
        }
        const streamChannel = client.channel('messaging', `request-${channel._id}`);
        await streamChannel.watch();
        await streamChannel.markRead();
        if (['rejected', 'completed', 'expired', 'cancelled'].includes(channel.status)) {
            window.location.href = `/detalles/${channel._id}`;
            return;
        }
        if (currentUser?.role === 'handyman') {
            window.location.href = `/client/${channel.clientId._id}`;
        } else if (currentUser?.role === 'client') {
            window.location.href = `/handyman/${channel.handymanId._id}`;
        }
    }

    const handleReport = () => {
        onReport(channel.clientId._id || channel.handymanId._id, channel.clientId.name || channel.handymanId.name)
    };

    useEffect(() => {
        if (chatToken) {
            getNewMessages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatToken])

    return (
        <div
            key={channel._id}
            className={`service-card ${['rejected', 'completed', 'expired', 'cancelled'].includes(channel.status)
                ? 'inactive-service'
                : 'active-service'
                }`}
            onClick={markAsRead}
        >
            {newMessage && (
                <p style={{ color: 'red', cursor: 'pointer' }}>
                    Nuevos Mensajes!!!
                </p>
            )}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{channel.title}</h3>
            <p className="text-sm text-gray-500 mb-5">{channel.description}</p>
            <div className="text-sm text-gray-700 space-y-2">
                {currentUser?.role === 'client' ?
                    <p>
                        <span className="font-semibold">Handyman:</span> {channel.handymanId.name} {channel.handymanId.lastName}
                    </p>
                    : currentUser?.role === 'handyman' &&
                    <p>
                        <span className="font-semibold">Cliente:</span> {channel.clientId.name} {channel.clientId.lastName}
                    </p>

                }

                <p>
                    <span className="font-semibold">Email:</span> {channel.clientId.email || channel.handymanId.email}
                </p>
                <p>
                    <span className="font-semibold">Ubicación:</span>{' '}
                    {`${channel.location.municipality}, ${channel.location.neighborhood}, ${channel.location.address}`}
                </p>
                {!(['rejected', 'completed', 'expired', 'cancelled'].includes(channel.status)) &&
                    <p>
                        <span className="font-semibold">Tarea Expira:</span>{' '}
                        {new Date(channel.expiresAt).toLocaleDateString()}
                    </p>
                }
                {channel.categories.length > 0 && (
                    <p>
                        <span className="font-semibold">Categoría:</span> {channel.categories[0].skillName}
                    </p>
                )}
                <p>
                    <span className="font-semibold">Status:</span> {channel.status}
                </p>
            </div>
            <button className="report-button"
                onClick={(e) => {
                    e.stopPropagation();
                    handleReport();
                }}
            >
                {currentUser?.role === 'client' ? 'Reportar Handyman' : 'Reportar Cliente'}
            </button>
        </div>
    );
};

export default ActiveServices;
