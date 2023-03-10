<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";
  let foodList;
  const URL = "http://localhost:3001/v1/foods";

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
    console.log("food list:", foodList);
  });
</script>

<main>
  <div>
    <h1>Food Nutrition Fact:</h1>
    {#if foodList}
      <table border={1}>
        <thead>
          <th>Name</th>
          <th>Calories (g)</th>
          <th>Protein (g)</th>
          <th>Category</th>
          <th>Amount per</th>
        </thead>
        <tbody>
          {#each foodList as food (food.name)}
            <tr>
              <td>{food.name}</td>
              <td>{food.calories}</td>
              <td>{food.protein}</td>
              <td>{food.category}</td>
              <td>{food.amountPer.value} {food.amountPer.unit}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</main>

<style>
</style>
