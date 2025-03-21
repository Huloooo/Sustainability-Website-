import { API_CONFIG } from '../config/api.config';

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
    }

    async getData(page: number = 1, limit: number = 10) {
        try {
            const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.DATA}?page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    async getDataById(id: string) {
        try {
            const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.DATA}/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data by id:', error);
            throw error;
        }
    }

    async uploadFile(file: File) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.UPLOAD}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
}

export const apiService = new ApiService(); 