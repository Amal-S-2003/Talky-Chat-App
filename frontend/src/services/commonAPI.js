import axios from "axios";

export const commonAPI = async (httpRequest, url, reqBody, reqHeader) => {
  // Detect if FormData is being sent
  const isFormData = reqBody instanceof FormData;
  const reqConfig = {
    method: httpRequest,
    url,
    data: reqBody,
    headers: reqHeader
      ? reqHeader
      : isFormData
        ? {} // Let axios set the correct multipart/form-data boundary
        : { "Content-Type": "application/json" },
    withCredentials: true,
  };

  try {
    const res = await axios(reqConfig);
    return res;
  } catch (err) {
    return err;
  }
};
