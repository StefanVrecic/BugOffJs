import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './Client/App';
import * as serviceWorker from './Client/serviceWorker';
import { BrowserRouter } from 'react-router-dom';

import { createStore } from 'redux';
import reducer from './Client/store/reducer';
import { Provider } from 'react-redux';

const store = createStore(reducer);


const app = (
    <Provider store={store}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </Provider>
);
ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();
