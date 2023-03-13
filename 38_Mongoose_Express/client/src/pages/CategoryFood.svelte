<script lang="ts">
    import { onMount } from "svelte";
    import axios from 'axios';
    import { titlelizeString } from "../helpers/strings";

    export let category;

    const URL = 'http://localhost:3001/v1/foods?category=' + category;
    let foodList;

    onMount(() => {
        axios.get(URL).then(res => {
            foodList = res.data;
        });
    });
</script>

<svelte:head>
    <title>Category: {titlelizeString(category)}</title>
</svelte:head>

<div>
    {#if foodList}
    <h1>{titlelizeString(category)} foods ({foodList.length})</h1>
        <ol>
            {#each foodList as food (food)}
                <li>{food.name}</li>
            {/each}
        </ol>
    {/if}
</div>
