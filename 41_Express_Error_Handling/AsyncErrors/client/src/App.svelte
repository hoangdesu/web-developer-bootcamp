<script lang="ts">
  import { Router, Route } from "svelte-routing";

  import Home from "./pages/Home.svelte";
  import NavLink from "./components/NavLink.svelte";
  import FoodDetails from "./pages/FoodDetails.svelte";
  import AddFoodForm from "./pages/AddFoodForm.svelte";
  import EditFoodForm from "./pages/EditFoodForm.svelte";
  import CategoryFood from "./pages/CategoryFood.svelte";

  // let foodList;
  // const URL = "http://localhost:3001/v1/foods";

  // onMount(async () => {
  //   // const response = await fetch(
  //   //     'http://localhost:3001/findAll',
  //   //     {
  //   //         method: 'GET',
  //   //     }
  //   // );
  //   // foodList = await response.json();

  //   const response = await axios.get(URL);
  //   foodList = response.data;
  //   console.log("food list:", foodList);
  // });

  export let url = "";
</script>

<svelte:head>
    <title>Food Nutrition Facts App</title>
</svelte:head>

<main>
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


    <!-- refactor to using Router -->
    <Router {url}>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/new">Add new food</NavLink>
      </nav>
      <div>
        <Route path="/"><Home /></Route>
        <Route path="/foods/:id" component={FoodDetails} />
        <Route path="/new" component={AddFoodForm} />
        <Route path="/foods/:id/edit" component={EditFoodForm} />
        <Route path="/foods/category/:category" let:params>
          <CategoryFood category="{params.category}" />
        </Route>
      </div>
    </Router>

    
    <!-- can also pass props like this as usual, but cannot use path params -->
    <!-- <Route path="details/:id">
          <FoodDetail {foodId} {url} />
        </Route> -->
</main>

<style>
</style>
