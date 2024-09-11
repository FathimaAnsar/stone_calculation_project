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
            withCredentials: true  // Ensure cookies/credentials are included in requests
        });

        // Add interceptors for cursor change
        this.axiosInstance.interceptors.request.use((config) => {
            document.body.style.cursor = 'wait';
            return config;
        }, (error) => {
            document.body.style.cursor = 'default';
            return Promise.reject(error);
        });

        this.axiosInstance.interceptors.response.use((response) => {
            document.body.style.cursor = 'default';
            return response;
        }, (error) => {
            document.body.style.cursor = 'default';
            return Promise.reject(error);
        });
    }

    async sendRequest(method, apiEndPoint, data = null) {
        try {
            // Prepare the config object
            const config = {
                method,
                url: apiEndPoint,
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true // Ensure cookies/credentials are included in requests
            };

            // Add data if it's not a DELETE request
            if (method.toLowerCase() !== 'delete') {
                config.data = data;
            }

            const response = await this.axiosInstance(config);
            return response.data;
        } catch (error) {
            console.error(`Error during ${method.toUpperCase()} request:`, error?.response?.data || error.message);
            return null;
        }
    }

    async postRequest(apiEndPoint, data) {
        return this.sendRequest('post', apiEndPoint, data);
    }

    async putRequest(apiEndPoint, data) {
        return this.sendRequest('put', apiEndPoint, data);
    }

    async deleteRequest(apiEndPoint) {
        return this.sendRequest('delete', apiEndPoint);
    }

    async getRequest(apiEndPoint) {
        return this.sendRequest('get', apiEndPoint);
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
