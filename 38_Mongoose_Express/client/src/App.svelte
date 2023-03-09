<script lang="ts">
  import { onMount } from 'svelte';
  let foodList;

  onMount(async () => {
        const response = await fetch(
            'http://localhost:3001/findAll',
            {
                method: 'GET',
            }
        );
        foodList = await response.json();
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