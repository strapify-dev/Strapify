import axios from "axios";

const strapiRequest = async (slug) => {
  try {
    const response = await axios.get(`http://localhost:1337/api/${slug}`);
    return response.data.data;
  } catch (err) {
    throw new Error(`Strapi Request Failed: ${err}`);
  }
};

export default strapiRequest;