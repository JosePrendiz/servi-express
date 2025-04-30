'use client';

import React from 'react';

type ActionDeniedProps = {
    message: string;
    buttonText: string;
    onButtonClick: () => void;
};

export default function ActionDenied({ message, buttonText, onButtonClick }: ActionDeniedProps) {
    return (
        <div className="action-denied-overlay">
            <div className="action-denied-popup">
                <p className="text-lg font-semibold mb-4">{message}</p>
                <button onClick={onButtonClick} className="action-denied-button">
                    {buttonText}
                </button>
            </div>
        </div>
    );
}
