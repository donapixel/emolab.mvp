import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id 'checkin', label 'Check-in', icon '📝' },
    { id 'rescate', label 'Rescate', icon '🛟' },
    { id 'juegos', label 'Juegos', icon '🎮' },
    { id 'glosario', label 'Glosario', icon '📖' },
    { id 'perfil', label 'Perfil', icon '👤' },
  ];

  return (
    nav style={{
      position 'fixed',
      bottom 0,
      left 0,
      right 0,
      backgroundColor '#FFFFFF',
      borderTop '1px solid #E5E7EB',
      display 'flex',
      justifyContent 'space-around',
      padding '8px 0',
      zIndex 1000
    }}
      {tabs.map((tab) = (
        button
          key={tab.id}
          onClick={() = setActiveTab(tab.id)}
          style={{
            background 'none',
            border 'none',
            display 'flex',
            flexDirection 'column',
            alignItems 'center',
            fontSize '12px',
            color activeTab === tab.id  '#6B46C1'  '#718096',
            cursor 'pointer',
            fontWeight activeTab === tab.id  'bold'  'normal'
          }}
        
          span style={{ fontSize '20px' }}{tab.icon}span
          span{tab.label}span
        button
      ))}
    nav
  );
}
