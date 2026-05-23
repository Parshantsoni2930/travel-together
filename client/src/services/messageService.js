import api from "./api";

export const sendMessage = async (data) => {
  try {
    const response = await api.post(
      "/messages/send",
      data
    );

    return response.data;
  } catch (error) {
    console.log(
      "SEND MESSAGE ERROR:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};

export const getMessages = async (
  userId
) => {
  try {
    const response = await api.get(
      `/messages/${userId}`
    );

    return response.data;
  } catch (error) {
    console.log(
      "GET MESSAGES ERROR:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};

export const deleteMessage = async (
  id
) => {
  try {
    const response = await api.delete(
      `/messages/${id}`
    );

    return response.data;
  } catch (error) {
    console.log(
      "DELETE MESSAGE ERROR:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};