const this_script = document.currentScript;
let strapi_api_url;
if (this_script.hasAttribute("data-strapi-api-url")) {
	strapi_api_url = this_script.attributes.getNamedItem("data-strapi-api-url").value;
	//remove trailing slash
	strapi_api_url = strapi_api_url.replace(/\/$/, "");
} else {
	strapi_api_url = "http://localhost:1337";
}

export default strapi_api_url;