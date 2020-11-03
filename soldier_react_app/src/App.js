import React from 'react';
import './App.css';
import {BrowserRouter as Router,  Route } from 'react-router-dom';
import SoldierHome from './features/soldiers/SoldierHome';
import AddSolder from './features/soldiers/AddSolder';
import EditSolder from './features/soldiers/EditSolder';
const App = () => {
  return (
    <Router>
			  <div>
          <Route exact={true} path="/" component={SoldierHome} />
          <Route exact={true} path="/AddSolder" component={AddSolder} />
          <Route exact={true} path="/EditSolder" component={EditSolder} />
			  </div>
		</Router>
  )
}

export default App;
