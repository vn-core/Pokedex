// Funciones auxiliares
const capitalizeName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

// Variables del DOM
const pokemonName = document.querySelector('.pkmnname');
const pokemonNumber = document.querySelector('.pkmnnumber');
const pokemonImage = document.querySelector('.pokemonimg');
const pokemonType = document.querySelector('.pkmntype');
const pokemonWeight = document.querySelector('.pkmnweight');
const pokemonHeight = document.querySelector('.pkmnheight');
const pokemonDescription = document.querySelector('.pkmndescription');
const pokemonStats = document.querySelector('.pkmnstats');
const form = document.querySelector('form');
const input = document.querySelector('.inputsearch');

// Variables globales
let currentPokemonId = 1;
const totalPokemons = 649;

//LIMITE NUM POKEMON
const limitPokemonId = (id) => {
    if (id < 1) return 1; 
    if (id > totalPokemons) return totalPokemons;
    return id;
};

// Funciones de la API
const fetchPokemon = async (pokemon) => {
    try {
        const ApiResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        if (!ApiResponse.ok) throw new Error('Pokémon no encontrado');
        const data = await ApiResponse.json();
        return data;
    } catch (error) {
        console.error('Error al obtener datos del Pokémon:', error);
        throw error;
    }
};

const fetchPokemonSpecies = async (pokemon) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
        if (!response.ok) throw new Error('Descripción no encontrada');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener la descripción:', error);
        return null;
    }
};

//IMAGENES SEGÚN TIPO
const pokemonTypeContainer = document.querySelector('.pkmn-types');

const typeImages = {
    normal: 'normal.png',
    fire: 'fire.png',
    water: 'water.png',
    grass: 'grass.png',
    electric: 'electric.png',
    ice: 'ice.png',
    fighting: 'fight.png',
    poison: 'poison.png',
    ground: 'ground.png',
    flying: 'flying.png',
    psychic: 'psychic.png',
    bug: 'bug.png',
    rock: 'rock.png',
    ghost: 'ghost.png',
    dragon: 'dragon.png',
    dark: 'dark.png',
    steel: 'steel.png',
    fairy: 'fairy.png'
};

// Funciones de actualización de UI
const updateTypeImages = (types) => {
    pokemonTypeContainer.innerHTML = '';

    types.forEach(typeObj => {
        const typeName = typeObj.type.name.toLowerCase();
        if (typeImages[typeName]) {
            const img = document.createElement('img');
            img.src = `./assets/img/${typeImages[typeName]}`;
            img.alt = typeName;
            img.classList.add('pkmntype-img');
            pokemonTypeContainer.appendChild(img);
        }
    });
};

const updateStats = (stats) => {
    pokemonStats.innerHTML = '';
    stats.forEach(statObj => {
        const statName = statObj.stat.name;
        const statValue = statObj.base_stat;
        const statElement = document.createElement('div');
        statElement.classList.add('stat');
        statElement.innerHTML = `<strong>${capitalizeName(statName)}:</strong> ${statValue}`;
        pokemonStats.appendChild(statElement);
    });
};

// Colores de marco para cada tipo de Pokémon
const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
};

// Función para actualizar el color del borde según el tipo
const updateBorderColor = (types) => {
    const datosContainer = document.querySelector('.datos');
    if (types && types.length > 0) {
        const firstType = types[0].type.name.toLowerCase();
        const color = typeColors[firstType] || '#71B3F1';
        datosContainer.style.borderColor = color;
        datosContainer.style.boxShadow = `0 0 15px ${color}80`;
    }
};

// Renderizado principal
const renderPokemon = async (pokemon) => {
    try {
        const data = await fetchPokemon(pokemon);
        const speciesData = await fetchPokemonSpecies(pokemon);

        // Actualizar información básica
        pokemonName.innerHTML = capitalizeName(data.name);
        pokemonNumber.innerHTML = data.id;
        pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
        pokemonWeight.innerHTML = `${data.weight / 10}`;
        pokemonHeight.innerHTML = `${data.height / 10}`;
        
        // Actualizar tipos y color del borde
        updateTypeImages(data.types);
        updateBorderColor(data.types);

        // Actualizar descripción
        if (speciesData && speciesData.flavor_text_entries) {
            const spanishDescription = speciesData.flavor_text_entries.find(
                entry => entry.language.name === 'es'
            );
            if (spanishDescription) {
                pokemonDescription.innerHTML = spanishDescription.flavor_text.replace(/\f/g, ' ');
            } else {
                pokemonDescription.innerHTML = 'Descripción no disponible en español';
            }
        } else {
            pokemonDescription.innerHTML = 'Descripción no disponible';
        }

        // Actualizar estadísticas
        updateStats(data.stats);
    } catch (error) {
        console.error('Error al cargar el Pokémon:', error);
        pokemonName.innerHTML = 'Error';
        pokemonNumber.innerHTML = '???';
        pokemonDescription.innerHTML = 'Error al cargar la información';
    }
};

// Event Listeners
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchTerm = input.value.trim().toLowerCase();
    
    // Si es un número, usar limitPokemonId, si no, usar el término directamente
    const pokemonId = !isNaN(searchTerm) ? limitPokemonId(Number(searchTerm)) : searchTerm;
    
    renderPokemon(pokemonId);
    input.value = '';
});

//LÓGICA DE LISTA POKEMON
const nextPokemon = () => {
    if (currentPokemonId < totalPokemons) {
        currentPokemonId++;
    } else {
        currentPokemonId = 1; // Volver al primero cuando llegues al último
    }
    renderPokemon(currentPokemonId);
};

const prevPokemon = () => {
    if (currentPokemonId > 1) {
        currentPokemonId--;
    } else {
        currentPokemonId = totalPokemons; // Volver al último cuando llegues al primero
    }
    renderPokemon(currentPokemonId);
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderPokemon(1);
});

// BOTONES DE NAVEGACION
document.querySelector('.btn-next').addEventListener('click', nextPokemon);
document.querySelector('.btn-prev').addEventListener('click', prevPokemon);


