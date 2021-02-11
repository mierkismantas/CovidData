//todo: example of how reducer can be used - saving 'loggedIn' boolean
import { createStore, combineReducers, Store } from "redux";

const initialState =  [ {loggedIn: false} ] 

export type myObject = {
	loggedIn: boolean;
  };
export type AppState = {
	objects: myObject[];
  };

  export function addObject(loggedIn: boolean) {
    return {
      type: "addObject",
      payload: loggedIn
    } as const;
  }
  
  export type LogIns = ReturnType<typeof addObject>;
  
  export function objectReducer(state: myObject[] = initialState, logIn: LogIns) {
  switch (logIn.type) {
    case "addObject":
      return state.concat({ loggedIn: logIn.payload });
  }
  return state;
}

export const rootReducer = combineReducers<AppState>({
  objects: objectReducer
});

export function configureStore(): Store<AppState> {
  const store = createStore(rootReducer, undefined);
  return store;
}