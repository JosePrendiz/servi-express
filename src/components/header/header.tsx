"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import serviExpressLogo from '@/assets/servi-express-logo.png'
import { ConnectButton, useActiveAccount, useDisconnect, useActiveWallet } from "thirdweb/react";
import { getProfiles } from "thirdweb/wallets/in-app";
import { inAppWallet } from "thirdweb/wallets";
import { client } from '../../app/client';
import RegisterClientPopup from '../auth/registerClient';
import RegisterHandymanPopup from '../auth/registerHandyman';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { HiOutlineLogout } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useAppContext } from 'app/context';
import { ThirdWebData } from 'app/interfaces';
import { authAPI, usersAPI, handymenAPI, clientsAPI } from 'app/axios';

export default function Header() {

    const { setThirdWebData, setCurrentUser, currentUser } = useAppContext();
    const [isClientModalOpen, setIsClientModalOpen] = useState<boolean>(false);
    const [isHandymanModalOpen, setIsHandymanModalOpen] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const openClientModal = () => setIsClientModalOpen(true);
    const closeClientModal = () => setIsClientModalOpen(false);
    const openHandymanModal = () => setIsHandymanModalOpen(true);
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
        if (thirdWebWallet) {
            disconnect(thirdWebWallet);
            window.location.reload();
        }
    }

    useEffect(() => {
        const getThirdWebData = async () => {
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
                    if (await authAPI.login(details.email, details.id)) {
                        const user = await usersAPI.getUserProfile()
                        if (details.picture !== user.profilePicture) {
                            if (user.role === 'handyman') {
                                handymenAPI.updateHandymanProfile({ profilePicture: details.picture }, user.email);
                            } else {
                                await clientsAPI.updateClientProfile({ profilePicture: details.picture }, user.email);
                            }
                        }
                        setCurrentUser(user);
                    } else {
                        openClientModal();
                    }
                }
            } catch (error) {
                console.error(error);
            }
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
                {currentUser?.role !== 'handyman' && <button className="green-bkgd" onClick={openHandymanModal}>
                    Convertirme en Handyman
                </button>}
                {/* User Dropdown */}

                {currentUser &&
                    <div className="relative">
                        <button className="no-bkgd flex items-center" onClick={toggleDropdown}>
                            Hola, {currentUser.name} {isDropdownOpen ? <RiArrowDropUpLine className="text-4xl" /> : <RiArrowDropDownLine className="text-4xl" />}
                        </button>
                        {isDropdownOpen && (
                            <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`} onClick={toggleDropdown}>
                                <Link href="/perfil" className='dropdown-item'>
                                    <CgProfile className="green-icons" />Mi Perfil
                                </Link>
                                <Link href="/reservas" className='dropdown-item'>
                                    <FaRegCalendarAlt className="green-icons" />Mis Reservas
                                </Link>
                                <Link href="/chats" className='dropdown-item'>
                                    <IoChatbubbleEllipsesOutline className="green-icons" />Chats
                                </Link>
                                <button className="dropdown-item" onClick={logout}>
                                    <HiOutlineLogout className="green-icons" />Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>}
            </div>
            {isClientModalOpen && !currentUser && <RegisterClientPopup closeModal={closeClientModal} isConnected={!!activeAccount} />}
            {isHandymanModalOpen && (currentUser?.role === 'client') && <RegisterHandymanPopup closeModal={closeHandymanModal} isConnected={!!activeAccount} />}
        </header >
    );
}
