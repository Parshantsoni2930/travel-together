import api from "./api";

export const getStats = async () => {
  try {
    const response = await api.get(
      "/stats"
    );

    return response.data;
  } catch (error) {
    console.log(
      "GET STATS ERROR:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};