import axios from 'axios';

const api = axios.create({
    baseURL: '/api', 
    headers: {
        'Content-Type': 'application/json',
        // If using Sanctum or Bearer token, you can add here
        // 'Authorization': `Bearer ${token}`
    },
});

export default {
    getAll() {
        return api.get('/campaigns');
    },

    getById(id) {
        return api.get(`/campaigns/${id}`);
    },

    create(data) {
        return api.post('/campaigns', data);
    },

    update(id, data) {
        return api.put(`/campaigns/${id}`, data);
    },

    delete(id) {
        return api.delete(`/campaigns/${id}`);
    },
};
