import axios from "axios";
import Strapify from "../Strapify";

const strapiRequest = async (slug, queryString) => {
	try {
		const response = await axios.get(
			`${Strapify.apiURL}${slug}${queryString ? queryString : ""}`
		);
		return response.data.data;
	} catch (err) {
		throw new Error(`Strapi Request Failed: ${err}`);
	}
};

export default strapiRequest;
