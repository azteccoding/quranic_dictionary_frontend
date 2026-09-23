import axios from "axios";
import {
  AR2ES_API_URI,
  ES2AR_API_URI,
  CREATE_WORD_API_URI,
  CREATE_WORD_API_URI_LOCAL,
  AR2ES_API_URI_LOCAL,
  ES2AR_API_URI_LOCAL,
} from "../constants/constants";

// Make a request for a user with a given ID
export const findInDictionary = async (word, arab2EspSelected) => {
  const URL_with_query_params =
    (arab2EspSelected ? AR2ES_API_URI_LOCAL : ES2AR_API_URI_LOCAL) + word;
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

// Crea una palabra nueva en el diccionario. Sin auth por ahora — es solo
// para uso local; agrega un header de validación cuando esto salga a producción.
export const createWord = async (wordData) => {
  try {
    return {
      hasExternalError: false,
      data: await axios.post(CREATE_WORD_API_URI_LOCAL, wordData, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "admin+chingon",
        },
      }),
    };
  } catch (error) {
    return {
      hasExternalError: true,
      data: error,
      errorMessage: error.message,
    };
  }
};
