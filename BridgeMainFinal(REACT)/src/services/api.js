import { http } from './http';

/**
 * Thin, promise-based wrappers around the REST endpoints. Components never
 * call axios directly: they dispatch Redux thunks, and the thunks call these.
 */
const data = (response) => response.data;

const makeCrudApi = (resource) => ({
  list: (params, signal) => http.get(`/${resource}`, { params, signal }).then(data),
  create: (body) => http.post(`/${resource}`, body).then(data),
  update: (id, body) => http.put(`/${resource}/${id}`, body).then(data),
  remove: (id) => http.delete(`/${resource}/${id}`).then(data),
});

export const ridesApi = makeCrudApi('rides');
export const thriftApi = makeCrudApi('thrift');

// Read-only resources.
export const roomsApi = {
  list: (params, signal) => http.get('/rooms', { params, signal }).then(data),
};
export const shopsApi = {
  list: (params, signal) => http.get('/shops', { params, signal }).then(data),
};
