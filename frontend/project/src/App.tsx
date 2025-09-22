import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import MineLocationsMap from './components/MineLocationsMap';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  const handleLogin = (username: string) => {
    // Mock user data - in real app this would come from authentication API
    setUser({
      username,
      name: username === 'admin' ? 'Administrator' : username.charAt(0).toUpperCase() + username.slice(1),
      role: 'Mining Safety Officer'
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <Router>
      <div className="App">
        {user ? (
          <div className="min-h-screen bg-gray-50">
            <Header 
              user={user} 
              onLogout={handleLogout} 
              currentPage={currentPage}
              onNavigate={handleNavigate}
            />
            
            {currentPage === 'dashboard' && <Dashboard user={user} />}
            {currentPage === 'maps' && (
              <main className="container mx-auto px-4 py-8">
                <MineLocationsMap />
              </main>
            )}
          </div>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
}

export default App;