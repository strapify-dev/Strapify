<script>
    import StatusIndicator from "./StatusIndicator.svelte"
    import URLInput from "./URLInput.svelte"

    export let webflowURL = ""
    export let strapiURL = ""
</script>

<div class="container">
    <h1>CIVICONNECT <span>STRAPIFY</span></h1>

    <div class="link-inputs-container">
        <URLInput
            bind:value={webflowURL}
            restProps={{
                placeholder: "http://your-published-site.webflow.io",
                name: "webflow-url",
            }}
        />
        <URLInput
            bind:value={strapiURL}
            restProps={{
                placeholder: "http://localhost:1337",
                name: "strapi-url",
                default: "http://localhost:1337",
            }}
        />

        <div class="status-indicators-container">
            <StatusIndicator text="Strapi status" url={strapiURL}/>
            <StatusIndicator text="Server status" url={"http://localhost:3000"}/>
            <StatusIndicator text="Webflow site status" url={webflowURL}/>
        </div>
    </div>
</div>

<style>
    /* :global(:root) {
		--color-yellow: #f3b10d;
		--color-blue: #4c60a4;
		--color-grey: #4a4b48;
		--color-white: white;
		--color-off-white: #fafaff;
	} */

    .container {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        width: 100%;
        min-height: 110px;
        padding: 8px 32px 8px 64px;
        background: var(--color-white);
    }

    .link-inputs-container {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-left: auto;
    }

    .status-indicators-container {
        display: flex;
        flex-direction: row;
        margin-top: 8px;
        padding-left: 12px;
        gap: 12px;
    }

    h1 {
        color: var(--color-yellow);
        font-size: 40px;
        font-weight: 700;
    }

    h1 > span {
        font-size: 52px;
        color: var(--color-grey);
    }
</style>
