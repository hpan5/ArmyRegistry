import React from 'react';
import './App.css';
import {BrowserRouter as Router,  Route } from 'react-router-dom';
import SoldierHome from './features/soldiers/SoldierHome';
const App = () => {
  return (
    <Router>
			  <div>
          <Route exact={true} path="/" component={SoldierHome} />
			  </div>
		</Router>
  )
}

export default App;
