import axios from "axios";
import Strapify from "../Strapify";

const strapiRequest = async (slug, queryString) => {
	try {
		const headers = {}
		const jwt = localStorage.getItem("jwt");

		if (jwt) {
			headers["Authorization"] = `Bearer ${jwt}`;
		}

		const response = await axios.get(
			`${Strapify.apiURL}${slug}${queryString ? queryString : ""}`, {
			headers: headers,
		});
		return response.data;
	} catch (err) {
		throw new Error(`Strapi Request Failed: ${err}`);
	}
};

const strapiRegister = async (username, email, password) => {
	try {
		const response = await axios.post(`${Strapify.apiURL}/api/auth/local/register`, {
			username: username,
			email: email,
			password: password,
		});
		return response.data;
	} catch (err) {
		throw new Error(`Strapi Register Failed: ${err}`);
	}
};

const strapiAuthenticate = async (identifier, password) => {
	try {
		const response = await axios.post(`${Strapify.apiURL}/api/auth/local`, {
			identifier: identifier,
			password: password,
		});
		return response.data;
	} catch (err) {
		throw new Error(`Strapi Authenticate Failed: ${err}`);
	}
}

export default strapiRequest;
export { strapiRequest, strapiRegister, strapiAuthenticate }
