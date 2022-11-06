<script>
    import CiviconnectSVG from "./CiviconnectSVG.svelte"
    let webflowURL
    let successMessage = "waiting for url"

    async function fetchPost(url) {
        const postResponse = await fetch("/api/test", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                webflowURL: url,
            }),
        })

        if (!postResponse) {
            console.error("failed to post to server")
            successMessage = "failed to post url"
        }

        if (postResponse.ok) {
            console.log(await postResponse.text())
            console.log(postResponse)
            successMessage = "webflow url successfully downloaded"
        } else {
            successMessage = "server failure"
        }
    }

    function onScrape() {
        console.log(webflowURL)
        if (!webflowURL) {
            alert("Please enter a URL")
        } else {
            fetchPost(webflowURL)
            successMessage = "working..."
        }
    }
</script>

<div class="container">
    <h1>Civiconnect Strapify</h1>

    <div class="url-input">
        <input
            type="url"
            bind:value={webflowURL}
            placeholder="Enter the url for your webflow site..."
        />
        <button on:click={onScrape} type="button">Scrape</button>
    </div>



    <div class="iframe-container">
		<p>{successMessage}</p>
		{#if successMessage === "webflow url successfully downloaded"}
        <iframe src="http://localhost:3000/" title="downloaded preview" />
		{/if}
    </div>

    <CiviconnectSVG class="logo-svg" />
</div>

<style>
    :global(:root) {
        --color-yellow: #f3b10d;
        --color-grey: #4a4b48;
        --color-white: white;
        --color-off-white: #fafaff;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
        gap: 64px;
        background: var(--color-off-white);
    }

    /* the style for the logo svg */
    .container :global(.logo-svg) {
        width: auto;
        height: 64px;
        display: block;
        margin-top: auto;
        align-self: flex-end;
		flex-shrink: 0
    }

    h1 {
        color: var(--color-yellow);
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 400;
    }

    input {
        border: none;
        background: var(--color-white);
        border: 1px solid #cacaca;
        width: 70vw;
        height: 38px;
        borderradius: 8px;
    }

    button {
        display: block;
        background: var(--color-yellow);
        color: var(--color-white);
        font-weight: 800;
        font-size: 1rem;
        border: none;
        text-shadow: 2px 2px rgba(0, 0, 0, 0.3);
        padding: 8px;
    }

    .iframe-container {
        width: 100%;
        height: 100%;
		background: var(--color-off-white);
		padding: 32px
    }

    iframe {
        width: 100%;
		height: 100%;
    }
</style>
