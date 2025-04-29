'use client';

import { FaSpinner } from 'react-icons/fa';

export default function Loading({ message = 'Loading...' }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen" style={{ width: '100%' }}>
            <FaSpinner className="text-4xl text-blue-500 animate-spin mb-4" />
            <p className="text-gray-700 text-lg">{message}</p>
        </div>
    );
}