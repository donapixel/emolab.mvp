import React, { useState } from 'react';
import { saveCheckinRecord } from '../lib/supabaseClient';

export default function CheckIn({ onNavigateToRescate }) {
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const emociones = [
    { nombre: 'Alegría', emoji: '😊', color: '#FEFCBF' },
    { nombre: 'Tristeza', emoji: '😢', color: '#EBF8FF' },
    { nombre: 'Enojo', emoji: '😡', color: '#FED7D7' },
    { nombre: 'Miedo', emoji: '😨', color: '#E9D8FD' },
    { nombre: 'Sorpresa', emoji: '😲', color: '#FEEBC8' },
    { nombre: 'Asco', emoji: '🤢', color: '#C6F6D5' },
  ];

  const handleSave = async () => {
    if (!selectedEmotion) return;
    await saveCheckinRecord({ emocion: selectedEmotion, frase: note });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '80px', textAlign: 'center' }}>
      <h2>¿Cómo te sentís hoy?</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '20px 0' }}>
        {emociones.map((e) => (
          <button
            key={e.nombre}
            onClick={() => setSelectedEmotion(e.nombre)}
            style={{
              backgroundColor: e.color,
              border: selectedEmotion === e.nombre ? '2px solid #6B46C1' : 'none',
              borderRadius: '12px',
              padding: '15px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '30px' }}>{e.emoji}</div>
            <div>{e.nombre}</div>
          </button>
        ))}
      </div>

      {selectedEmotion && (
        <div style={{ marginTop: '20px' }}>
          <textarea
            placeholder="¿Querés agregar alguna nota o razón?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ width: '100%', height: '80px', borderRadius: '8px', padding: '10px', border: '1px solid #CBD5E0' }}
          />
          <button
            onClick={handleSave}
            style={{
              marginTop: '10px',
              width: '100%',
              backgroundColor: '#6B46C1',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Guardar Registro
          </button>
        </div>
      )}

      {saved && <p style={{ color: 'green', marginTop: '10px' }}>¡Registro guardado con éxito! ✨</p>}
    </div>
  );
}