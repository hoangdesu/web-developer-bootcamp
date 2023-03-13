<script lang="ts">
    import { Router, Route, Link } from 'svelte-routing';
    import axios from 'axios';
    import NavLink from '../components/NavLink.svelte';

    const URL = "http://localhost:3001/v1/foods";
    
    let foodList;
    const fetchFoodList = async () => {
        const response = await axios.get(URL);
        return response.data;
    };

    fetchFoodList().then(data => {
        foodList = data
        console.log("foodList:", foodList);
    });
</script>

<svelte:head>
    <title>Food Nutrition Facts App</title>
</svelte:head>

<main>
    <h1>Food Nutrition Facts App</h1>
    {#if foodList}
        <h2>All food in database ({foodList.length})</h2>
        <ul>
            {#each foodList as food (food._id)}
                <li><Link to="/foods/{food._id}">{food.name}</Link></li>
            {/each}
        </ul>
    {/if}
</main>

<style>
    li {
        color: purple;
    }
</style>