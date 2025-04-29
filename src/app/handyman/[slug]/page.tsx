'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { usersAPI } from 'app/axios';
import { FaStar, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'next/image';
import { HandymanData } from 'app/interfaces';
import Loading from '@/components/loader';
import StartServiceRequest from '@/components/service/serviceRequest';

export default function HandymanProfile() {
    const { slug } = useParams();
    const [handyman, setHandyman] = useState<HandymanData | null>(null);

    const getHandyman = async () => {
        try {
            const response = await usersAPI.getAnyUser(slug as string);
            setHandyman(response);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getHandyman();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!handyman) {
        return <Loading message="Obteniendo datos, por favor espere..." />;
    }

    return (
        <div className="handyman-page-container">
            <div className="two-thirds-container">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                    <Image
                        src={handyman.profilePicture}
                        alt={handyman.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Name and Role */}
                <h1 className="text-2xl font-bold mt-4 text-black text-center">{handyman.name} {handyman.lastName}</h1>
                <p className="text-gray-700 mt-2">{handyman.personalDescription}</p>
                {/* Rating */}
                <div className="flex items-center mt-2">
                    {Array.from({ length: handyman.rating }).map((_, index) => (
                        <FaStar key={index} className="text-yellow-500" />
                    ))}
                    {Array.from({ length: 5 - handyman.rating }).map((_, index) => (
                        <FaStar key={index} className="text-gray-300" />
                    ))}
                </div>
                <p className="text-sm text-gray-600">({handyman.totalRatings} votos)</p>
                {/* Contact Info */}
                <div className="contact-row mt-4">
                    <a href={`https://wa.me/${handyman.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                        <FaWhatsapp className="mr-2" /> {handyman.phone}
                    </a>
                    <a href={`mailto:${handyman.email.toLowerCase()}`} target="_blank" className="contact-link">
                        <FaEnvelope className="mr-2" /> {handyman.email.toLowerCase()}
                    </a>
                </div>
                {/* Coverage Area */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Área de Covertura</h3>
                    <p className="flex items-center text-gray-700 mt-2">
                        <FaMapMarkerAlt className="mr-2" /> {handyman.coverageArea.join(', ')}
                    </p>
                </div>
                {/* Skills */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Habilidades</h3>
                    <div className="flex flex-wrap gap-2 mt-2 justify-around">
                        {handyman.skills.map((skill: { skillName: string }, index: number) => (
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
                <StartServiceRequest handyman={handyman} />
            </div>
        </div>
    );
}
