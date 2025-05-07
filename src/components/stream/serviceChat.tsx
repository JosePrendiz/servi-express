import serviExpressLogo from '@/assets/servi-express-logo-mini.png';
import { quotationAPI, serviceAPI, ratingAPI } from 'app/axios';
import React, { useEffect, useState, useRef } from 'react';
import { StreamChat, Channel } from 'stream-chat';
import PayPalPayment from '../paypal/payment';
import { useAppContext } from 'app/context';
import { Message } from 'app/interfaces';
import UserActions from './userActions';
import Loading from '../loader';
import Image from 'next/image';
import './chatStyles.css';
import Link from 'next/link';

const client = new StreamChat("xevpw6wvqw5s");

export default function CustomStreamChat({ channelId }: { channelId: string }) {
    const { currentUser, chatToken } = useAppContext();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [channel, setChannel] = useState<Channel | null>(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [enableRating, setEnableRating] = useState(true);
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

    const handleCreateQuotation = async () => {
        if (!quotationAmount.trim()) return;
        try {
            await quotationAPI.createQuotation((channel?.data?.id as string).split('-')[1], parseFloat(quotationAmount));
            setQuotationAmount('');
        } catch (error) {
            console.error("Error creating quotation:", error);
        }
    };

    const setHandymanRating = async (star: number) => {
        setRating(star);
        setEnableRating(false);
        await ratingAPI.rateHandyman(channel?.data?.handymanId as string, star);
    }

    const handleCompleteService = async () => {
        try {
            await serviceAPI.completeRequest((channel?.data?.id as string).split('-')[1])
        } catch (error) {
            console.error("Error creating quotation:", error);
        }
    };

    const hasChannel = useRef(false);

    useEffect(() => {
        const initChat = async () => {
            hasChannel.current = true;
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
                    // console.log(channel);
                });
            } catch (error) {
                console.error("Error initializing chat:", error);
            } finally {
                setLoading(false);
            }
        };
        if (chatToken && !hasChannel.current) {
            initChat();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatToken]);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    if (loading) return <Loading message="Cargando Chat" />;

    return (
        <div className="custom-chat-container">
            <UserActions
                role={currentUser?.role as string}
                channel={channel as never}
            />
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
                        <button className='accept-btn' onClick={handleCreateQuotation} disabled={!quotationAmount.trim()}>
                            Enviar Cotización
                        </button>
                    </div>
                </div>
            )}
            {currentUser?.role === 'client' && channel?.data?.requestStatus === 'completed' && (
                <div className="quotation-section">
                    <h2 style={{ marginBottom: "0px" }}>Puntuar Servicio</h2>
                    <div className="stars-rating flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                disabled={!enableRating}
                                key={star}
                                onClick={() => setHandymanRating(star)}
                                className={`w-8 h-8 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-600" style={{ marginBottom: "10px" }}>
                        {rating > 0 ? `Gracias por calificar: ${rating} estrella(s)` : 'Selecciona una puntuación.'}
                    </p>
                    {!enableRating &&
                        <Link href={'/'} className='accept-btn'>
                            Cerrar
                        </Link>
                    }
                </div>
            )}
            {channel?.data?.requestStatus === 'payed' && ((currentUser?.role === 'handyman' && !channel?.data?.isHandymanCompleted) || (currentUser?.role === 'client' && !channel?.data?.isClientCompleted)) && (
                <div className="quotation-section">
                    <h2>Marcar Como Terminado</h2>
                    <div className="quotation-input-group">
                        <button className='accept-btn' style={{ margin: '0 auto' }} onClick={handleCompleteService}>
                            Servicio Completado
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
