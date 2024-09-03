import axios from 'axios';

class ConnectionManager {
    constructor() {
        this.EndpointHost = 'https://stoneapis-fathimaansars-projects.vercel.app';

        // Create an Axios instance with default settings
        this.axiosInstance = axios.create({
            baseURL: this.EndpointHost,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
            });
    }

    async postRequest(apiEndPoint, data) {
        document.body.style.cursor = 'wait';
        try {
            const response = await this.axiosInstance.post(apiEndPoint, data);
            return response.data;
        } catch (error) {
            console.error('Error during POST request:', error);
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
            console.error('Error during PUT request:', error);
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
            console.error('Error during DELETE request:', error);
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
            console.error('Error during GET request:', error);
            return null;
        } finally {
            document.body.style.cursor = 'default';
        }
    }

    // Set APIs
    async addSet(set) {
        return await this.postRequest('set/add', set);
    }

    async updateSet(id, set) {
        return await this.putRequest(`set/update/${id}`, set);
    }

    async deleteSet(id) {
        return await this.deleteRequest(`set/delete/${id}`);
    }

    async getAllSets() {
        return await this.getRequest('set/get');
    }

    async getSetById(id) {
        return await this.getRequest(`set/get/${id}`);
    }

    // Design APIs
    async addDesign(design) {
        return await this.postRequest('design/add', design);
    }

    async updateDesign(id, design) {
        return await this.putRequest(`design/update/${id}`, design);
    }

    async deleteDesign(id) {
        return await this.deleteRequest(`design/delete/${id}`);
    }

    async getAllDesigns() {
        return await this.getRequest('design/get');
    }

    async getDesignById(id) {
        return await this.getRequest(`design/get/${id}`);
    }
}

export default ConnectionManager;
