"use client";
import { ConnectButton, useActiveAccount, useDisconnect, useActiveWallet } from "thirdweb/react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { authAPI, usersAPI, handymenAPI, clientsAPI } from 'app/axios';
import serviExpressLogo from '@/assets/servi-express-logo.png';
import RegisterHandymanPopup from '../auth/registerHandyman';
import React, { useEffect, useState, useRef } from 'react';
import RegisterClientPopup from '../auth/registerClient';
import ConvertClientPopup from '../auth/convertClient';
import { getProfiles } from "thirdweb/wallets/in-app";
import ChatNotification from '../stream/notification';
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { inAppWallet } from "thirdweb/wallets";
import { ThirdWebData } from 'app/interfaces';
import { useAppContext } from 'app/context';
import { CgProfile } from "react-icons/cg";
import { client } from '../../app/client';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {

    const { setThirdWebData, setCurrentUser, currentUser, setChatToken, chatToken } = useAppContext();
    const [isClientModalOpen, setIsClientModalOpen] = useState<boolean>(false);
    const [isHandymanModalOpen, setIsHandymanModalOpen] = useState<boolean>(false);
    const [isHandymanConvertionModalOpen, setIsHandymanConvertionModalOpen] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const openClientModal = () => setIsClientModalOpen(true);
    const closeClientModal = () => setIsClientModalOpen(false);
    const openHandymanModal = () => setIsHandymanModalOpen(true);
    const openHandymanConvertionModal = () => setIsHandymanConvertionModalOpen(true);
    const closeHandymanConvertionModal = () => setIsHandymanConvertionModalOpen(false);
    const closeHandymanModal = () => setIsHandymanModalOpen(false);
    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    const activeAccount = useActiveAccount();
    const { disconnect } = useDisconnect();
    const thirdWebWallet = useActiveWallet();

    const thirdWebLogins = [
        inAppWallet({
            auth: {
                options: ["google"],
            },
        }),
    ];

    const logout = () => {
        localStorage.removeItem('accessTokenSE');
        localStorage.removeItem('refreshTokenSE');
        if (thirdWebWallet) {
            disconnect(thirdWebWallet);
        }
        window.location.reload();
    }

    const hasProcessed = useRef(false);

    useEffect(() => {
        const currentToken = localStorage.getItem("accessTokenSE");
        const getThirdWebData = async () => {
            let user;
            if (currentToken) {
                try {
                    user = await usersAPI.getUserProfile()
                    setCurrentUser(user);
                } catch (error) {
                    console.error(error);
                }
            }
            try {
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
                if (details.email && details.id && activeAccount) {
                    hasProcessed.current = true;
                    const streamToken = await authAPI.login(details.email, details.id);
                    if (streamToken) {
                        setChatToken(streamToken);
                        if (!user) {
                            user = await usersAPI.getUserProfile()
                            setCurrentUser(user);
                        }
                        if (details.picture !== user.profilePicture) {
                            if (user.role === 'handyman') {
                                handymenAPI.updateHandymanProfile({ profilePicture: details.picture }, user.email);
                            } else {
                                await clientsAPI.updateClientProfile({ profilePicture: details.picture }, user.email);
                            }
                        }
                    } else {
                        openClientModal();
                    }
                }
            } catch (error) {
                const authToken = localStorage.getItem('accessTokenSE')
                console.error(error);
                if (error instanceof Error && error.message === 'Error verifying JWT' && authToken) {
                    logout()
                }

            }
        }
        if (!hasProcessed.current) {
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
                {!currentUser &&
                    <button className="no-bkgd" onClick={openClientModal}>
                        Registro
                    </button>
                }
                {(!activeAccount && !currentUser) && <div className="relative">
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
                {currentUser?.role !== 'handyman' && currentUser?.role !== 'admin' && <button className="green-bkgd" onClick={() => {
                    if (currentUser?.role === 'client') {
                        openHandymanConvertionModal()
                    } else {
                        openHandymanModal();
                    }
                }}>
                    Convertirme en Handyman
                </button>}

                {currentUser?.role === 'admin' &&
                    <Link href='/admin'>
                        <div className="dark-green-btn">
                            Dashboard
                        </div>
                    </Link>}
                {/* User Dropdown */}

                {currentUser &&
                    <div className="relative">
                        <button className="no-bkgd flex items-center" onClick={toggleDropdown}>
                            Hola, {currentUser.name} {' '} {chatToken && <ChatNotification />}{isDropdownOpen ? <RiArrowDropUpLine className="text-4xl" /> : <RiArrowDropDownLine className="text-4xl" />}
                        </button>
                        {isDropdownOpen && (
                            <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`} onClick={toggleDropdown}>
                                <Link href="/perfil" className='dropdown-item'>
                                    <CgProfile className="green-icons" />Mi Perfil
                                </Link>
                                <Link href="/servicios" className='dropdown-item'>
                                    <FaRegCalendarAlt className="green-icons" />Mis Servicios
                                </Link>
                                <button className="dropdown-item" onClick={logout}>
                                    <HiOutlineLogout className="green-icons" />Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>}
            </div>
            {isClientModalOpen && !currentUser && <RegisterClientPopup closeModal={closeClientModal} isConnected={!!activeAccount} />}
            {isHandymanModalOpen && !currentUser && <RegisterHandymanPopup closeModal={closeHandymanModal} isConnected={!!activeAccount} />}
            {isHandymanConvertionModalOpen && (currentUser?.role === 'client') && <ConvertClientPopup closeModal={closeHandymanConvertionModal} />}
        </header >
    );
}
