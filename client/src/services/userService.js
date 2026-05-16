import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/users/profile", profileData);
  return response.data;
};

export const getPublicProfile = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};
export const sendFriendRequest = async (id) => {
  const response = await api.post(`/users/friend-request/${id}`);
  return response.data;
};

export const acceptFriendRequest = async (id) => {
  const response = await api.post(`/users/friend-accept/${id}`);
  return response.data;
};

export const rejectFriendRequest = async (id) => {
  const response = await api.post(`/users/friend-reject/${id}`);
  return response.data;
};

export const getFriends = async () => {
  const response = await api.get("/users/friends");
  return response.data;
};
export const getFriendRequests = async () => {
  const response = await api.get("/users/requests");
  return response.data;
};

