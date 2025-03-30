"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import serviExpressLogo from '@/assets/servi-express-logo.png'
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { getProfiles } from "thirdweb/wallets/in-app";
import { inAppWallet } from "thirdweb/wallets";
import { client } from '../../app/client';
import RegisterPopup from '../auth/register';
import { useAppContext } from 'app/context';

export default function Header() {

    const { setThirdWebData } = useAppContext();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

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
            const details = userdata[0].details as { email: string; id: string; picture: string };
            setThirdWebData({
                email: details.email,
                id: details.id,
                picture: details.picture,
            });
        }
        if (true) {
            getThirdWebData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeAccount]);
    return (
        <header className="flex items-center justify-between px-4 py-2 shadow-md bg-white">
            {/* Logo */}
            <div className="flex items-center">
                <Link href={`/`}>
                    <Image
                        src={serviExpressLogo}
                        alt="Logo"
                        className="w-auto h-15 cursor-pointer"
                    />
                </Link>
            </div>
            {/* Auth Buttons */}
            <div className="flex items-center space-x-15">
                <button className="no-bkgd" onClick={openModal}>
                    Registro
                </button>
                <div className="relative" onClick={activeAccount && openModal}>
                    <button className="no-bkgd">
                        Iniciar Sesión
                    </button>
                    {!activeAccount &&
                        <div style={{ opacity: 0, pointerEvents: 'auto', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                            <ConnectButton
                                client={client}
                                wallets={thirdWebLogins}
                                theme={"dark"}
                                connectModal={{ size: "wide" }}
                                connectButton={{ label: "Iniciar Sesión con Google" }}
                            />
                        </div>
                    }
                </div>
                <button className="green-bkgd">
                    Convertirme en Handyman
                </button>
            </div>
            {isModalOpen && <RegisterPopup closeModal={closeModal} isConnected={!!activeAccount} />
            }
        </header >
    );
}
