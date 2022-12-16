import axios from "axios";
import Strapify from "../Strapify";

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
		throw err
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
