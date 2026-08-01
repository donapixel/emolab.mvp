import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CheckIn from './views/CheckIn';
import Rescate from './views/Rescate';
import Juegos from './views/Juegos';
import Glosario from './views/Glosario';
import MiPerfil from './views/MiPerfil';

export default function App() {
  const [activeTab, setActiveTab] = useState('checkin');

  const renderView = () => {
    switch (activeTab) {
      case 'checkin':
        return <CheckIn onNavigateToRescate={() => setActiveTab('rescate')} />;
      case 'rescate':
        return <Rescate />;
      case 'juegos':
        return <Juegos />;
      case 'glosario':
        return <Glosario />;
      case 'perfil':
        return <MiPerfil />;
      default:
        return <CheckIn />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFF9EB', fontFamily: 'sans-serif' }}>
      {renderView()}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
