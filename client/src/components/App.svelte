<script>
    import CiviconnectSVG from "./CiviconnectSVG.svelte"
    import Header from "./Header.svelte"
    let webflowURL
	let strapiURL = "http://localhost:1337"
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
    <Header bind:webflowURL bind:strapiURL/>

    <div class="content-panel">
        <button class="strapify-button" on:click={onScrape}>STRAPIFY</button>

        <div class="iframe-container">
            <p>{successMessage}</p>
            {#if successMessage === "webflow url successfully downloaded"}
                <iframe
                    src="http://localhost:3000/"
                    title="downloaded preview"
                />
            {/if}
        </div>
    </div>

    <!-- <CiviconnectSVG class="logo-svg" /> -->
</div>

<style>
    :global(:root) {
        --color-yellow: #f3b10d;
        --color-blue: #4c60a4;
        --color-green: #54cd52;
        --color-red: #e74242;
        --color-grey: #4a4b48;
        --color-white: white;
        --color-light-blue: #f6f8ff;
        --color-border: #e4e4e4;
        --color-medium-grey: #b1b1b1;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
        background: var(--color-off-white);
    }

    .content-panel {
		display: flex;
		flex-direction: column;
        width: 100%;
        height: 100%;
        background: var(--color-light-blue);
    }

    /* the style for the logo svg */
    .container :global(.logo-svg) {
        width: auto;
        height: 64px;
        display: block;
        margin-top: auto;
        align-self: flex-end;
        flex-shrink: 0;
    }

    .strapify-button {
		margin-left: 32px;
		margin-top: 32px;
		width: min-content;
        padding: 4px 32px;
        font-size: 16px;
        font-weight: 800;
        color: var(--color-white);
        background: var(--color-yellow);
    }

    .iframe-container {
        width: 100%;
        height: 100%;
        background: var(--color-off-white);
        padding: 32px;
    }

    iframe {
        width: 100%;
        height: 100%;
    }
</style>
