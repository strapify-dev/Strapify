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
		const errorStrings = []
		errorStrings.push(`${err.message}`);
		errorStrings.push(`${err.code}`);

		if (err.response) {
			if (err.response.status === 403) {
				errorStrings.push(`Did you try to access a collection without authenticating first?`);
			}
			if (err.response.status === 404 || err.response.status === 400) {
				errorStrings.push(`Did you make sure the collection exists?`);
				errorStrings.push(`Did you use the pluralized name of the collection?`);
				errorStrings.push(`Did you use replace underscores with dashes in the collection name?`);
			}
		} else {
			errorStrings.push(`no response recieved from the Strapi server`);
		}

		errorStrings.push("see error below for more details");
		Strapify.error(...errorStrings)

		throw new Error(err);
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
		const errorStrings = []
		errorStrings.push(`${err.message}`);
		errorStrings.push(`${err.code}`);

		if (err.response) {
			if (err.response.status === 403) {
				errorStrings.push(`Do you have registration enabled for the public role?`);
			}
			if (err.response.status === 400) {
				errorStrings.push(`Did the given username, email and password meet Strapi's validation requirements?`);
				errorStrings.push(`Does a user with the given email already exist?`);
			}
		} else {
			errorStrings.push(`no response recieved from the Strapi server`);
		}

		errorStrings.push("see error below for more details");
		Strapify.error(...errorStrings)

		throw new Error(err);
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
		const errorStrings = []
		errorStrings.push(`${err.message}`);
		errorStrings.push(`${err.code}`);

		if (err.response) {
			if (err.response.status === 400) {
				errorStrings.push(`Is the user blocked?`);
			}
		} else {
			errorStrings.push(`no response recieved from the Strapi server`);
		}

		errorStrings.push("see error below for more details");
		Strapify.error(...errorStrings)

		throw new Error(err);
	}
}

export default strapiRequest;
export { strapiRequest, strapiRegister, strapiAuthenticate }
