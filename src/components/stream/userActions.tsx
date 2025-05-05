// ChatOverlay.tsx
import { UserChatActions } from 'app/interfaces';
import React from 'react';

const UserActions: React.FC<UserChatActions> = ({ title, description, buttons }) => {
    return (
        <div className="chat-overlay">
            <div className="action-modal">
                <h2>{title}</h2>
                <p>{description}</p>
                <div className="button-group">
                    {buttons.map((button, index) => (
                        <button
                            key={index}
                            className={button.className}
                            onClick={button.onClick}
                        >
                            {button.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserActions;
