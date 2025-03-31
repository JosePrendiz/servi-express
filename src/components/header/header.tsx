"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import serviExpressLogo from '@/assets/servi-express-logo.png'
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { getProfiles } from "thirdweb/wallets/in-app";
import { inAppWallet } from "thirdweb/wallets";
import { client } from '../../app/client';
import RegisterClientPopup from '../auth/registerClient';
import RegisterHandymanPopup from '../auth/registerHandyman';
import { useAppContext } from 'app/context';
import { ThirdWebData } from 'app/interfaces';

export default function Header() {

    const { setThirdWebData } = useAppContext();

    const [isClientModalOpen, setIsClientModalOpen] = useState<boolean>(false);
    const [isHandymanModalOpen, setIsHandymanModalOpen] = useState<boolean>(false);

    const openClientModal = () => setIsClientModalOpen(true);
    const closeClientModal = () => setIsClientModalOpen(false);
    const openHandymanModal = () => setIsHandymanModalOpen(true);
    const closeHandymanModal = () => setIsHandymanModalOpen(false);

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
            const details = userdata[0].details as ThirdWebData;
            setThirdWebData({
                email: details.email,
                id: details.id,
                picture: details.picture,
                name: details.name,
                familyName: details.familyName,
                givenName: details.givenName,
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
                <button className="no-bkgd" onClick={openClientModal}>
                    Registro
                </button>
                {!activeAccount && <div className="relative">
                    <button className="no-bkgd">
                        Iniciar Sesión
                    </button>
                    <div style={{ opacity: 0, pointerEvents: 'auto', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                        <ConnectButton
                            client={client}
                            wallets={thirdWebLogins}
                            theme={"dark"}
                            connectModal={{ size: "wide" }}
                            connectButton={{ label: "Iniciar Sesión con Google" }}
                        />
                    </div>
                </div>}
                <button className="green-bkgd" onClick={openHandymanModal}>
                    Convertirme en Handyman
                </button>
            </div>
            {isClientModalOpen && <RegisterClientPopup closeModal={closeClientModal} isConnected={!!activeAccount} />}
            {isHandymanModalOpen && <RegisterHandymanPopup closeModal={closeHandymanModal} isConnected={!!activeAccount} />}
        </header >
    );
}
