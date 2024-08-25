import axios from 'axios';

class ConnectionManager {
    constructor() {
        this.EndpointHost = 'https://stoneapis-fathimaansars-projects.vercel.app';

        // Create an Axios instance with default settings
        this.axiosInstance = axios.create({
            baseURL: this.EndpointHost,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true, // Include credentials (cookies, etc.) with requests
        });
    }

    async postRequest(apiEndPoint, data) {
        document.body.style.cursor = 'wait';
        try {
            const response = await this.axiosInstance.post(apiEndPoint, data);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            return null;
        } finally {
            document.body.style.cursor = 'default';
        }
    }

    async putRequest(apiEndPoint, data) {
        document.body.style.cursor = 'wait';
        try {
            const response = await this.axiosInstance.put(apiEndPoint, data);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            return null;
        } finally {
            document.body.style.cursor = 'default';
        }
    }

    async deleteRequest(apiEndPoint) {
        document.body.style.cursor = 'wait';
        try {
            const response = await this.axiosInstance.delete(apiEndPoint);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            return null;
        } finally {
            document.body.style.cursor = 'default';
        }
    }

    async getRequest(apiEndPoint) {
        document.body.style.cursor = 'wait';
        try {
            const response = await this.axiosInstance.get(apiEndPoint);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            return null;
        } finally {
            document.body.style.cursor = 'default';
        }
    }
    // Stones APIs
    async addStone(stone) {
        return await this.postRequest('/stone/add', stone);
    }

    async updateStone(id, stone) {
        return await this.putRequest(`/stone/update/${id}`, stone);
    }

    async deleteStone(id) {
        return await this.deleteRequest(`/stone/delete/${id}`);
    }

    async getAllStones() {
        return await this.getRequest('/stone/get');
    }

    async getStoneById(id) {
        return await this.getRequest(`/stone/get/${id}`);
    }

    // Design APIs
    async addDesign(design) {
        return await this.postRequest('/design/add', design);
    }

    async updateDesign(id, design) {
        return await this.putRequest(`/design/update/${id}`, design);
    }

    async deleteDesign(id) {
        return await this.deleteRequest(`/design/delete/${id}`);
    }

    async getAllDesigns() {
        return await this.getRequest('/design/get');
    }

    async getDesignById(id) {
        return await this.getRequest(`/design/get/${id}`);
    }
}

export default ConnectionManager;
