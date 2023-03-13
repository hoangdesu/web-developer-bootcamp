<script lang="ts">
    import { Link } from 'svelte-routing';
    import axios from 'axios';
    import { CATEGORIES } from '../constants';
    import { titlelizeString } from '../helpers/strings';

    export let id;

    const HOST = 'http://localhost:3001';
    const ENDPOINT = '/v1/foods/:id'.replace(/:id/i, id);
    const GET_FOOD_BY_ID_ENDPOINT = HOST + ENDPOINT;
    const PUT_FOOD_BY_ID_ENDPOINT = HOST + ENDPOINT + '?_method=PUT';

    console.log(PUT_FOOD_BY_ID_ENDPOINT);
    
    let food;
    axios.get(GET_FOOD_BY_ID_ENDPOINT)
        .then(res => {
            food = res.data;
            console.log('edit form:', food);
        });


</script>

<div>
    {#if food}
        <h2>Editing {food.name}</h2>
        <form action={PUT_FOOD_BY_ID_ENDPOINT} method="POST">
            <table border={0}>
                <tr>
                    <th>Amount per</th>
                    <td>
                        <input type="number" name="amountPerValue" step="0.5" min="0" value={food.amountPer.value} /> 
                        <input type="text" name="amountPerUnit" value={food.amountPer.unit} />
                    </td>
                </tr>
                <tr>
                    <th>Calories (g)</th>
                    <td>
                        <input type="number" name="calories" step="0.1" min="0" value={food.calories} />
                    </td>
                </tr>
                <tr>
                    <th>Protein (g)</th>
                    <td>
                        <input type="number" name="protein" step="0.1" min="0" value={food.protein} />
                    </td>
                </tr>
                <tr>
                    <th>Category</th>
                    <td>
                        <select name="category" id="category">
                            {#each CATEGORIES as category (category)}
                                <option value="{category}" selected={food.category === category}>{titlelizeString(category)}</option>
                            {/each}
                        </select>
                    </td>
                </tr>
                <button type="submit">Save</button>
                <Link to="/foods/{food._id}"><button>Cancel</button></Link>
            </table>
        </form>
    {/if}
</div>

<style>
    th {
        text-align: left;
        padding-right: 20px;
    }
</style>