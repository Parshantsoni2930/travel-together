import api from "./api";

export const sendMessage = async (data) => {
  return (await api.post("/messages/send", data)).data;
};

export const getMessages = async (userId) => {
  return (await api.get(`/messages/${userId}`)).data;
};
export const deleteMessage = async (id) => {
  return (await api.delete(`/messages/${id}`)).data;
};