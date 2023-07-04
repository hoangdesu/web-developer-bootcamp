<script>
    import { CATEGORIES } from "../constants";
    import { titlelizeString } from "../helpers/strings";

    const HOST = 'http://localhost';
    const PORT = 3001;
    const ENDPOINT = '/v1/foods';
    const API = `${HOST}:${PORT}${ENDPOINT}`;
    
</script>

<svelte:head>
    <title>Add new food</title>
</svelte:head>

<div>
    <h1>Add new food</h1>

    <form action={API} method="post">
        <table>
            <tr>
                <td>
                    <label for="name">Food name</label>
                </td>
                <td>
                    <input id="name" type="text" name="name">
                </td>

            </tr>
            <tr>
                <td>
                    <label for="amountPer">Amount Per</label>
                </td>
                <td>
                    <input type="number" step="0.5" min="0" name="amountPerValue" value="100" id="amountPer">
                    <input type="text" name="amountPerUnit" value="grams">
                </td>
            </tr>
            <tr>
                <td>
                    <label for="calories">Calories</label>
                </td>
                <td>
                    <input type="number" step="0.5" min="0" name="calories">
                </td>
            </tr>
            <tr>
                <td>
                    <label for="protein">Protein</label>
                </td>
                <td>
                    <input type="number" step="0.1" min="0" name="protein">
                </td>
            </tr>
            <tr>
                <td>
                    <label for="category">Category</label>
                </td>
                <td>
                    <select name="category" id="category">
                        {#each CATEGORIES as category (category)}
                            <option value="{category}">{titlelizeString(category)}</option>
                        {/each}
                    </select>
                </td>
            </tr>
        </table>
        <button>Submit</button>
    </form>
</div>
