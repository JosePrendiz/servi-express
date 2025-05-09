export interface ThirdWebData {
    email: string | undefined;
    name: string | undefined;
    id: string | undefined;
    picture: string;
    familyName: string | undefined;
    givenName: string | undefined;
}

export interface User {
    _id: string;
    name: string;
    lastName: string;
    profilePicture: string;
    email: string;
    phone: string;
    role: string;
    municipality: string;
    neighborhood: string;
    isBanned: boolean;
    personalDescription: string;
    coverageArea: string[];
    address: string;
    preferences: Skill[];
    skills: Skill[];
    [key: string]: unknown,
}
export interface UpdateClientData {
    name?: string,
    lastName?: string,
    profilePicture?: string,
    email?: string,
    phone?: string,
    municipality?: string,
    neighborhood?: string,
    address?: string,
    preferences?: string[],
    [key: string]: unknown,
}

export interface UpdateHandymanData {
    name?: string,
    lastName?: string,
    profilePicture?: string,
    email?: string,
    phone?: string,
    skills?: string[],
    coverageArea?: string[],
    personalDescription?: string,
    [key: string]: unknown,
}
export interface RoleChangeData {
    skills: string[] | undefined,
    coverageArea: string[],
    personalDescription: string,
}

export interface RegisterClientData extends ThirdWebData {
    barrio: string | undefined;
    direccion: string | undefined;
    municipio: string | undefined;
    phoneNumber: string | undefined;
    source: string | undefined;
    trabajosBuscados: string[];
}

export interface RegisterHandymanData extends ThirdWebData {
    municipio: string | undefined;
    phoneNumber: string | undefined;
    source: string | undefined;
    description: string | undefined;
    trabajosDisponibles: string[];
    zonasDisponibles: string[];
}

export interface ClientFormErrors {
    familyName: boolean;
    givenName: boolean;
    municipio: boolean;
    barrio: boolean;
    direccion: boolean;
    termsAccepted: boolean;
};

export interface HandymanFormErrors {
    familyName: boolean;
    givenName: boolean;
    termsAccepted: boolean;
    description: boolean;
};
export interface HandymanConvertionErrors {
    personalDescription: boolean;
};

export interface PageParams {
    page: number;
    limit: number;
    skills: string[];
    coverageArea: string[];
}

export interface Skill {
    skillName: string;
    description: string;
}

export interface HandymanData {
    _id: string;
    averageRating: number;
    coverageArea: string[];
    email: string;
    lastName: string;
    name: string;
    personalDescription: string;
    phone: string;
    profilePicture: string;
    rating: number;
    skills: Skill[];
    totalRatings: number;
    weightedRating: number;
}
export interface HandymanCardProps {
    handymanData: HandymanData;
}
export interface ClientData {
    _id: string;
    address: string;
    neighborhood: string;
    email: string;
    lastName: string;
    name: string;
    municipality: string;
    personalDescription: string;
    phone: string;
    profilePicture: string;
    preferences: Skill[];
}

export interface RequestServiceData {
    title: string,
    handymanEmail: string,
    description: string,
    location: {
        municipality: string,
        neighborhood: string,
        address: string
    },
    categories: string[]
}

export interface ServiceRequest {
    title: string;
    description: string;
    location: {
        municipality: string;
        neighborhood: string;
        address: string;
    };
    categories: Skill[];
    status: string;
    expiresAt: string;
    _id: string;
    clientId: {
        email: string;
        name: string;
        _id: string;
        lastName: string;
    };
    handymanId: {
        email: string;
        name: string;
        _id: string;
        lastName: string;
    };
}

export interface Message {
    id: string;
    text: string;
    user: {
        id: string;
        name: string;
        image: string;
    };
    created_at: string;
}
export interface UserChatActions {
    role: string,
    channel: {
        data: {
            requestStatus: string,
            id: string,
            quotationId: string,
            quotationValue: number,
        },
    },
}
export interface PayPalPaymentProps {
    amount: string;
    quotationId: string;
}
export interface SearchBarProps {
    onSearch: (data: HandymanData[]) => void;
}

export interface HoverMessage {
    text: string,
    x: number,
    y: number,
}

export interface RequestPayoutDetails {
    clientName: string,
    clientLastName: string,
    handymanName: string,
    handymanLastName: string,
    requestTitle: string,
    requestDescription: string,
    createdAt: string,
    completedAt: string,
    clientPaymentAmount: number,
    paypalFeeOnClientPayment: number,
    appCommission: number,
    handymanNetAmount: number,
}
export interface ReportData {
    reportedUserId: string,
    title: string,
    description: string,
}
export interface DisplayReportData {
    title: string,
    description: string,
    _id: string,
    reporterUserId: {
        _id: string,
        name: string,
        lastName: string,
        email: string,
        phone: string,
    },
    reportedUserId: {
        _id: string,
        name: string,
        lastName: string,
        email: string,
        phone: string,
    },
    reporterRole: string,
    createdAt: string,
}