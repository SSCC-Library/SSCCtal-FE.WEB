import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import ItemList from './pages/ItemList';
import Login from './pages/Login';
import RentalHistory from './pages/RentalHistory';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Main />
            </Layout>
          }
        />
        <Route
          path="/itemlist"
          element={
            <Layout>
              <ItemList />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/rentalhistory"
          element={
            <Layout>
              <RentalHistory />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;