import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { Provider } from 'react-redux'
import { legacy_createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducers from './redux/reducers'
import mySaga from './redux/sagas'
import { CookiesProvider } from "react-cookie";
import './lang/config/i18n'
const sagaMiddleware = createSagaMiddleware()
const store = legacy_createStore (reducers, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(mySaga)
ReactDOM.render(
  <CookiesProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </CookiesProvider>,
  document.getElementById('root')
);


