const btn = document.querySelector('#btn2');
const form = document.querySelector('form');
let i = 1;

btn.addEventListener('click', (e) => {
    e.preventDefault();
    try {
    (async () => {
        const showTitle = form.showTitle.value;
        const BASE_URL = 'https://api.tvmaze.com/search/shows?q='
        const res = await axios.get(`${BASE_URL}${showTitle}`);
        console.log('DATA', res.data);

        const Show = (props) => {
            const { title, imageURL, premiered } = props;
            return (
                <div className="card">
                    <img src={imageURL} alt="" style={{ width: '100%' }}></img>
                    <h3>{title}</h3>
                    <p>({premiered})</p>
                </div>
            )
        };

        const App = () => {
            // just testing if axios works here :/ it does :)
            // axios.get(`https://pokeapi.co/api/v2/pokemon/${++i}`)
            //     .then(res => console.log(res.data.name));
            if (res.data.length === 0) {
                return <p>Nothing found :/</p>
            }

            return (
                <div className="app">
                    {res.data.map(show => {
                        let image;
                        if (!show.show.image) {
                            image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png';
                        } else {
                            image = show.show.image.original;
                        }
                        return <Show title={show.show.name} imageURL={image} premiered={show.show.premiered}/> 
                    })}
                </div>
            );
        }
        
        ReactDOM.render(<App />, document.querySelector('#showsList'));

        form.elements.showTitle.value = '';
    })();
    } catch (err) {
        console.log('Something went wrong:', err);
    }
});

    
// CRAPPIEST CODE I'VE EVERY WRITTEN BUT IT'S FUKING FUN =)))
// NOT SURE WHY IT WORKED, BUT IT DID :)) LOL