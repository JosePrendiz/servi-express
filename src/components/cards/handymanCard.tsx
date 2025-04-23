import React from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { Skill } from 'app/interfaces';

interface HandymanData {
    averageRating: number;
    coverageArea: string[];
    email: string;
    lastName: string;
    name: string;
    personalDescription: string;
    phone: string;
    profilePicture: string;
    rating: number;
    skills: Skill[];
    totalRatings: number;
    weightedRating: number;
}

interface HandymanCardProps {
    handymanData: HandymanData;
}

export default function HandymanCard({ handymanData }: HandymanCardProps) {
    const filledStars = Math.floor(handymanData.rating);
    const emptyStars = 5 - filledStars;

    return (
        <div
            className="flex flex-col items-center p-4 rounded-lg shadow-md "
            style={{
                width: '300px',
                height: '350px',
                backgroundColor: '#D9D9D9',
            }}
        >
            {/* Profile Image */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white">
                <Image
                    src={handymanData.profilePicture}
                    alt={handymanData.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Name */}
            <h3>{handymanData.name}</h3>
            {/* Location */}
            <div className="flex items-center mt-2">
                <FaMapMarkerAlt className="text-lg mr-2" style={{ color: '#7D867E' }} />
                <p style={{ color: '#7D867E' }}>{handymanData.coverageArea.join(', ')}</p>
            </div>
            {/* Skills */}
            <div className="w-full mt-4">
                <div className="flex justify-center">
                    <span className="title-skills">Habilidades:</span>
                </div>
                <div className="flex flex-wrap mt-2" style={{ justifyContent: 'center' }}>
                    {handymanData.skills.map((skill, index) => (
                        <span key={index} className="value-skills" style={{ margin: '2px' }}>
                            {skill.skillName}
                            {index < handymanData.skills.length - 1 ? ',' : '.'}
                        </span>
                    ))}
                </div>
            </div>
            {/* Star Rating */}
            <div className="mt-auto flex items-center">
                {Array.from({ length: filledStars }).map((_, index) => (
                    <FaStar key={index} className="text-golden text-lg" style={{ color: 'goldenrod' }} />
                ))}
                {Array.from({ length: emptyStars }).map((_, index) => (
                    <FaStar key={filledStars + index} className="text-gray-400 text-lg" />
                ))}
                <span className="ml-2 text-sm text-gray-500">({handymanData.totalRatings} votes)</span>
            </div>
        </div>
    );
}
