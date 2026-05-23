import api from "./api";

export const createTrip = async (tripData) => {
  try {
    const response = await api.post("/trips", tripData);

    return response.data;
  } catch (error) {
    console.log(
      "CREATE TRIP ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const getMyTrips = async () => {
  try {
    const response = await api.get("/trips/my");

    return response.data;
  } catch (error) {
    console.log(
      "GET MY TRIPS ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const getAllTrips = async () => {
  try {
    const response = await api.get("/trips");

    return response.data;
  } catch (error) {
    console.log(
      "GET ALL TRIPS ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const getTripById = async (id) => {
  try {
    const response = await api.get(`/trips/${id}`);

    return response.data;
  } catch (error) {
    console.log(
      "GET TRIP BY ID ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const updateTrip = async (id, tripData) => {
  try {
    const response = await api.put(`/trips/${id}`, tripData);

    return response.data;
  } catch (error) {
    console.log(
      "UPDATE TRIP ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const deleteTrip = async (id) => {
  try {
    const response = await api.delete(`/trips/${id}`);

    return response.data;
  } catch (error) {
    console.log(
      "DELETE TRIP ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};