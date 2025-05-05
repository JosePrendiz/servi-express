import React, { useEffect, useState, useRef } from 'react';
import { StreamChat, Channel } from 'stream-chat';
import { useAppContext } from 'app/context';
import Loading from '../loader';
import './chatStyles.css';
import serviExpressLogo from '@/assets/servi-express-logo-mini.png';
import Image from 'next/image';

const client = new StreamChat("xevpw6wvqw5s");
interface Message {
    id: string;
    text: string;
    user: {
        id: string;
        name: string;
        image: string;
    };
    created_at: string;
}

export default function CustomStreamChat({ channelId }: { channelId: string }) {
    const { currentUser, chatToken } = useAppContext();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [channel, setChannel] = useState<Channel | null>(null);
    const [loading, setLoading] = useState(true);

    const messageListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const initChat = async () => {
            try {
                await client.connectUser(
                    { id: currentUser?._id as string, name: currentUser?.name },
                    chatToken
                );

                const channel = client.channel("messaging", channelId);
                await channel.watch();
                setChannel(channel);

                setMessages(channel.state.messages as unknown as Message[]);

                channel.on("message.new", (event) => {
                    setMessages((prevMessages) => [...prevMessages, event.message] as unknown as Message[]);
                });
            } catch (error) {
                console.error("Error initializing chat:", error);
            } finally {
                setLoading(false);
            }
        };
        if (chatToken) {
            initChat();
        }
    }, [channelId, currentUser, chatToken]);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            // Send message to the channel
            await channel?.sendMessage({
                text: newMessage,
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    if (loading) return <Loading message="Cargando Chat" />;

    return (
        <div className="custom-chat-container">
            <div className="message-list">
                {messages.map((msg) => {
                    const isSystemMessage = !msg.user.name;
                    const isMyMessage = msg.user.id === currentUser?._id;

                    return (
                        <div
                            key={msg.id}
                            className={`message ${isSystemMessage
                                ? 'system-message'
                                : isMyMessage
                                    ? 'my-message'
                                    : 'other-message'
                                }`}
                        >
                            {!isSystemMessage && (
                                <Image
                                    src={msg.user.image || serviExpressLogo}
                                    alt={msg.user.name || 'Sistema'}
                                    width={36}
                                    height={36}
                                    className="rounded-full"
                                />
                            )}
                            <div>
                                {!isSystemMessage && <div className="message-user">{msg.user.name}</div>}
                                <div className="message-text">{msg.text}</div>
                                {msg.user.name &&
                                    <div className="message-time">
                                        {new Date(msg.created_at).toLocaleTimeString()}
                                    </div>
                                }
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                    placeholder="Escribe tu mensaje..."
                />
                <button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    Enviar
                </button>
            </div>
        </div>
    );
}
