import axios from "axios";
import { strapi_api_url } from "../injector";

const strapiRequest = async (slug, queryString) => {
  try {
    const response = await axios.get(
      `${strapi_api_url}${slug}${queryString ? queryString : ""}`
    );
    return response.data.data;
  } catch (err) {
    throw new Error(`Strapi Request Failed: ${err}`);
  }
};

export default strapiRequest;
