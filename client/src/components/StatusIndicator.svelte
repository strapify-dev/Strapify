<div class="container">
    <p>{$$props.text}</p>
    <div class="status-icon" />
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
