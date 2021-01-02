import React, {useState} from 'react';
import './App.css';

import Header from './components/Header/Header';
import LoginForm from './components/LoginForm/LoginForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
//import PrivateRoute from './utils/PrivateRoute';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import AlertComponent from './components/AlertComponent/AlertComponent';  

function App() {
  const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);
  console.log('isAuthenticated sessionStorage: ',sessionStorage.length);
  

  return (
 
    <Router>
    <div className="App">
      <Header title={title} updateTitle={updateTitle}/>
        <div className="container d-flex align-items-center flex-column">
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage}/>
          <Switch>
            <Route path="/" exact={true}>   
              <Dashboard showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>         
            <Route path="/register">
              <RegistrationForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/login">
              <LoginForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            {/* <PrivateRoute path="/home">
              <Home/>
            </PrivateRoute> */}
            <Route path="/home">
              <Home showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
          </Switch>
          
        </div>
    </div>
    </Router>
  );
}

export default App;