export interface ThirdWebData {
    email: string | undefined;
    name: string | undefined;
    id: string | undefined;
    picture: string;
    familyName: string | undefined;
    givenName: string | undefined;
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