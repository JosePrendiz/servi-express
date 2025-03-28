"use client";
import React, { useEffect } from 'react';
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { getProfiles } from "thirdweb/wallets/in-app";
import { inAppWallet } from "thirdweb/wallets";
import { client } from '../../app/client';

interface RegisterPopupProps {
    closeModal: () => void;
}

export default function RegisterPopup({ closeModal }: RegisterPopupProps) {
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

    useEffect(() => {
        const getThirdWebData = async () => {
            const userdata = await getProfiles({ client });
            console.log('ThirdWeb Data from Register:', userdata[0].details);

        }
        getThirdWebData()
    }, [activeAccount]);

    return (
        <div
            className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleClose}
        >
            <div className="bg-white p-6 rounded-2xl w-96" style={{
                border: '2px solid #ADADAD',
            }}>
                <h2 className="text-center" style={{ color: '#000000' }}>Registrarse en ServiExpress</h2>
                <div className="flex justify-center mt-6">
                    <p className="text-center mt-4" style={{ color: '#6B6868' }}>Crea una cuenta con Google</p>
                    <ConnectButton
                        client={client}
                        wallets={thirdWebLogins}
                        theme={"dark"}
                        connectModal={{ size: "wide" }}
                        connectButton={{ label: "Iniciar Sesión con Google" }}
                    />
                </div>
            </div>
        </div>
    );
}