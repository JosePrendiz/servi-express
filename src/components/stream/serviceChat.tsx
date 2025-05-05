import serviExpressLogo from '@/assets/servi-express-logo-mini.png';
import React, { useEffect, useState, useRef } from 'react';
import { StreamChat, Channel } from 'stream-chat';
import { useAppContext } from 'app/context';
import { Message } from 'app/interfaces';
import Loading from '../loader';
import Image from 'next/image';
import './chatStyles.css';
import { quotationAPI, serviceAPI } from 'app/axios';
import UserActions from './userActions';
import PayPalPayment from '../paypal/payment';

const client = new StreamChat("xevpw6wvqw5s");

export default function CustomStreamChat({ channelId }: { channelId: string }) {
    const { currentUser, chatToken } = useAppContext();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [channel, setChannel] = useState<Channel | null>(null);
    const [loading, setLoading] = useState(true);
    const [quotationAmount, setQuotationAmount] = useState<string>('');

    const messageListRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await channel?.sendMessage({
                text: newMessage,
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleAcceptRequest = async () => {
        try {
            await serviceAPI.handymanAcceptRequests((channel?.data?.id as string).split('-')[1])
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    const handleCancelRequest = async () => {
        try {
            await serviceAPI.handymanRejectRequests((channel?.data?.id as string).split('-')[1])
        } catch (error) {
            console.error("Error canceling request:", error);
        }
    };

    const handleAcceptQuote = async () => {
        try {
            await quotationAPI.clientAcceptQuote(channel?.data?.quotationId as string)
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    const handleCancelQuote = async () => {
        try {
            await quotationAPI.clientRejectQuote(channel?.data?.quotationId as string)
        } catch (error) {
            console.error("Error canceling request:", error);
        }
    };

    const handleCreateQuotation = async () => {
        if (!quotationAmount.trim()) return;
        try {
            await quotationAPI.createQuotation((channel?.data?.id as string).split('-')[1], parseFloat(quotationAmount));
            setQuotationAmount('');
        } catch (error) {
            console.error("Error creating quotation:", error);
        }
    };

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
                    console.log(channel);
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

    if (loading) return <Loading message="Cargando Chat" />;

    return (
        <div className="custom-chat-container">
            {currentUser?.role === 'handyman' && channel?.data?.requestStatus === 'pending' && (
                <UserActions
                    title="¿Aceptar esta solicitud?"
                    description="Por favor confirma si deseas aceptar o rechazar esta solicitud antes de continuar."
                    buttons={[
                        { label: "Aceptar", onClick: handleAcceptRequest, className: "accept-btn" },
                        { label: "Rechazar", onClick: handleCancelRequest, className: "cancel-btn" },
                    ]}
                />
            )}
            {currentUser?.role === 'client' && channel?.data?.requestStatus === 'rejected' && (
                <UserActions
                    title="Solicitud Rechazada"
                    description="Su solicitud fue rechazada por el handyman."
                    buttons={[
                        { label: "Aceptar", onClick: () => { window.location.reload(); }, className: "accept-btn" },
                    ]}
                />
            )}
            {currentUser?.role === 'handyman' && channel?.data?.requestStatus === 'rejected' && (
                <UserActions
                    title="Solicitud Rechazada"
                    description="Rechazaste la solicitud de este cliente."
                    buttons={[
                        { label: "Aceptar", onClick: () => { window.location.reload(); }, className: "accept-btn" },
                    ]}
                />
            )}
            {currentUser?.role === 'handyman' && channel?.data?.requestStatus === 'quoted' && (
                <UserActions
                    title="Cotización Enviada"
                    description="Esperando confirmación del cliente."
                    buttons={[

                    ]}
                />
            )}
            {currentUser?.role === 'client' && channel?.data?.requestStatus === 'quoted' && (
                <UserActions
                    title="Cotización Recibida"
                    description={`Costo sugerido por el Handyman: $${channel.data.quotationValue}`}
                    buttons={[
                        { label: "Aceptar", onClick: handleAcceptQuote, className: "accept-btn" },
                        { label: "Rechazar", onClick: handleCancelQuote, className: "cancel-btn" },
                    ]}
                />
            )}
            {currentUser?.role === 'client' && channel?.data?.requestStatus === 'invoiced' && (
                <PayPalPayment amount={channel.data.quotationValue as string} quotationId={channel.data.quotationId as string} />
            )}
            {currentUser?.role === 'handyman' && channel?.data?.requestStatus === 'accepted' && (
                <div className="quotation-section">
                    <h2>Crear Cotización</h2>
                    <div className="quotation-input-group">
                        <input
                            type="number"
                            value={quotationAmount}
                            onChange={(e) => setQuotationAmount(e.target.value)}
                            placeholder="Monto en USD"
                        />
                        <button onClick={handleCreateQuotation} disabled={!quotationAmount.trim()}>
                            Enviar Cotización
                        </button>
                    </div>
                </div>
            )}
            <div className="message-list" ref={messageListRef}>
                {messages.map((msg) => {
                    const isSystemMessage = !msg.user.name || msg.user.name === 'Servi Express';
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
                                <div className="message-text" dangerouslySetInnerHTML={{ __html: msg.text }} />
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
