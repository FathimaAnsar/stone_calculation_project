import Form from './components/form/form';
import Display from './components/display/display';
import Register from "./components/register/register";
import './App.css';

function App() {
  return (
      <div className="App">
        <Register />
        <div className="MainContent">
          <Form />
          <Display />
        </div>
      </div>
  );
}

export default App;