import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="flex justify-between items-center p-4 text-white bg-[#D9D9D9]">
            {/* Legal Buttons */}
            <div className="flex space-x-10">
                <Link href="/register">
                    <button className="no-bkgd-black">Sobre Nosotros</button>
                </Link>
                <Link href="/login">
                    <button className="no-bkgd-black">Términos y Privacidad</button>
                </Link>
                <Link href="/contact">
                    <button className="no-bkgd-black">Información Legal</button>
                </Link>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-15 items-center">
                <div>
                    <label className="no-bkgd-black" style={{ cursor: 'default' }}>Síguenos:</label>
                </div>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <FaFacebook className="text-2xl text-black" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <FaTwitter className="text-2xl text-black" />
                </a>
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp className="text-2xl text-black" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="text-2xl text-black" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="text-2xl text-black" />
                </a>
            </div>
        </footer>
    );
}
