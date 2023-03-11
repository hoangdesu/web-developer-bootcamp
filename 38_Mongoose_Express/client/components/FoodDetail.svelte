<script lang="ts">

    import axios from "axios";
    import { onMount } from "svelte";
    export let foodId;
    export let url;
    export let id;

    const URL = "http://localhost:3001/v1/foods/:id".replace(/:id/i, id);

    let food;
    onMount(async () => {
    // const response = await fetch(
    //     'http://localhost:3001/findAll',
    //     {
    //         method: 'GET',
    //     }
    // );
    // foodList = await response.json();

    const response = await axios.get(URL);
    food = response.data;
    console.log("food:", food);
});
</script>

<div>
    <h1>Food detail</h1>
    <p>Food id: {foodId}</p>
    <p>URL: {url}</p>
    <p>id {id}</p>
    {#if food} 
        <p class="">{food.name}</p>
    {/if}
</div>

<style>

</style>