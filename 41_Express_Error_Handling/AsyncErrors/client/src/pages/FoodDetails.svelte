<script lang="ts">
    import { onMount } from "svelte";
    import { Link, navigate } from 'svelte-routing';
    import axios from "axios";
    import { titlelizeString } from "../helpers/strings";

    export let id;

    const URL = "http://localhost:3001/v1/foods/:id".replace(/:id/i, id);

    let food;
    let errorMsg;
    onMount(async () => {
        try {
            const response = await axios.get(URL);
            food = response.data;
            console.log("food data:", response);
        } catch (err) {
            errorMsg = err.response.data;
            console.log('error:', errorMsg);
        }
    });

    const deleteHandler = async () => {
        if (confirm(`Are you sure to delete ${food.name}?`)) {
            axios.delete(URL).then(res => {
                navigate('/', { replace: true });
            });
        }
    };

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
                <th>Amount per</th>
                <td>{food.amountPer.value} {food.amountPer.unit}</td>
            </tr>
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
                <Link to="/foods/category/{food.category}">{titlelizeString(food.category)}</Link>
            </tr>
            <Link to="foods/{id}/edit">
                <button>✏️ Edit</button>
            </Link>
            <button on:click={deleteHandler}>🗑 Delete</button>
        </table>
    {:else}
        <div>
            <p>{errorMsg}</p>
            <Link to="/"><button>Back</button></Link>
        </div>
    {/if}

    
</div>

<style>
    th {
        text-align: left;
        padding-right: 20px;
    }
</style>