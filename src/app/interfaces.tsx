export interface ThirdWebData {
    email: string | undefined;
    name: string | undefined;
    id: string | undefined;
    picture: string;
    familyName: string | undefined;
    givenName: string | undefined;
}

export interface User {
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