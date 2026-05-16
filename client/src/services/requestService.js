import api from "./api";

export const sendRequest = async (data) => {
  return (await api.post("/requests/send", data)).data;
};

export const getReceivedRequests = async () => {
  return (await api.get("/requests/received")).data;
};

export const getSentRequests = async () => {
  return (await api.get("/requests/sent")).data;
};

export const acceptRequest = async (id) => {
  return (await api.put(`/requests/${id}/accept`)).data;
};

export const rejectRequest = async (id) => {
  return (await api.put(`/requests/${id}/reject`)).data;
};