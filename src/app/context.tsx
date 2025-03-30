'use client';
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
    thirdWebData: ThirdWebData | null;
    setThirdWebData: (thirdWebData: ThirdWebData | null) => void;
    registerData: RegisterData | null;
    setRegisterData: (registerData: RegisterData | null) => void;
}

interface ThirdWebData {
    email: string | undefined;
    id: string | undefined;
    picture: string;
}

interface RegisterData {
    barrio: string | undefined;
    direccion: string | undefined;
    email: string | undefined;
    name: string | undefined;
    familyName: string | undefined;
    givenName: string | undefined;
    id: string | undefined;
    municipio: string | undefined;
    phoneNumber: string | undefined;
    picture: string;
    source:string | undefined;
    trabajosBuscados: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [thirdWebData, setThirdWebData] = useState<ThirdWebData | null>(null);
    const [registerData, setRegisterData] = useState<RegisterData | null>(null);

    return (
        <AppContext.Provider value={{ thirdWebData, setThirdWebData, registerData, setRegisterData }}>
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
