<script>
    import App from "./App.svelte"

	export let placeholder = "placeholder"
	export let name = "name"
	export let value 
	export let restProps = {}

</script>

<input type="url" placeholder={placeholder} name={name} {...restProps} bind:value={value}/>

<style>
    input {
        width: 400px;
        height: 26px;
		padding-left: 16px;
        border-radius: max(100vw, 100vh);
        border: 1px solid var(--color-border);
        background: var(--color-light-blue);
    }
</style>
