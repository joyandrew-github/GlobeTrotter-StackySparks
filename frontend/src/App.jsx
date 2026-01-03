import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ItineraryView from './pages/ItineraryView';
import CitySearch from './pages/CitySearch';
import BudgetBreakdown from './pages/BudgetBreakdown';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/my-trips" element={<MyTrips />} />
           <Route path="/trip/:id/build" element={<ItineraryBuilder />} />
           <Route path="/trip/:id/itinerary" element={<ItineraryView />} />
          <Route path="/search/cities" element={<CitySearch />} />
          <Route path="/trip/:id/budget" element={<BudgetBreakdown />} />
        </Route>
        <Route path='/auth' element={<AuthPage/>} />
      </Routes>
    </Router>
  );
}

export default App;