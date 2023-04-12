import axios from "axios";
import Strapify from "../Strapify";
import ErrorHandler from "../StrapifyErrors";

const strapiRequest = async (slug, queryString) => {
	const url = `${Strapify.apiURL}${slug}${queryString ? queryString : ""}`
	const jwt = localStorage.getItem("jwt");

	try {
		const headers = {}

		if (jwt) {
			headers["Authorization"] = `Bearer ${jwt}`;
		}

		const response = await axios.get(
			url, {
			headers: headers,
		});
		return response.data;
	} catch (err) {
		if (!err.response) {
			ErrorHandler.toast(`An unexpected error occurred trying to fetch data from ${url}.  (No response)`);
			console.error(err);
			throw err
		}
		switch (err?.response.status) {
			case 401:
				ErrorHandler.warn(`Unable to access the collection or single type: "${slug.replace("/api/", "")}" due to missing or bad authentication. (401)`)
				break;
			case 403:
				ErrorHandler.warn(`You are not authorized to access the collection or single type: "${slug.replace("/api/", "")}". (403)`)
				break;
			case 404:
				ErrorHandler.error(`Invalid collection or single type: "${slug.replace("/api/", "")}" (404)`)
				break;
			default:
				ErrorHandler.toast(`An unexpected error occurred trying to fetch data from ${url}.  (${err.response.status})`);
				console.error(err);
				break;
		}
		throw err
	}
};

const strapiRegister = async (formData) => {
	try {
		const response = await axios.post(`${Strapify.apiURL}/api/auth/local/register`, formData);
		return response.data;
	} catch (err) {
		throw err
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
		throw err
	}
}

const strapiEZFormsSubmit = async (formElement) => {
	const formData = new FormData(formElement);
	const formDataJson = Object.fromEntries(formData.entries());
	const jwt = localStorage.getItem("jwt");

	try {
		const headers = {}

		if (jwt) {
			headers["Authorization"] = `Bearer ${jwt}`;
		}

		const response = await axios.post(
			`${Strapify.apiURL}/api/ezforms/submit`,
			{ headers: headers, formData: formDataJson }
		);
		return response.data;
	} catch (err) {
		throw err
	}
}

export default strapiRequest;
export { strapiRequest, strapiRegister, strapiAuthenticate, strapiEZFormsSubmit }
