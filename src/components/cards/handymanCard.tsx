import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { HandymanCardProps } from 'app/interfaces';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './cardStyle.css';

export default function HandymanCard({ handymanData }: HandymanCardProps) {

    const filledStars = Math.floor(handymanData.rating);
    const emptyStars = 5 - filledStars;
    const slug = handymanData._id;

    const maxSkillsToShow = 4;
    const displayedSkills = handymanData.skills.slice(0, maxSkillsToShow);
    const remainingSkills = handymanData.skills.length - maxSkillsToShow;

    return (
        <Link href={`/handyman/${slug}`} className="handymanCard">
            {/* Profile Image */}
            <div className="card-row image-row">
                <div className="image-container">
                    <Image
                        src={handymanData.profilePicture}
                        alt={handymanData.name}
                        width={96}
                        height={96}
                        className="image"
                    />
                </div>
            </div>

            {/* Name */}
            <div className="card-row name-row">
                <h3 className="name">{handymanData.name} {handymanData.lastName}</h3>
            </div>

            {/* Skills */}
            <div className="card-row skills-row">
                <div className="skills-title">Habilidades:</div>
                <div className="skills-list">
                    {displayedSkills.map((skill, index) => (
                        <span key={index} className="skill">
                            {skill.skillName}
                        </span>
                    ))}
                    {remainingSkills > 0 && (
                        <span className="skill more-skills">+{remainingSkills} más</span>
                    )}
                </div>
            </div>

            {/* Location */}
            <div className="card-row location-row">
                <div className="location-title">
                    <FaMapMarkerAlt className="location-icon" />
                    Cobertura:
                </div>
                <div className="location-list">
                    {handymanData.coverageArea.join(", ")}
                </div>
            </div>

            {/* Star Rating */}
            <div className="card-row rating-row">
                <div className="stars">
                    {Array.from({ length: filledStars }).map((_, index) => (
                        <FaStar key={index} className="star filled" />
                    ))}
                    {Array.from({ length: emptyStars }).map((_, index) => (
                        <FaStar key={filledStars + index} className="star empty" />
                    ))}
                </div>
                <span className="rating-text">({handymanData.totalRatings} votos)</span>
            </div>
        </Link>
    );
}
