import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { HandymanCardProps } from 'app/interfaces';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HandymanCard({ handymanData }: HandymanCardProps) {

    const filledStars = Math.floor(handymanData.rating);
    const emptyStars = 5 - filledStars;
    const slug = handymanData._id;

    const maxSkillsToShow = 3;
    const displayedSkills = handymanData.skills.slice(0, maxSkillsToShow);
    const remainingSkills = handymanData.skills.length - maxSkillsToShow;

    return (
        <Link
            href={`/handyman/${slug}`}
            className="handymanCard"
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
            <div className="w-full mt-4 text-center">
                <div className="text-sm font-medium text-gray-600 mb-2">Habilidades:</div>
                <div className="flex flex-wrap justify-center gap-1">
                    {displayedSkills.map((skill, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-gray-200 rounded text-gray-700 text-xs truncate max-w-[80px]"
                        >
                            {skill.skillName}
                        </span>
                    ))}
                    {remainingSkills > 0 && (
                        <span className="px-2 py-1 bg-gray-300 rounded text-gray-600 text-xs">
                            +{remainingSkills} más
                        </span>
                    )}
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
                <span className="ml-2 text-sm text-gray-500">({handymanData.totalRatings} votos)</span>
            </div>
        </Link>
    );
}
