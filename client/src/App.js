import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from "./components/Home";
import Menu from "./components/Menu";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Tables from "./components/Tables";
import Table from "./components/Tables";
import Navbar from "./components/Navbar";
import Register from './components/Register';
import TableAdmin from './components/TableAdmin';
import Products from './components/Products';
import VisitorRoutes from './utils/VisitorRoutes';
import UserRoutes from './utils/UserRoutes';
import AdminRoutes from './utils/AdminRoutes';
import Footer from './components/Footer';
import Reservation from './components/popup/Resevation2en1'
import MenuTable from './components/MenuTable';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import MannageReservations from './components/MannageReservations';
import Users from './components/Users';



function App() {
  return (
    <>
      
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/menu/:name' element={<Menu />} />
        <Route exact path='/products' element={<Products />} />
        <Route element={<VisitorRoutes />}>
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/register' element={<Register />} />
          <Route exact path='/forgotPassword' element={<ForgotPassword />} />
          <Route exact path='/resetPassword/:id/:token' element={<ResetPassword />} />
        </Route>
        <Route element={<UserRoutes />}>
          <Route exact path='/profile' element={<Profile />} />
          <Route exact path='/reservation' element={<Reservation />}/>
          <Route exact path='/tables' element={<Tables />} />
          <Route exact path='/tables/:id' element={<Table />} />
        </Route>
        <Route element={<AdminRoutes />}>
          <Route exact path='/manage/reservations' element={<MannageReservations />} />
          <Route exact path="/manage/products" element={<TableAdmin />} />
          <Route exact path="/manage/users" element={<Users />} />
          <Route exact path='/manage/menus' element={<MenuTable />} />
        </Route>
        <Route exact path='*' element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
