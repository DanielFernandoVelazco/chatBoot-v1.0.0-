import React, { useState } from 'react';
// Estas rutas asumen que tienes la carpeta 'pages' dentro de 'src'
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
    // Estado para controlar qué pantalla mostrar
    const [isLogin, setIsLogin] = useState(false);

    const toggleView = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="App">
            {/* Si isLogin es true muestra Login, si no muestra Register */}
            {isLogin ? (
                <Login onToggle={toggleView} />
            ) : (
                <Register onToggle={toggleView} />
            )}
        </div>
    );
}

export default App;