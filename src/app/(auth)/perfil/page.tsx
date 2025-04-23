'use client'
import React from "react";
import Image from "next/image";
import { FaTrashAlt } from "react-icons/fa"
import { useAppContext } from 'app/context';

export default function Profile() {
    const { thirdWebData, currentUser } = useAppContext();
    return (
        <div className="profile-container">
            <h1 className="title">Mi Perfil</h1>
            <div className="main-content">
                <div className="left-container">
                    <div className="profile-info">
                        {thirdWebData?.picture &&
                            <Image
                                src={thirdWebData.picture}
                                alt="Profile"
                                className="rounded-full border border-gray-300"
                                width={96}
                                height={96}
                            />
                        }
                        <div className="profile-details">
                            <div className="profile-item-row">
                                <div className="profile-item">
                                    <label>Nombre Completo</label>
                                    <span>{currentUser?.name}</span>
                                </div>
                                <div className="profile-item">
                                    <label>Correo Electrónico</label>
                                    <span>{currentUser?.email}</span>
                                </div>
                            </div>
                            <div className="profile-item">
                                <label>Número de Teléfono</label>
                                <span>{currentUser?.phone}</span>
                            </div>
                            <div className="profile-item-row">
                                <div className="profile-item">
                                    <label>Municipio</label>
                                    <span>{currentUser?.municipality}</span>
                                </div>
                                <div className="profile-item">
                                    <label>Barrio</label>
                                    <span>{currentUser?.neighborhood}</span>
                                </div>
                            </div>
                            <div className="profile-item">
                                <label>Dirección</label>
                                <span>{currentUser?.address}</span>
                            </div>
                        </div>
                        <button className="dark-green-btn">Editar Perfil</button>
                    </div>
                </div>
                <div className="right-container">
                    <div className="preferences-container profile-item">
                        <label>Preferencias de Trabajadores</label>
                        <ul>
                            {currentUser?.skills.map((skill, index) => (
                                <li key={index} className="preference-item">
                                    <span>{skill.skillName}</span>
                                    <button>
                                        <FaTrashAlt className="green-icons" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button className="dark-green-btn">Añadir Trabajo</button>
                    </div>
                </div>
            </div>
        </div>
    );
}