<script lang="ts">
    import { onMount } from "svelte";
    import { Router, Route, Link } from 'svelte-routing';
    import axios from "axios";

    export let id;

    const URL = "http://localhost:3001/v1/foods/:id".replace(/:id/i, id);

    let food;
    onMount(async () => {
        const response = await axios.get(URL);
        food = response.data;
        console.log("food:", food);
    });
</script>

<svelte:head>
    <title>Nutrition facts for {food && food.name}</title>
</svelte:head>

<div>
    <h1>Nutrition facts</h1>
    {#if food}
        <h2>{food.name}</h2>
        <table border={0}>
            <tr>
                <th>Calories (g)</th>
                <td>{food.calories}</td>
            </tr>
            <tr>
                <th>Protein (g)</th>
                <td>{food.protein}</td>
            </tr>
            <tr>
                <th>Category</th>
                <td>{food.category}</td>
            </tr>
            <tr>
                <th>Amount per</th>
                <td>{food.amountPer.value} {food.amountPer.unit}</td>
            </tr>
        </table>
    {/if}

</div>

<style>
    th {
        text-align: left;
        padding-right: 20px;
    }
</style>