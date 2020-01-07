import React from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
// import thunk from 'redux-thunk';

import './index.css';
import App from './Client/App';
import * as serviceWorker from './Client/serviceWorker';
import { BrowserRouter } from 'react-router-dom';


// import cardReducer from '/store/reducers/cardReducer';


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


// const store = createStore(cardReducer);

// const app = (
//     <Provider store={store}>
//             <App />
//     </Provider>
// );
const app = (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();
