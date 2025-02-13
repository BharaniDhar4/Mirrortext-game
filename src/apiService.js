import axios from "axios";

const API_BASE_URL = "http://Mirror-Text-backend.ap-south-1.elasticbeanstalk.com"; // Ensure correct protocol

const apiService = {
  getWords: async (difficulty) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/words/${difficulty}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching words:", error.response ? error.response.data : error.message);
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
      console.error("Validation error:", error.response ? error.response.data : error.message);
      return false;
    }
  },
};

export default apiService;
