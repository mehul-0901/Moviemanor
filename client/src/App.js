import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
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
  return (
    <ApolloProvider client = {client}>
      <Router>
        <div className="App">
          <header className="App-header">
            
          </header>
          <Routes>
            <Route path='/' element={ <Home/> } />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
