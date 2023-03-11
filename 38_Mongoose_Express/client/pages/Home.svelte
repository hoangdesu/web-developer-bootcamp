<script>
    import { Router, Route, Link } from 'svelte-routing';
    export let foodList;
</script>

<main>
    <h1>Home</h1>
    {#if foodList}
        {#each foodList as food (food._id)}
            <Link to="details/{food._id}">{food.name}</Link>
        {/each}
    {/if}
</main>