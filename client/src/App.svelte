<script>
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
       // fetchPost()
    })
</script>

<div>
    <h1>Hello!</h1>
    <p>
        Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
        how to build Svelte apps.
    </p>
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
