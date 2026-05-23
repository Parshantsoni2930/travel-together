import api from "./api";

export const getProfile = async () => {
  try {
    const response = await api.get("/users/profile");

    return response.data;
  } catch (error) {
    console.log(
      "GET PROFILE ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put(
      "/users/profile",
      profileData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(
      "UPDATE PROFILE ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const getPublicProfile = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);

    return response.data;
  } catch (error) {
    console.log(
      "GET PUBLIC PROFILE ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const sendFriendRequest = async (id) => {
  try {
    const response = await api.post(
      `/users/friend-request/${id}`
    );

    return response.data;
  } catch (error) {
    console.log(
      "SEND FRIEND REQUEST ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const acceptFriendRequest = async (id) => {
  try {
    const response = await api.post(
      `/users/friend-accept/${id}`
    );

    return response.data;
  } catch (error) {
    console.log(
      "ACCEPT FRIEND REQUEST ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const rejectFriendRequest = async (id) => {
  try {
    const response = await api.post(
      `/users/friend-reject/${id}`
    );

    return response.data;
  } catch (error) {
    console.log(
      "REJECT FRIEND REQUEST ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const getFriends = async () => {
  try {
    const response = await api.get("/users/friends");

    return response.data;
  } catch (error) {
    console.log(
      "GET FRIENDS ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const getFriendRequests = async () => {
  try {
    const response = await api.get(
      "/users/friend-requests"
    );

    return response.data;
  } catch (error) {
    console.log(
      "GET FRIEND REQUESTS ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};