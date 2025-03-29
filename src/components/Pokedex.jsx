import { useState, useEffect } from 'react';
import PokemonInfo from './PokemonInfo';
import './Pokedex.css';

const Pokedex = () => {
    const [currentPokemonId, setCurrentPokemonId] = useState(1);
    const [pokemonData, setPokemonData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const totalPokemons = 649;

    const fetchPokemonData = async (pokemon) => {
        setIsLoading(true);
        setError(null);
        try {
            const [pokemonResponse, speciesResponse] = await Promise.all([
                fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }),
                fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
            ]);

            if (!pokemonResponse.ok || !speciesResponse.ok) {
                throw new Error('Error al cargar el Pokémon');
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
            setError('Error al cargar el Pokémon. Por favor, intenta de nuevo.');
            setPokemonData(null);
        } finally {
            setIsLoading(false);
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
                {isLoading ? (
                    <div className="loading">Cargando...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : pokemonData && (
                    <img 
                        className="pokemonimg" 
                        src={pokemonData.sprites.versions['generation-v']['black-white'].animated.front_default}
                        alt={pokemonData.name}
                        onError={(e) => {
                            console.error('Error loading Pokemon image');
                            e.target.onerror = null;
                            e.target.src = './assets/img/pokeball-icon.png';
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
                        {pokemonData?.name && pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}
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

            {!isLoading && !error && pokemonData && <PokemonInfo pokemon={pokemonData} />}
        </div>
    );
};

export default Pokedex; 