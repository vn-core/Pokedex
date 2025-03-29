import { useState, useEffect } from 'react';
import PokemonInfo from './PokemonInfo';
import './Pokedex.css';

const Pokedex = () => {
    const [currentPokemonId, setCurrentPokemonId] = useState(1);
    const [pokemonData, setPokemonData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const totalPokemons = 649;

    const fetchPokemonData = async (pokemon) => {
        try {
            const [pokemonResponse, speciesResponse] = await Promise.all([
                fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`),
                fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`)
            ]);

            if (!pokemonResponse.ok || !speciesResponse.ok) {
                throw new Error('Pokémon no encontrado');
            }

            const [pokemonData, speciesData] = await Promise.all([
                pokemonResponse.json(),
                speciesResponse.json()
            ]);

            const spanishDescription = speciesData.flavor_text_entries.find(
                entry => entry.language.name === 'es'
            )?.flavor_text || 'Descripción no disponible en español';

            setPokemonData({
                ...pokemonData,
                description: spanishDescription.replace(/\f/g, ' ')
            });
        } catch (error) {
            console.error('Error al cargar el Pokémon:', error);
        }
    };

    useEffect(() => {
        fetchPokemonData(currentPokemonId);
    }, [currentPokemonId]);

    const handleSearch = (e) => {
        e.preventDefault();
        const searchValue = searchTerm.toLowerCase().trim();
        if (searchValue) {
            const pokemonId = !isNaN(searchValue) 
                ? Math.min(Math.max(1, parseInt(searchValue)), totalPokemons)
                : searchValue;
            fetchPokemonData(pokemonId);
        }
        setSearchTerm('');
    };

    const handlePrevious = () => {
        setCurrentPokemonId(prev => prev > 1 ? prev - 1 : totalPokemons);
    };

    const handleNext = () => {
        setCurrentPokemonId(prev => prev < totalPokemons ? prev + 1 : 1);
    };

    return (
        <div className="container">
            <div className="pokedex">
                {pokemonData && (
                    <img 
                        className="pokemonimg" 
                        src={pokemonData.sprites.versions['generation-v']['black-white'].animated.front_default}
                        alt={pokemonData.name}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `${import.meta.env.BASE_URL}assets/img/pokeball-icon.png`;
                        }}
                    />
                )}
                <img 
                    src="./assets/img/rotomdex2.png" 
                    alt="pokedeximg" 
                    className="pokedeximg"
                    onError={(e) => {
                        console.error('Error loading Pokedex image');
                        e.target.style.display = 'none';
                    }}
                />
                
                <h1 className="data">
                    <span className="pkmnnumber">{pokemonData?.id}</span>
                    <span className="pkmnname">
                        {pokemonData?.name.charAt(0).toUpperCase() + pokemonData?.name.slice(1)}
                    </span>
                </h1>

                <form onSubmit={handleSearch}>
                    <input 
                        type="search"
                        className="inputsearch"
                        placeholder="Name or Number"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        required
                    />
                </form>

                <div className="buttons">
                    <button onClick={handlePrevious}>&lt; PREV</button>
                    <button onClick={handleNext}>NEXT &gt;</button>
                </div>
            </div>

            {pokemonData && <PokemonInfo pokemon={pokemonData} />}
        </div>
    );
};

export default Pokedex; 