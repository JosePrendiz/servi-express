'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Skill, UpdateClientData, UpdateHandymanData } from 'app/interfaces';
import { useAppContext } from 'app/context';
import { municipalities } from 'app/locations';
import { clientsAPI, handymenAPI, skillsAPI, usersAPI } from 'app/axios'
import Loading from "@/components/loader";

export default function Profile() {
    const { thirdWebData, currentUser, setCurrentUser } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [skills, setSkills] = useState([]);
    const [shownSkills, setShownSkills] = useState<string[]>(currentUser?.preferences?.map((pref) => pref.skillName) || []);
    const [coverageArea, setCoverageArea] = useState<string[]>(currentUser?.coverageArea || []);
    const [formData, setFormData] = useState({
        name: currentUser?.name,
        lastName: currentUser?.lastName,
        email: currentUser?.email,
        phone: currentUser?.phone,
        municipality: currentUser?.municipality,
        neighborhood: currentUser?.neighborhood,
        address: currentUser?.address,
        personalDescription: currentUser?.personalDescription,
    });

    const handleToggleSkill = (skillName: string) => {
        setShownSkills((prevSkills) => {
            if (prevSkills.includes(skillName)) {
                return prevSkills.filter((item) => item !== skillName);
            } else {
                return [...prevSkills, skillName];
            }
        });
    };

    const handleToggleCoverageArea = (municipality: string) => {
        setCoverageArea((prevArea) => {
            if (prevArea.includes(municipality)) {
                return prevArea.filter((item) => item !== municipality);
            } else {
                return [...prevArea, municipality];
            }
        });
    };

    const selectedMunicipality = municipalities.find(
        (item) => item.municipality === formData.municipality
    );

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            if (currentUser?.role === 'client') {
                const updatedUser: UpdateClientData = {
                    ...formData,
                    preferences: shownSkills,
                };
                delete updatedUser.personalDescription;
                const changedData: Partial<UpdateClientData> = {};
                Object.keys(updatedUser).forEach((key) => {
                    if (updatedUser[key] !== currentUser[key]) {
                        changedData[key as keyof UpdateClientData] = updatedUser[key];
                    }
                });
                if (Object.keys(changedData).length > 0) {
                    await clientsAPI.updateClientProfile(changedData, currentUser.email);
                    setIsEditing(false);
                }
            } else if (currentUser?.role === 'handyman') {
                const updatedUser: UpdateHandymanData = {
                    ...formData,
                    skills: shownSkills,
                    coverageArea: coverageArea,
                };
                delete updatedUser.municipality;
                delete updatedUser.neighborhood;
                delete updatedUser.address;
                const changedData: Partial<UpdateHandymanData> = {};
                Object.keys(updatedUser).forEach((key) => {
                    if (updatedUser[key] !== currentUser[key]) {
                        changedData[key as keyof UpdateHandymanData] = updatedUser[key];
                    }
                });
                if (Object.keys(changedData).length > 0) {
                    await handymenAPI.updateHandymanProfile(changedData, currentUser.email);
                    setIsEditing(false);
                }
            }
            const user = await usersAPI.getUserProfile()
            setCurrentUser(user);
        } catch (error) {
            console.error(error);
        }

    };

    const fetchSkills = async () => {
        try {
            const response = await skillsAPI.getAllSkills();
            setSkills(response || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (currentUser && isEditing && skills.length === 0) {
            fetchSkills();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, isEditing]);
    useEffect(() => {
        if (currentUser) {
            setIsClient(currentUser.role === 'client');
            setShownSkills(currentUser?.preferences?.map((pref) => pref.skillName) || currentUser?.skills?.map((skill) => skill.skillName) || []);
            setCoverageArea(currentUser.coverageArea || []);
            setFormData({
                name: currentUser.name || "",
                lastName: currentUser.lastName || "",
                email: currentUser.email || "",
                phone: currentUser.phone || "",
                municipality: currentUser.municipality || "",
                neighborhood: currentUser.neighborhood || "",
                address: currentUser.address || "",
                personalDescription: currentUser.personalDescription || "",
            });
        }
    }, [currentUser]);

    if (!currentUser) {
        return <Loading message="Obteniendo datos del usuario..." />;
    }

    return (
        <div className="profile-container">
            <h1 className="title">Mi Perfil</h1>
            <div className="main-content">
                <div className="left-container">
                    <div className="profile-info">
                        {thirdWebData?.picture && (
                            <Image
                                src={thirdWebData.picture}
                                alt="Profile"
                                className="rounded-full border border-gray-300"
                                width={96}
                                height={96}
                            />
                        )}
                        <div className="profile-details">
                            <div className="profile-item-row">
                                <div className="profile-item">
                                    <label>Nombre</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="input-field"
                                        />
                                    ) : (
                                        <span>{currentUser?.name}</span>
                                    )}
                                </div>
                                <div className="profile-item">
                                    <label>Apellido</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="input-field"
                                        />
                                    ) : (
                                        <span>{currentUser?.lastName}</span>
                                    )}
                                </div>
                            </div>
                            <div className="profile-item-row">
                                <div className="profile-item">
                                    <label>Email</label>
                                    <span>{currentUser?.email}</span>
                                </div>
                                <div className="profile-item">
                                    <label>Teléfono</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="input-field"
                                        />
                                    ) : (
                                        <span>{currentUser?.phone}</span>
                                    )}
                                </div>
                            </div>
                            {currentUser?.role === 'client' ? (
                                <>
                                    <div className="profile-item-row">
                                        <div className="profile-item">
                                            <label>Municipio</label>
                                            {isEditing ? (
                                                <select
                                                    className="select-dropdown"
                                                    name="municipality"
                                                    value={formData.municipality}
                                                    onChange={handleChange}
                                                >
                                                    {municipalities.map((item, index) => (
                                                        <option key={index} value={item.municipality}>
                                                            {item.municipality}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span>{currentUser?.municipality}</span>
                                            )}
                                        </div>
                                        <div className="profile-item">
                                            <label>Barrio</label>
                                            {isEditing ? (
                                                <select
                                                    name="neighborhood"
                                                    value={formData.neighborhood}
                                                    onChange={handleChange}
                                                    className="select-dropdown"
                                                >
                                                    {selectedMunicipality?.neighborhoods.map(
                                                        (neighborhood, index) => (
                                                            <option key={index} value={neighborhood}>
                                                                {neighborhood}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            ) : (
                                                <span>{currentUser?.neighborhood}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="profile-item">
                                        <label>Dirección</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="input-field"
                                            />
                                        ) : (
                                            <span>{currentUser?.address}</span>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="profile-item">
                                    <label>Descripción</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="personalDescription"
                                            value={formData.personalDescription}
                                            onChange={handleChange}
                                            className="input-field"
                                        />
                                    ) : (
                                        <span>{currentUser?.personalDescription}</span>
                                    )}
                                </div>
                            )}
                        </div>
                        <button
                            className="dark-green-btn"
                            onClick={isEditing ? handleSave : handleEditToggle}
                        >
                            {isEditing ? "Guardar Cambios" : "Editar Perfil"}
                        </button>
                    </div>
                </div>
                <div className="right-container">
                    {/* Skills Section */}
                    <div className="preferences-container profile-item">
                        <label>{isClient ? 'Preferencias de Trabajadores' : 'Trabajos Ofrecidos'}</label>
                        <div className="block-layout">
                            {isEditing ? (
                                skills.map((profession: Skill) => (
                                    <div
                                        key={profession.skillName}
                                        onClick={() => handleToggleSkill(profession.skillName)}
                                        className={`selector-item ${shownSkills.includes(profession.skillName) ? 'selected' : ''}`}
                                    >
                                        {profession.skillName}
                                    </div>
                                ))
                            ) : (
                                shownSkills.map((skill, index) => (
                                    <div key={index} className="block-item">{skill}</div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                {/* Coverage Area Section */}
                {currentUser?.role === 'handyman' && <div className="right-container">
                    <div className="preferences-container profile-item">
                        <label>Área de Cobertura</label>
                        <div className="block-layout">
                            {isEditing ? (
                                municipalities.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleToggleCoverageArea(item.municipality)}
                                        className={`selector-item ${coverageArea.includes(item.municipality) ? 'selected' : ''}`}
                                    >
                                        {item.municipality}
                                    </div>
                                ))
                            ) : (
                                coverageArea.map((area, index) => (
                                    <div key={index} className="block-item">{area}</div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                }
            </div>
        </div >
    );
}