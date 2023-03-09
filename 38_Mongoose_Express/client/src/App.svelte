<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  let foodList;
  const URL = 'http://localhost:3001/findAll';

  onMount(async () => {
        // const response = await fetch(
        //     'http://localhost:3001/findAll',
        //     {
        //         method: 'GET',
        //     }
        // );
        // foodList = await response.json();
        
        const response = await axios.get(URL);
        foodList = response.data;
        console.log('food list:', foodList);
      });
</script>

<main>
  <div>
    <h1>Food:</h1>
    {#if foodList}
      <ul>
        {#each foodList as food(food.name)}
          <li>{food.name}: {food.calories} calories</li>
        {/each}
      </ul>
    {/if}
  </div>
</main>

<style>

</style>