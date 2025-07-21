// React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Redux
import { Provider } from "react-redux";

// Components
import App from './App'
import store from "./store";

// Styles
import './index.css';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
