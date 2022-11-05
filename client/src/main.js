//import './global.css';
import "/public/body-script0.js"
import "/public/body-script1.js"
import "/public/head-style0.css"

import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;
