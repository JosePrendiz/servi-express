"use client";
import React, { useEffect, useState } from 'react';
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client } from '../../app/client';
import { useAppContext } from 'app/context';
import Image from 'next/image';
import { municipalities } from 'app/locations';
import { RegisterClientData, ClientFormErrors } from 'app/interfaces';
interface RegisterPopupProps {
    closeModal: () => void;
    isConnected: boolean;
}

export default function RegisterClientPopup({ closeModal, isConnected }: RegisterPopupProps) {

    const { registerClientData, thirdWebData, setRegisterClientData } = useAppContext();

    const [userData, setUserData] = useState<RegisterClientData | null>(null);
    const [registerStage, setRegisterStage] = useState<string>('baseData');
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<ClientFormErrors>({
        municipio: false,
        barrio: false,
        direccion: false,
        termsAccepted: false,
        familyName: false,
        givenName: false,
    });
    const selectedMunicipality = municipalities.find(
        (item) => item.municipality === userData?.municipio
    );

    const trabajadoresBuscados = [
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
            municipio: !userData?.municipio,
            barrio: !userData?.barrio,
            direccion: !userData?.direccion,
            termsAccepted: !termsAccepted,
            familyName: !userData?.familyName,
            givenName: !userData?.givenName,
        };
        setValidationErrors(errors);
        if (Object.values(errors).includes(true)) {
            return;
        }
        setRegisterClientData(userData)
        setRegisterStage('preferredJobs')
    };

    const handleComplete = () => {
        console.log('Final Register Data: ', userData);
    };

    useEffect(() => {
        if (registerClientData) {
            setUserData(registerClientData)
            setRegisterStage('preferredJobs')
        } else {
            setUserData({
                ...thirdWebData,
                trabajosBuscados: [],
                municipio: '',
                phoneNumber: '',
                direccion: '',
                barrio: '',
                source: '',
            } as RegisterClientData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeAccount, isConnected, registerClientData]);

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
                    {isConnected && userData ? "Completar Registro" : "Registrarse en ServiExpress"}
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
                {registerStage === 'baseData' ? <div>{(activeAccount || isConnected) && userData && (
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
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label>
                                    Municipio:
                                    <select
                                        className={`w-full border p-2 rounded ${validationErrors.municipio ? 'border-red-500' : 'border-gray-500'}`}
                                        value={userData.municipio}
                                        onChange={(e) => {
                                            setUserData((prevState) => {
                                                if (!prevState) {
                                                    return null;
                                                }
                                                return {
                                                    ...prevState,
                                                    municipio: e.target.value,
                                                    barrio: '',
                                                };
                                            });
                                        }}
                                    >
                                        <option value="" disabled>
                                            Seleccionar
                                        </option>
                                        {municipalities.map((item, index) => (
                                            <option key={index} value={item.municipality}>
                                                {item.municipality}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div className="w-1/2">
                                <label>
                                    Barrio:
                                    <select
                                        disabled={!userData.municipio}
                                        className={`w-full border p-2 rounded ${validationErrors.barrio ? 'border-red-500' : 'border-gray-500'}`}
                                        value={userData.barrio}
                                        onChange={(e) => {
                                            setUserData((prevState) => {
                                                if (!prevState) {
                                                    return null;
                                                }
                                                return {
                                                    ...prevState,
                                                    barrio: e.target.value,
                                                };
                                            });
                                        }}
                                    >
                                        <option value="" disabled>
                                            Seleccionar
                                        </option>
                                        {selectedMunicipality?.neighborhoods.map((neighborhood, index) => (
                                            <option key={index} value={neighborhood}>
                                                {neighborhood}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        </div>

                        <label>
                            Dirección de Domicilio:
                            <input
                                type="text"
                                className={`w-full border p-2 rounded ${validationErrors.direccion ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Descripción de la Vivienda"
                                value={userData.direccion}
                                onChange={(e) => {
                                    setUserData((prevState) => {
                                        if (!prevState) {
                                            return null;
                                        }
                                        return {
                                            ...prevState,
                                            direccion: e.target.value,
                                        };
                                    });
                                }}
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
                )}</div> :
                    <div className='form-input'>
                        <div className="flex justify-center mb-4">
                            {registerClientData && (
                                <Image
                                    src={registerClientData.picture}
                                    alt="Profile"
                                    className="rounded-full border border-gray-300"
                                    width={96}
                                    height={96}
                                />
                            )}
                        </div>

                        <div className="text-center mb-6">
                            {registerClientData?.name && (
                                <h2 className="text-lg font-semibold">{registerClientData.name}</h2>
                            )}
                            <p className="mt-2 text-gray-600">¡Estás a un paso de completar tu registro!</p>
                            <p className="text-gray-600">Selecciona los trabajos que te interesa contratar:</p>
                        </div>

                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {trabajadoresBuscados.map((profession) => (
                                    <div
                                        key={profession}
                                        onClick={() => setUserData((prevState) => {
                                            if (!prevState) {
                                                return null;
                                            }
                                            const trabajosBuscados = prevState?.trabajosBuscados || [];
                                            if (trabajosBuscados.includes(profession)) {
                                                return {
                                                    ...prevState,
                                                    trabajosBuscados: trabajosBuscados.filter((item) => item !== profession),
                                                };
                                            } else {
                                                return {
                                                    ...prevState,
                                                    trabajosBuscados: [...trabajosBuscados, profession],
                                                };
                                            }
                                        })}
                                        className={`selector-item ${userData?.trabajosBuscados?.includes(profession) ? 'selected' : ''}`}
                                    >
                                        {profession}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center mt-6">
                            <button onClick={() => handleComplete()} className="semiround-green-button">
                                Completar
                            </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}