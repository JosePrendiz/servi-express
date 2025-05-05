import axios from "axios";
import { setCookie } from 'cookies-next';
import { PageParams, RegisterClientData, RegisterHandymanData, RequestServiceData, UpdateClientData, UpdateHandymanData } from "./interfaces";

const API_BASE_URL = "https://serviexpress-api.onrender.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const setAuthHeader = (token: string) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export const authAPI = {
  login: async (email: string, googleId: string) => {
    try {
      const response = await apiClient.post("/auth/login", { email, googleId });
      setAuthHeader(response.data.accessToken);
      setCookie("accessToken", "true", { path: "/" });
      localStorage.setItem("accessTokenSE", response.data.accessToken);
      localStorage.setItem("refreshTokenSE", response.data.refresh_token);
      return response.data.chatToken;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
    }
  },
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshTokenSE");
      const response = await apiClient.post("/auth/refresh-token", { refreshToken });
      setAuthHeader(response.data.access_token);
      localStorage.setItem("accessTokenSE", response.data.accessToken);
    } catch (error) {
      throw error;
    }
  }
};

export const usersAPI = {
  getAnyUser: async (identifier: string) => {
    try {
      const response = await apiClient.get(`/users/get-any-user/${identifier}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getUserProfile: async () => {
    try {
      const token = localStorage.getItem("accessTokenSE");
      if (token) {
        setAuthHeader(token);
      }
      const response = await apiClient.get(`/users/profile`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

export const skillsAPI = {
  getAllSkills: async () => {
    try {
      const response = await apiClient.get("/skills");
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getSkillByName: async (skillName: string) => {
    try {
      const response = await apiClient.get(`/skills/${skillName}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const ratingAPI = {
  rateHandyman: async (handymanEmail: string, rating: number) => {
    try {
      const response = await apiClient.post(`/rating`, { handymanEmail, rating });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const serviceAPI = {
  requestService: async (requestServiceData: RequestServiceData) => {
    try {
      const response = await apiClient.post(`/requests/client/create-request`, requestServiceData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getClientRequests: async () => {
    try {
      const response = await apiClient.get(`/requests/client/my-requests`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCurrentService: async (handymanId: string) => {
    try {
      const response = await apiClient.get(`/requests/client/request-handyman/${handymanId}`);
      return response.data.requestId;
    } catch (error) {
      throw error;
    }
  },

  clientCancelRequest: async (requestID: string) => {
    try {
      const response = await apiClient.patch(`/requests/client/cancel-request/${requestID}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getHandymanRequests: async () => {
    try {
      const response = await apiClient.get(`/requests/handyman/my-requests`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  handymanAcceptRequests: async (requestID: string) => {
    try {
      const response = await apiClient.patch(`/requests/handyman/accept-request/${requestID}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  handymanRejectRequests: async (requestID: string) => {
    try {
      const response = await apiClient.patch(`/requests/handyman/reject-request/${requestID}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRequestByID: async (requestID: string) => {
    try {
      const response = await apiClient.get(`/requests/${requestID}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

};

export const handymenAPI = {
  registerHandyman: async (handymanData: RegisterHandymanData) => {
    try {
      const response = await apiClient.post(`/handymen/register-handyman`, {
        googleId: handymanData.id,
        name: handymanData.givenName,
        lastName: handymanData.familyName,
        profilePicture: handymanData.picture,
        email: handymanData.email,
        phone: handymanData.phoneNumber,
        skills: handymanData.trabajosDisponibles,
        coverageArea: handymanData.zonasDisponibles,
        personalDescription: handymanData.description,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllHandymen: async (params: PageParams) => {
    try {
      const response = await apiClient.get(`/handymen/get-all`, { params });
      return response.data.data.docs;
    } catch (error) {
      throw error;
    }
  },

  updateHandymanProfile: async (updateData: UpdateHandymanData, email: string) => {
    try {
      const response = await apiClient.put(`/handymen/update-handyman/${email}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const clientsAPI = {
  registerClient: async (clientData: RegisterClientData | null) => {
    try {
      const response = await apiClient.post(`/clients/register-client`,
        {
          googleId: clientData?.id,
          name: clientData?.givenName,
          lastName: clientData?.familyName,
          profilePicture: clientData?.picture,
          email: clientData?.email,
          phone: clientData?.phoneNumber,
          municipality: clientData?.municipio,
          neighborhood: clientData?.barrio,
          address: clientData?.direccion,
          preferences: clientData?.trabajosBuscados,
        });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateClientProfile: async (updateData: UpdateClientData, email: string) => {
    try {
      const response = await apiClient.put(`/clients/update-client/${email}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
