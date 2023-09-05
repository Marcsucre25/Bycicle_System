import './App.css';
//importamos nuestros componentes
import Show from './components/Show';
import Create from './components/Create';
import SignIn from './components/auth/SignIn';

//importamos el router
import {BrowserRouter, Route, Routes} from 'react-router-dom'

function App() {
  return (
    <div className="App">    
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <SignIn /> } />
        <Route path='/show' element={ <Show /> } />
        <Route path='/create' element={ <Create /> } />
      </Routes>
    </BrowserRouter> 
    </div>
  );
}

export default App;
