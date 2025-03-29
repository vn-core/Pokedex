import Pokedex from './components/Pokedex'
import './App.css'

function App() {
  return (
    <div style={{
      backgroundImage: `url(./assets/img/new_wallpaper.png)`,
      backgroundSize: '35em',
      backgroundRepeat: 'repeat',
      minHeight: '100vh',
      margin: 0,
      padding: 0
    }}>
      <Pokedex />
    </div>
  )
}

export default App