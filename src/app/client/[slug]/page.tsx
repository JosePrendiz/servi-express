/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { usersAPI } from 'app/axios';
import { useAppContext } from 'app/context';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'next/image';
import { ClientData } from 'app/interfaces';
import Loading from '@/components/loader';
import StreamChat from '@/components/stream/serviceChat';

export default function ClientProfile() {
    const { currentUser } = useAppContext();

    const { slug } = useParams();

    const [client, setClient] = useState<ClientData | null>(null);
    const [currentService, setCurrentService] = useState<string | null>(null);

    const getClient = async () => {
        try {
            const response = await usersAPI.getAnyUser(slug as string);
            setClient(response);
            setCurrentService(response.requestId)
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (currentUser?.role === 'client') {
            window.location.href = '/'
        }
    }, [currentUser]);

    useEffect(() => {
        getClient();
    }, []);

    if (!client) {
        return <Loading message="Obteniendo datos, por favor espere..." />;
    }

    return (
        <div className="handyman-page-container">
            <div className="two-thirds-container">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                    <Image
                        src={client.profilePicture}
                        alt={client.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Name and Role */}
                <h1 className="text-2xl font-bold mt-4 text-black text-center">{client.name} {client.lastName}</h1>
                <p className="text-gray-700 mt-2">{client.personalDescription}</p>
                {/* Contact Info */}
                <div className="contact-row mt-4">
                    <a href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                        <FaWhatsapp className="mr-2" /> {client.phone}
                    </a>
                    <a href={`mailto:${client.email.toLowerCase()}`} target="_blank" className="contact-link">
                        <FaEnvelope className="mr-2" /> {client.email.toLowerCase()}
                    </a>
                </div>
                {/* Coverage Area */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Ubicación</h3>
                    <p className="flex items-center text-gray-700 mt-2">
                        <FaMapMarkerAlt className="mr-2" /> {client.municipality}, {client.neighborhood}, {client.address}
                    </p>
                </div>
                {/* Preferences */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Trabajadores Buscados</h3>
                    <div className="flex flex-wrap gap-2 mt-2 justify-around">
                        {client.preferences.map((skill: { skillName: string }, index: number) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                            >
                                {skill.skillName}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="one-third-container">
                {currentService ?
                    <StreamChat channelId={`request-${currentService}`} />
                    :
                    <div className="no-service-message">
                        <p>No hay un servicio activo con este cliente actualmente.</p>
                    </div>
                }
            </div>
        </div>
    );
}
