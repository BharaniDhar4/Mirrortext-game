import axios from "axios";

const API_BASE_URL = "http://localhost:8070";

const apiService = {
  getWords: async (difficulty) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/words/${difficulty}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching words:", error);
      return [];
    }
  },

  validateAttempt: async (originalText, userInput) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/validate`, {
        originalText,
        userInput,
      });
      return response.data; // Returns true (correct) or false (incorrect)
    } catch (error) {
      console.error("Validation error:", error);
      return false;
    }
  },
};

export default apiService;
