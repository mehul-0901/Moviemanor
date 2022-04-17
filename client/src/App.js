import './App.css';
import Home from './components/Home';
import NavBar from './components/NavBar';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import React, {useState} from 'react';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  useQuery
} from "@apollo/client";
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});


function App() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <ApolloProvider client = {client}>
      <Router>
        <div className="App">
          <NavBar setSearchTerm={setSearchTerm}/>
          <div className='App-body'>
            <Routes>
              <Route path='/' element={ <Home searchTerm={searchTerm}/> } />
            </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;