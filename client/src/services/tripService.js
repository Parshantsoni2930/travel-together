import api from "./api";

export const createTrip = async (tripData) => {
  const response = await api.post("/trips", tripData);
  return response.data;
};

export const getMyTrips = async () => {
  const response = await api.get("/trips/my");
  return response.data;
};

export const getAllTrips = async () => {
  const response = await api.get("/trips");
  return response.data;
};

export const getTripById = async (id) => {
  const response = await api.get(`/trips/${id}`);
  return response.data;
};

export const updateTrip = async (id, tripData) => {
  const response = await api.put(`/trips/${id}`, tripData);
  return response.data;
};

export const deleteTrip = async (id) => {
  const response = await api.delete(`/trips/${id}`);
  return response.data;
};