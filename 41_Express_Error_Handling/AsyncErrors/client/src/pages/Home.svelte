<script lang="ts">
    import { Router, Route, Link } from 'svelte-routing';
    import axios from 'axios';
    import { onMount } from 'svelte';

    const URL = "http://localhost:3001/v1/foods";

    let searchQuery = '';
    
    let foodList;
    const fetchFoodList = async () => {
        const response = await axios.get(URL);
        foodList = response.data;
    };

    onMount(async () => {
        await fetchFoodList();
    });

    const onSearchSubmit = async (evt) => {
        console.log(searchQuery);
        if (searchQuery)
        await axios.get(URL + `?name=${searchQuery}`).then(res => {
            foodList = res.data;
        });
        searchQuery = "";
    }

    const onSearchClear = async (evt) => {
        await fetchFoodList();
    }
</script>

<svelte:head>
    <title>Food Nutrition Facts App</title>
</svelte:head>

<main>
    <h1>Food Nutrition Facts App</h1>
    {#if foodList}
    <h2>All food in database ({foodList.length})</h2>

        <form on:submit|preventDefault={onSearchSubmit} >
            <input placeholder="Food name..." type="text" bind:value={searchQuery} />
            <button>Search</button>
            <button on:click={onSearchClear}>Clear</button>
        </form>

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