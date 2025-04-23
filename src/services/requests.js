import axios from "axios";
import { AR2ES_API_URI, ES2AR_API_URI } from "../constants/constants";

// Make a request for a user with a given ID
export const findInDictionary = async (word, arab2EspSelected) => {
  const URL_with_query_params =
    (arab2EspSelected ? AR2ES_API_URI : ES2AR_API_URI) + word;
  try {
    return {
      hasExternalError: false,
      data: await axios.get(URL_with_query_params),
    };
  } catch (error) {
    return {
      hasExternalError: true,
      data: error,
      errorMessage: error.message,
    };
  }
};
