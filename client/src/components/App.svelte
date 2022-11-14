<script>
    import { onMount } from "svelte"
    import CiviconnectSVG from "./CiviconnectSVG.svelte"
    import Header from "./Header.svelte"
    let webflowURL 
    let strapiURL 
    let successMessage = "waiting for url"
    let downloadURL = ""
    let previewURL = ""

    async function fetchPost(url) {
        const postResponse = await fetch("/api/strapify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                webflowURL: url,
                strapiURL: strapiURL,
            }),
        })

        if (!postResponse) {
            console.error("failed to post to server")
            successMessage = `failed to post url: no response from server`
            return
        }

        if (postResponse.ok) {
            const responseData = await postResponse.json()
            //   console.log(responseData)
            successMessage = "webflow url successfully downloaded"
            previewURL = responseData.previewURL
            downloadURL = responseData.downloadURL
            console.log(previewURL)
        } else {
            const responseText = await postResponse.text()
            //   console.log(responseText)
            successMessage = `server failure: ${postResponse.status} ${postResponse.statusText} ${responseText}`
        }
    }

    function onScrape() {
        if (!webflowURL) {
            alert("Please enter a URL")
        } else {
            fetchPost(webflowURL)
            successMessage = "working..."
        }
    }

    onMount(async () => {
        //check local storage for strapiURL
        const strapiURLFromStorage = localStorage.getItem("strapiURL")
        if (strapiURLFromStorage) {
            strapiURL = strapiURLFromStorage
        }

        //check local storage for webflowURL
        const webflowURLFromStorage = localStorage.getItem("webflowURL")
        if (webflowURLFromStorage) {
            webflowURL = webflowURLFromStorage
        }
    })

    $: /* save webflowURL */ {
        if (webflowURL !== undefined) {
            localStorage.setItem("webflowURL", webflowURL)
        }
    }

	$: /* save strapiURL */ {
		if (strapiURL  !== undefined) {
			localStorage.setItem("strapiURL", strapiURL)
		}
	}
</script>

<div class="container">
    <Header bind:webflowURL bind:strapiURL />

    <div class="content-panel">
        <div class="button-container">
            <button class="strapify-button" on:click={onScrape}>
                STRAPIFY
            </button>
            {#if downloadURL}
                <a
                    class="strapify-link"
                    href={downloadURL}
                    download="webflow-site.zip">Download</a
                >
            {/if}
        </div>

        <div class="iframe-container">
            {#if successMessage && successMessage !== "waiting for url" && successMessage !== "webflow url successfully downloaded"}
                <p>{successMessage}</p>
            {/if}

            {#if successMessage === "webflow url successfully downloaded"}
                <iframe src={previewURL} title="downloaded preview" />
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

    .strapify-link {
        margin-left: 32px;
        margin-top: 32px;
        width: min-content;
        padding: 4px 32px;
        font-size: 16px;
        font-weight: 800;
        color: var(--color-white);
        background: var(--color-grey);
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
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
    }
</style>
