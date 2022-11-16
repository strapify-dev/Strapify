<script>
    import { onMount } from "svelte"
    import urlExist from "url-exist"

    let urlStatus = false
    let iconRef

    onMount(async () => {
        async function onTick() {
           // urlStatus = await urlExist(`${url}`)
        }


		//urlStatus = await urlExist(`${url}`)
        const interval = setInterval(onTick, 20000)

        return () => {
            clearInterval(interval)
        }
    })

    $: {
        if (iconRef) {
            iconRef.style.background = urlStatus ? "var(--color-green)" : "var(--color-red)"
        }
    }

    //export let url 
</script>

<div class="container">
    <p>{$$props.text}</p>
    <div class="status-icon" bind:this={iconRef} />
</div>

<style>
    .container {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    p {
        white-space: nowrap;
        font-size: 12px;
        font-weight: 700;
        color: var(--color-grey);
    }

    .status-icon {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--color-red);
    }
</style>
