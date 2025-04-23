'use client';
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ThirdWebData, RegisterClientData, RegisterHandymanData, User } from "./interfaces";

interface AppContextType {
    thirdWebData: ThirdWebData | null;
    setThirdWebData: (thirdWebData: ThirdWebData | null) => void;
    registerClientData: RegisterClientData | null;
    setRegisterClientData: (registerClientData: RegisterClientData | null) => void;
    registerHandymanData: RegisterHandymanData | null;
    setRegisterHandymanData: (registerHandymanData: RegisterHandymanData | null) => void;
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [thirdWebData, setThirdWebData] = useState<ThirdWebData | null>(null);
    const [registerClientData, setRegisterClientData] = useState<RegisterClientData | null>(null);
    const [registerHandymanData, setRegisterHandymanData] = useState<RegisterHandymanData | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    return (
        <AppContext.Provider value={{ thirdWebData, setThirdWebData, registerClientData, setRegisterClientData, registerHandymanData, setRegisterHandymanData, currentUser, setCurrentUser }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
