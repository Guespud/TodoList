import { createRoot } from 'react-dom/client'
import { App } from './App.jsx'
import { rootReducer } from './redux/rootReducer.js';
import { Provider } from 'react-redux';
import './index.css'


createRoot(document.getElementById('root')).render(
    <Provider store={rootReducer}>
      <App />
    </Provider>
)
