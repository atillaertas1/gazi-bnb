import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/userContext';
import RegisterModal from './components/modals/RegisterModal';
import ToasterProvider from './providers/ToasterProvider';
import LoginModal from './components/modals/LoginModal';
import RentModal from './components/modals/RentModal';
import Home from './components/Home';
import Navbar from './components/navbar/Navbar'
import ListingPage from './components/listings/ListingPage';
import Trips from './components/trips/Trips';
import Reservation from './components/reservations/Reservation';
import Favorite from './components/favorites/Favorite'
import Properties from './components/properties/Properties';
import SearchModal from './components/modals/SearchModal';
import SettingsModal from './components/modals/SettingsModal';

function App() {
  return (
    <UserProvider> 
      <Router>
        <ToasterProvider />

        <RentModal />
        <RegisterModal />
        <LoginModal />
        <SearchModal />
        <SettingsModal />

        <Navbar />

        <div className="pb-20 pt-28">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings/:listingId" element={<ListingPage />}/>
            <Route path="/trips" element={<Trips />} />
            <Route path="/reservations" element={<Reservation />} />
            <Route path='/favorites' element={<Favorite />} />
            <Route path='/properties' element={<Properties />} />

          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
