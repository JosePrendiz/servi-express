"use client";
import React, { useEffect, useState } from 'react';
import { useAppContext } from 'app/context';
import Image from 'next/image';
import { RoleChangeData, HandymanConvertionErrors, Skill } from 'app/interfaces';
import { clientsAPI, skillsAPI } from 'app/axios';
interface RegisterPopupProps { closeModal: () => void; }

export default function ConvertClientPopup({ closeModal }: RegisterPopupProps) {

    const [trabajos, setTrabajos] = useState([]);

    const { currentUser } = useAppContext();

    const [userData, setUserData] = useState<RoleChangeData>();
    const [validationErrors, setValidationErrors] = useState<HandymanConvertionErrors>({
        personalDescription: false,
    });

    const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors = {
            personalDescription: !userData?.personalDescription,
        };
        setValidationErrors(errors);
        if (Object.values(errors).includes(true)) {
            return;
        }
        try {
            await clientsAPI.changeClientRole(userData)
            window.location.href = '/perfil'
        } catch (error) {
            console.error(error);

        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await skillsAPI.getAllSkills();
                setTrabajos(response || []);
                const skillsName: string[] = []
                currentUser?.preferences.forEach(element => {
                    skillsName.push(element.skillName)
                });
                setUserData({
                    skills: skillsName,
                    personalDescription: "",
                    coverageArea: [currentUser?.municipality as string]
                })
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleClose}
        >
            <div className={`bg-white p-6 rounded-2xl w-250`}
                style={{
                    border: '2px solid #ADADAD',
                }}>
                <h2 className="text-center" style={{ color: "#000000" }}>
                    Convertirme en Handyman
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-4 form-input">
                    {/* Profile Picture */}
                    <div className="flex justify-center mb-4">
                        <Image
                            src={currentUser?.profilePicture as string}
                            alt="Profile"
                            className="rounded-full border border-gray-300"
                            width={96}
                            height={96}
                        />
                    </div>
                    {/* Form Fields */}
                    <label>
                        Sobre mí:
                        <textarea
                            className={`w-full border text-black p-2 rounded ${validationErrors.personalDescription ? 'border-red-500' : 'border-gray-300'}`}
                            value={userData?.personalDescription}
                            placeholder="Descripción"
                            onChange={(e) => {
                                setUserData((prevState) => {
                                    if (!prevState) {
                                        return undefined;
                                    }
                                    return {
                                        ...prevState,
                                        personalDescription: e.target.value,
                                    };
                                });
                            }}
                            rows={4}
                            style={{ resize: 'vertical' }}
                        />
                    </label>
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {trabajos.map((profession: Skill) => (
                                <div
                                    key={profession.skillName}
                                    onClick={() => setUserData((prevState) => {
                                        if (!prevState) {
                                            return undefined;
                                        }
                                        const skills = prevState?.skills || [];
                                        if (skills.includes(profession.skillName)) {
                                            return {
                                                ...prevState,
                                                skills: skills.filter((item) => item !== profession.skillName),
                                            };
                                        } else {
                                            return {
                                                ...prevState,
                                                skills: [...skills, profession.skillName],
                                            };
                                        }
                                    })}
                                    className={`selector-item ${userData?.skills?.includes(profession.skillName) ? 'selected' : ''}`}
                                >
                                    {profession.skillName}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex space-x-4" style={{ justifyContent: 'center' }}>
                        <div className="w-1/2 flex justify-center">
                            <button
                                type="submit"
                                className="semiround-green-button"
                            >
                                Convertir
                            </button>
                        </div>
                        <div className="w-1/2 flex justify-center">
                            <button onClick={closeModal} className="semiround-green-button">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}