import { apiRequest } from "./api";

export interface Officer {
  id: string;
  name: string;
  email: string;
  officerId: string;
  department: string;
  isActive: boolean;
  createdAt: string;
}

export interface NewOfficer {
  name: string;
  email: string;
  officerId: string;
  department: string;
  password: string;
}

export const adminService = {
  async listOfficers(): Promise<Officer[]> {
    const data = await apiRequest<{ officers: Officer[] }>("/admin/officers");
    return data.officers;
  },

  async createOfficer(officer: NewOfficer): Promise<Officer> {
    const data = await apiRequest<{ officer: Officer }>("/admin/officers", {
      method: "POST",
      body: JSON.stringify(officer),
    });
    return data.officer;
  },

  async setOfficerActive(id: string, isActive: boolean): Promise<Officer> {
    const data = await apiRequest<{ officer: Officer }>(`/admin/officers/${id}/active`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    });
    return data.officer;
  },
};
