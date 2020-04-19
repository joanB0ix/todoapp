import React from 'react';
import './App.scss';
import Home from './Components/Home/Home';
import { useCookies } from 'react-cookie';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import TodoList from './Components/TodoList/TodoList';

function App() {
  const [cookies, ] = useCookies(['token']);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/'>
            {
              cookies.token ?
              <Redirect to='/todolist'/>
              : <Home/>
            }
          </Route>
          <Route exact path='/todolist'>
            {
              cookies.token ?
              <TodoList/>
              : <Redirect to='/'/>
            }
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
