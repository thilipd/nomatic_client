
import './App.css';
import DataProvider from './redux/store';
import AppRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer autoClose={3000} />
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
