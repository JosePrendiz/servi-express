"use client";
import React, { useEffect, useState } from 'react';
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client } from '../../app/client';
import { useAppContext } from 'app/context';
import Image from 'next/image';
import { municipalities } from 'app/locations';
import { RegisterHandymanData, HandymanFormErrors } from 'app/interfaces';
interface RegisterPopupProps {
    closeModal: () => void;
    isConnected: boolean;
}

export default function RegisterHandymanPopup({ closeModal, isConnected }: RegisterPopupProps) {

    const { registerHandymanData, thirdWebData, setRegisterHandymanData } = useAppContext();

    const [userData, setUserData] = useState<RegisterHandymanData | null>(null);
    const [registerStage, setRegisterStage] = useState<string>('baseData');
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<HandymanFormErrors>({
        termsAccepted: false,
        familyName: false,
        givenName: false,
        description: false,
    });

    const trabajos = [
        "Reparación de fontanería",
        "Instalación de electrodomésticos",
        "Pintura y decoración",
        "Reparación de electrodomésticos",
        "Reparación de techos",
        "Montaje de muebles",
        "Instalación de pisos",
        "Electricidad (instalación y reparación)",
        "Jardinería y mantenimiento de exteriores",
        "Reparación de ventanas y puertas",
        "Carpintería",
        "Instalación de sistemas de seguridad",
        "Plomería",
        "Sistemas de climatización",
        "Reparación de tejados",
        "Mantenimiento general",
        "Desmontaje y montaje de interiores",
        "Instalación de cerámica y azulejos",
        "Reparación de sistemas de calefacción",
        "Servicios de albañilería"
    ];

    const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };
    const activeAccount = useActiveAccount();
    const thirdWebLogins = [
        inAppWallet({
            auth: {
                options: ["google"],
            },
        }),
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors = {
            termsAccepted: !termsAccepted,
            familyName: !userData?.familyName,
            givenName: !userData?.givenName,
            description: !userData?.description,
        };
        setValidationErrors(errors);
        if (Object.values(errors).includes(true)) {
            return;
        }
        setRegisterHandymanData(userData)
        setRegisterStage('preferredJobs')
    };

    const handleJobs = () => {
        setRegisterStage('workZones')
        setRegisterHandymanData(userData)
    };

    useEffect(() => {
        if (registerStage !== 'workZones') {
            if (registerHandymanData) {
                setUserData(registerHandymanData)
                setRegisterStage('preferredJobs')
            } else {
                setUserData({
                    ...thirdWebData,
                    trabajosDisponibles: [],
                    zonasDisponibles: [],
                    municipio: '',
                    description: '',
                    phoneNumber: '',
                    source: '',
                } as RegisterHandymanData);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeAccount, isConnected, registerHandymanData]);

    return (
        <div
            className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleClose}
        >
            <div className={`bg-white p-6 rounded-2xl ${registerStage === 'baseData' ? 'w-100' : 'w-250'}`}
                style={{
                    border: '2px solid #ADADAD',
                }}>
                <h2 className="text-center" style={{ color: "#000000" }}>
                    {isConnected && userData ? "Registrarme como Trabajador" : "Registrarse en ServiExpress"}
                </h2>
                {(!isConnected || !activeAccount) && (
                    <div className="flex justify-center mt-6">
                        <p className="text-center mt-4" style={{ color: "#6B6868" }}>
                            Crea una cuenta con Google
                        </p>
                        <ConnectButton
                            client={client}
                            wallets={thirdWebLogins}
                            theme={"dark"}
                            connectModal={{ size: "wide" }}
                            connectButton={{ label: "Iniciar Sesión con Google" }}
                        />
                    </div>
                )}
                {registerStage === 'baseData' && (activeAccount || isConnected) && userData && (
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-4 form-input">
                        {/* Profile Picture */}
                        <div className="flex justify-center mb-4">
                            <Image
                                src={userData.picture}
                                alt="Profile"
                                className="rounded-full border border-gray-300"
                                width={96}
                                height={96}
                            />
                        </div>
                        {/* Form Fields */}
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label>
                                    Nombre:
                                    <input
                                        type="text"
                                        className={`w-full border p-2 rounded ${validationErrors.givenName ? 'border-red-500' : 'border-gray-300'}`}
                                        value={userData.givenName}
                                        placeholder="Nombre"
                                        onChange={(e) => {
                                            setUserData((prevState) => {
                                                if (!prevState) {
                                                    return null;
                                                }
                                                return {
                                                    ...prevState,
                                                    givenName: e.target.value,
                                                };
                                            });
                                        }}
                                    />
                                </label>
                            </div>
                            <div className="w-1/2">
                                <label>
                                    Apellido:
                                    <input
                                        type="text"
                                        className={`w-full border p-2 rounded ${validationErrors.familyName ? 'border-red-500' : 'border-gray-300'}`}
                                        value={userData.familyName}
                                        placeholder="Apellido"
                                        onChange={(e) => {
                                            setUserData((prevState) => {
                                                if (!prevState) {
                                                    return null;
                                                }
                                                return {
                                                    ...prevState,
                                                    familyName: e.target.value,
                                                };
                                            });
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                        <label>
                            Email:
                            <input
                                type="email"
                                className="w-full border border-gray-300 p-2 rounded bg-gray-100"
                                value={userData.email}
                                readOnly
                            />
                        </label>
                        <label>
                            Teléfono:
                            <input
                                type="tel"
                                className={`w-full border p-2 rounded 'border-gray-300`}
                                placeholder="Número de Teléfono"
                                value={userData.phoneNumber}
                                onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    input.value = input.value.replace(/\D/g, '');
                                }}
                                onChange={(e) => {
                                    setUserData((prevState) => {
                                        if (!prevState) {
                                            return null;
                                        }
                                        return {
                                            ...prevState,
                                            phoneNumber: e.target.value,
                                        };
                                    });
                                }}
                                pattern="^\d{8}$"
                                title="El número debe tener 8 dígitos."
                            />
                        </label>
                        <label>
                            Sobre mí:
                            <textarea
                                className={`w-full border text-black p-2 rounded ${validationErrors.description ? 'border-red-500' : 'border-gray-300'}`}
                                value={userData.description}
                                placeholder="Descripción"
                                onChange={(e) => {
                                    setUserData((prevState) => {
                                        if (!prevState) {
                                            return null;
                                        }
                                        return {
                                            ...prevState,
                                            description: e.target.value,
                                        };
                                    });
                                }}
                                rows={4}
                                style={{ resize: 'vertical' }}
                            />
                        </label>
                        <label>
                            ¿Cómo conociste la plataforma?
                            <select
                                className="w-full border border-gray-300 p-2 rounded"
                                value={userData.source}
                                onChange={(e) => {
                                    setUserData((prevState) => {
                                        if (!prevState) {
                                            return null;
                                        }
                                        return {
                                            ...prevState,
                                            source: e.target.value,
                                        };
                                    });
                                }}
                            >
                                <option value="">Seleccionar</option>
                                <option value="Redes Sociales">Redes Sociales</option>
                                <option value="Amigos">Amigos</option>
                                <option value="Familiares">Familiares</option>
                                <option value="Publicidad">Publicidad</option>
                                <option value="Otros">Otros</option>
                            </select>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                            />
                            Acepto los términos y condiciones de ServiExpress.
                        </label>
                        <div className="flex space-x-4" style={{ justifyContent: 'center' }}>
                            <div className="w-1/2 flex justify-center">
                                <button
                                    type="submit"
                                    className="semiround-green-button"
                                    disabled={!termsAccepted}
                                >
                                    Registrar
                                </button>
                            </div>
                            <div className="w-1/2 flex justify-center">
                                <button
                                    className="semiround-green-button"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                )}
                {registerStage === 'preferredJobs' && <div className='form-input'>
                    <div className="flex justify-center mb-4">
                        {registerHandymanData && (
                            <Image
                                src={registerHandymanData.picture}
                                alt="Profile"
                                className="rounded-full border border-gray-300"
                                width={96}
                                height={96}
                            />
                        )}
                    </div>

                    <div className="text-center mb-6">
                        {registerHandymanData?.name && (
                            <h2 className="text-lg font-semibold">{registerHandymanData.name}</h2>
                        )}
                        <p className="mt-2 text-gray-600">¡Continua el registro! Selecciona tus áreas de trabajo:</p>
                        <p className="text-gray-600">Selecciona al menos una:</p>
                    </div>

                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {trabajos.map((profession) => (
                                <div
                                    key={profession}
                                    onClick={() => setUserData((prevState) => {
                                        if (!prevState) {
                                            return null;
                                        }
                                        const trabajosDisponibles = prevState?.trabajosDisponibles || [];
                                        if (trabajosDisponibles.includes(profession)) {
                                            return {
                                                ...prevState,
                                                trabajosDisponibles: trabajosDisponibles.filter((item) => item !== profession),
                                            };
                                        } else {
                                            return {
                                                ...prevState,
                                                trabajosDisponibles: [...trabajosDisponibles, profession],
                                            };
                                        }
                                    })}
                                    className={`selector-item ${userData?.trabajosDisponibles?.includes(profession) ? 'selected' : ''}`}
                                >
                                    {profession}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center mt-6">
                        <button onClick={() => setRegisterStage('workZones')} className="semiround-green-button" disabled={userData?.trabajosDisponibles && userData?.trabajosDisponibles?.length < 1}>
                            Continuar
                        </button>
                    </div>
                </div>}
                {registerStage === 'workZones' && <div className='form-input'>
                    <div className="flex justify-center mb-4">
                        {registerHandymanData && (
                            <Image
                                src={registerHandymanData.picture}
                                alt="Profile"
                                className="rounded-full border border-gray-300"
                                width={96}
                                height={96}
                            />
                        )}
                    </div>

                    <div className="text-center mb-6">
                        {registerHandymanData?.name && (
                            <h2 className="text-lg font-semibold">{registerHandymanData.name}</h2>
                        )}
                        <p className="mt-2 text-gray-600">Finaliza el registro! Selecciona tus zonas de disponibilidad:</p>
                        <p className="text-gray-600">Selecciona al menos una:</p>
                    </div>

                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {municipalities.map((item) => (
                                <div
                                    key={item.municipality}
                                    onClick={() => setUserData((prevState) => {
                                        if (!prevState) {
                                            return null;
                                        }
                                        const trabajosDisponibles = prevState?.trabajosDisponibles || [];
                                        if (trabajosDisponibles.includes(item.municipality)) {
                                            return {
                                                ...prevState,
                                                trabajosDisponibles: trabajosDisponibles.filter((item) => item !== item),
                                            };
                                        } else {
                                            return {
                                                ...prevState,
                                                trabajosDisponibles: [...trabajosDisponibles, item.municipality],
                                            };
                                        }
                                    })}
                                    className={`selector-item ${userData?.trabajosDisponibles?.includes(item.municipality) ? 'selected' : ''}`}
                                >
                                    {item.municipality}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center mt-6">
                        <button onClick={() => handleJobs()} className="semiround-green-button" disabled={userData?.trabajosDisponibles && userData?.trabajosDisponibles?.length < 1}>
                            Registrar
                        </button>
                    </div>
                </div>}

            </div>
        </div>
    );
}