import './App.css';
import Home from './components/Home';
import NavBar from './components/NavBar';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import React, {useState} from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import  {AuthProvider}  from './firebase/Auth';
import MovieById from './components/MovieById';

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
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <AuthProvider>
    <ApolloProvider client = {client}>
           <Router>
        <div className="App">
          <NavBar setSearchTerm={setSearchTerm} loggedIn={setLoggedIn}/>
          <div className='App-body'>
            <Routes>
              <Route path='/' element={ <Home searchTerm={searchTerm}/> } />

              <Route path='/SignIn' element={ <SignIn/> } />
              <Route path='/SignUp' element={ <SignUp/> } />
              <Route path='/movie/:id' element={ <MovieById/> } />
              

            </Routes>
          </div>
        </div>
      </Router>

    </ApolloProvider>
    </AuthProvider>

  );
}

export default App;