import api from "./api";

export const sendRequest = async ({ receiverId, tripId }) => {
  const response = await api.post("/requests/send", {
    receiverId,
    tripId,
  });

  return response.data;
};

export const getReceivedRequests = async () => {
  const response = await api.get("/requests/received");
  return response.data;
};

export const getSentRequests = async () => {
  const response = await api.get("/requests/sent");
  return response.data;
};

export const acceptRequest = async (id) => {
  const response = await api.put(`/requests/${id}/accept`);
  return response.data;
};

export const rejectRequest = async (id) => {
  const response = await api.put(`/requests/${id}/reject`);
  return response.data;
};