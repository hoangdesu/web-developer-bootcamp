<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";
  import { Router, Route, Link } from 'svelte-routing';

  import Home from "../pages/Home.svelte";
  import NavLink from "./components/NavLink.svelte";
  import FoodDetail from "../components/FoodDetail.svelte";

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

  export let url = ""
</script>

<main>
  <div>
    <!-- <h1>Food Nutrition Fact:</h1> -->
    <!-- <Link to="food">Food</Link> -->
    <!-- {#if foodList} -->
    <!-- <table border={1}>
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
      </table> -->
    <!-- {/if} -->

    <Router url="{url}">
      
        <NavLink to="/">Home</NavLink>
        <!-- <Link to="/">Home</Link> -->
        <!-- <NavLink to="details">Details</NavLink>
        <NavLink to="blog">Blog</NavLink> -->
        <!-- <a href="details/{food._id}">{food.name}</a> -->
        
        <!-- {#if foodList}
          {#each foodList as food (food._id)}
            <Link to="details/{food._id}">{food.name}</Link>
          {/each}
        {/if} -->
      
      <div>
        <!-- <Route path="blog/:id" component="{BlogPost}" /> -->
        <Route path="/"><Home {foodList} /></Route>
        <!-- <Route path="details/:id">
          <FoodDetail foodId={"foodId"} url={"url"} />
        </Route> -->
        <Route path="details/:id" component={FoodDetail} />
        <!-- <Route path="about" component="{About}" /> -->
      </div>
    </Router>

    
  </div>
</main>

<style>
</style>
