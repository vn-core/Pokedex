import { useEffect, useState } from 'react';
import './PokemonInfo.css';

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

const PokemonInfo = ({ pokemon }) => {
    const [borderColor, setBorderColor] = useState('#71B3F1');

    useEffect(() => {
        if (pokemon.types && pokemon.types.length > 0) {
            const firstType = pokemon.types[0].type.name.toLowerCase();
            setBorderColor(typeColors[firstType] || '#71B3F1');
        }
    }, [pokemon]);

    return (
        <div className="datos" style={{ 
            borderColor: borderColor,
            boxShadow: `0 0 15px ${borderColor}80`
        }}>
            <h2>Información del Pokémon</h2>

            <div className="pkmn-types">
                {pokemon.types.map((typeObj, index) => (
                    <img
                        key={index}
                        className="pkmntype-img"
                        src={`./assets/img/${typeObj.type.name}.png`}
                        alt={typeObj.type.name}
                        onError={(e) => {
                            console.error(`Error loading type image: ${typeObj.type.name}`);
                            e.target.style.display = 'none';
                        }}
                    />
                ))}
            </div>

            <p><strong>Altura:</strong> <span>{pokemon.height / 10} m</span></p>
            <p><strong>Peso:</strong> <span>{pokemon.weight / 10} kg</span></p>
            <p><strong>Descripción:</strong> <span>{pokemon.description}</span></p>

            <h3>Estadísticas:</h3>
            <div className="pkmnstats">
                {pokemon.stats.map((stat, index) => (
                    <div key={index} className="stat">
                        <strong>{stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}:</strong> {stat.base_stat}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PokemonInfo; 