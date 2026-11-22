import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// import './styles/variables.css';
// import './styles/global.css';
// import './styles/landing.css';
// import './styles/design-system.css';
// Dejar comentados los archivos de estilo de arriba, hasta ver que en este nuevo archivo unificado de estilos no se rompa la app. Luego, si todo funciona bien, borrar los archivos de estilo antiguos y dejar solo este nuevo archivo de estilos.
import './styles/skillup-styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
