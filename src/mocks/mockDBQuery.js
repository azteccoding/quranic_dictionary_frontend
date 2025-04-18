import collectionResponse from "./database.json";

export const mockDBQuery = async (resolve) =>
  await new Promise((resolve) =>
    setTimeout(() => {
      resolve(collectionResponse);
    }, 1000)
  );
