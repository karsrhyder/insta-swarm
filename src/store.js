import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistentStore } from "redux-pouchdb-plus";
import PouchDB from "pouchdb";
import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";
import createSagaMiddleware from "redux-saga";
import Web3 from "web3";
import FDS from "fds.js";

window.fds = new FDS();
window.web3 = new Web3("http://goerli-geth.dappnode:8545");

const sagaMiddleware = createSagaMiddleware();
const db = new PouchDB({ name: "instaSwarm" });
const pouchMiddleware = persistentStore({ db });

const initialState = {};

const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware, ...getDefaultMiddleware()],
  enhancers: [pouchMiddleware],
  preloadedState: initialState,
});

export default store;

// For dev purposes
window.dispatch = (type, kwargs) => {
  store.dispatch({ type, ...kwargs });
};

sagaMiddleware.run(rootSaga);
