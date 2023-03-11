<script lang="ts">
    import { Router, Route, Link } from 'svelte-routing';
    import axios from 'axios';
    import NavLink from '../src/components/NavLink.svelte';

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

<main>
    <h1>Food Nutrition Facts App</h1>
    <h2>All food in database</h2>
    <ul>
        {#if foodList}
            {#each foodList as food (food._id)}
                <li><Link to="details/{food._id}">{food.name}</Link></li>
            {/each}
        {/if}
    </ul>
</main>

<style>
    li {
        color: purple;
    }
</style>