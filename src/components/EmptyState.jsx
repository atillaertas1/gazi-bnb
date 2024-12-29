import React from 'react';
import { useNavigate } from 'react-router-dom';
import Heading from './Heading';
import Button from './Button';

function EmptyState({
  title = 'Tam eşleşme bulunamadı',
  subtitle = 'Bazı filtreleri değiştirmeyi veya kaldırmayı deneyin',
  showReset,
}) {
  const navigate = useNavigate();

  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
      <Heading center title={title} subtitle={subtitle} />
      <div className="w-48 mt-4">
        {showReset && (
          <Button
            outline
            label="Tüm filtreleri kaldır"
            onClick={() => navigate('/')}
          />
        )}
      </div>
    </div>
  );
}

export default EmptyState;
