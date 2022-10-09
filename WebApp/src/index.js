import React from 'react';
import ReactDOM from 'react-dom';

// Components
import App from './App';

// Utils
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from 'react-cookie';
import { ContextProvider } from "./utils/contextModule";
import reportWebVitals from './reportWebVitals';

// Styles
import './index.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

require('dotenv').config()

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <BrowserRouter>
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </BrowserRouter>
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();