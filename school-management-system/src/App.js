import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserTypeSelection from './components/UserTypeSelection';
import LocationSelection from './components/LocationSelection';
import SchoolUniversitySelection from './components/SchoolUniversitySelection';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [userType, setUserType] = useState(null);
  const [location, setLocation] = useState(null);
  const [schoolOrUniversity, setSchoolOrUniversity] = useState(null);
  const [user, setUser] = useState(null);

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  const handleSchoolUniversitySelect = (selection) => {
    setSchoolOrUniversity(selection);
  };

  const handleLogin = (credentials) => {
    setUser({ username: credentials.username });
  };

  const renderMainContent = () => {
    if (user) {
      return <StudentDashboard user={user} />;
    }
    if (schoolOrUniversity) {
      return <LoginPage school={schoolOrUniversity} onLogin={handleLogin} />;
    }
    if (location) {
      return (
        <SchoolUniversitySelection
          userType={userType}
          onSelect={handleSchoolUniversitySelect}
        />
      );
    }
    if (userType) {
      return <LocationSelection onLocationSelect={handleLocationSelect} />;
    }
    return <UserTypeSelection onSelect={handleUserTypeSelect} />;
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <Link to="/">Home</Link> | <Link to="/admin">Admin Panel</Link>
          </nav>
          <Routes>
            <Route path="/" element={renderMainContent()} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
