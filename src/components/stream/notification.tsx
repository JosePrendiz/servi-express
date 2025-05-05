import React, { useEffect, useState } from 'react';
import { ServiceRequest } from 'app/interfaces';
import { useAppContext } from 'app/context';
import { StreamChat } from 'stream-chat';
import { FaBell } from 'react-icons/fa';
import { serviceAPI } from 'app/axios';
import './chatStyles.css';

export default function ChatNotification() {
    const client = new StreamChat("xevpw6wvqw5s");
    const [notification, setNotification] = useState<boolean>(false);

    const { currentUser, chatToken } = useAppContext();

    const trackChannel = async (channelId: string) => {
        const channel = client.channel("messaging", channelId);
        await channel.watch();
        channel.off("message.new", () => { });
        channel.on("message.new", () => {
            setNotification(true);
        });
    };

    const fetchAndTrackChannels = async () => {
        const unreadMessage = await client.getUnreadCount(currentUser?._id as string);
        if (currentUser?.role === 'handyman') {
            const channels = await serviceAPI.getHandymanRequests();
            channels.forEach((channelData: ServiceRequest) => {
                trackChannel(`request-${channelData._id}`);
                const targetChannel = unreadMessage.channels.find(
                    (ch) => ch.channel_id === `messaging:request-${channelData._id}`
                );
                if ((targetChannel?.unread_count ?? 0) > 0) {
                    setNotification(true);
                }
            });
        } else if (currentUser?.role === 'client') {
            const channels = await serviceAPI.getClientRequests();
            channels.forEach((channelData: ServiceRequest) => {
                trackChannel(`request-${channelData._id}`);
                const targetChannel = unreadMessage.channels.find(
                    (ch) => ch.channel_id === `messaging:request-${channelData._id}`
                );
                if ((targetChannel?.unread_count ?? 0) > 0) {
                    setNotification(true);
                }
            });
        }
    };

    useEffect(() => {
        const initClient = async () => {
            if (!client.userID) {
                await client.connectUser(
                    { id: currentUser?._id as string, name: currentUser?.name },
                    chatToken
                );
            }

            client.on("notification.added_to_channel", async () => {
                setNotification(true);
                await fetchAndTrackChannels();
            });

            await fetchAndTrackChannels();
        };

        initClient();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            {notification ? (
                <FaBell className="text-golden text-2xl animate-bounce" />
            ) : (
                <FaBell className="text-gray-400 text-2xl" />
            )}
        </div>
    );
}
