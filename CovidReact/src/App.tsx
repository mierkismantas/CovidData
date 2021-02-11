import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import HomePage from './components/homePage';
import InputPage from './components/inputPage';
import TablePage from './components/tablePage';
import LoginPage from './components/loginPage';
import ChartsPage from './components/chartsPage';
import Header from "./Header";
import { Provider } from "react-redux";
import * as reducer from './components/reducer';
import './global/styles/styles.css';

const App = () => 
<Provider store={reducer.configureStore()}>
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route path='/charts' component={ChartsPage} />
          <Route path='/input'  component={InputPage} />
          <Route path='/table'  component={TablePage} />
          <Route path='/login'  component={LoginPage} />
          <Route path='/'       component={HomePage} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>;

export default App;