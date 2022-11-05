<script>
	import "/public/head-script0.js"
import "/public/body-script0.js"
import "/public/body-script1.js"
import "/public/head-style0.css"
    import { onMount } from "svelte"

    async function fetchPost() {
        const postResponse = await fetch("/api/test", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postMessage: "testing post",
            }),
        })

        if (!postResponse) {
            console.error("failed to post to server")
        }

        if (postResponse.ok) {
            console.log(await postResponse.text())
            console.log(postResponse)
        }
    }

    onMount(() => {
        fetchPost()
    })

    export let name
</script>

<div>
	{@html "<script src=/public/body-script0.js></script>"}
	{@html "<script src=/public/body-script1.js></script>"}
    <h1>Hello {name}!</h1>
    <p>
        Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
        how to build Svelte apps.
    </p>
	<div class="div-block"></div><a data-w-id="14ad43d4-295c-6378-5c80-4489641ad3bd" style="opacity:0" href="/#" class="button w-button">Button Text</a>
</div>

<style>
    div {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        div {
            max-width: none;
        }
    }
</style>
