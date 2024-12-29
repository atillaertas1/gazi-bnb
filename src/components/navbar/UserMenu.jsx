import React, { useCallback, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import Avatar from '../Avatar';
import MenuItem from './MenuItem';
import useRegisterModal from '../../hooks/useRegisterModal';
import useLoginModal from '../../hooks/UseLoginModal';
import useRentModal from '../../hooks/useRentModal';
import { useNavigate } from 'react-router-dom';
import useSettingsModal from '../../hooks/useSettingsModal';

function UserMenu({ currentUser }) {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const rentModal = useRentModal();
  const settingsModal = useSettingsModal();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    rentModal.onOpen();
  }, [currentUser, loginModal, rentModal]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate(0);
  };

  const goToTrips = () => {
    if (!currentUser) {
      navigate('/login');  
    } else {
      navigate('/trips');  
    }
  };

  const goToReservations = () => {
    if (!currentUser) {
      navigate('/login'); 
    } else {
      navigate('/reservations'); 
    }
  };

  const goToFavorites = () => {
    if (!currentUser) {
      navigate('/login');  
    }
    else {
      navigate('/favorites'); 
    }
  };

  const goToProperties = () => {
    if (!currentUser) {
      navigate('/login');  
    } else {
      navigate('/properties'); 
    }
  };
  
  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
        >
          Evinizi bizimle kiralayın
        </div>
        <div
          onClick={toggleOpen}
          className="py-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem onClick={goToTrips} label={'Seyahatlerim'} />
                <MenuItem onClick={goToFavorites} label={'Favorilerim'} />
                <MenuItem onClick={goToReservations} label={'Rezervasyonlarım'} />
                <MenuItem onClick={goToProperties} label={'Mülklerim'} />
                <MenuItem onClick={settingsModal.onOpen} label={'Ayarlarım'} />
                <MenuItem onClick={rentModal.onOpen} label={'Evim'} />
                <hr />
                <MenuItem onClick={logout} label={'Çıkış Yap'} />
              </>
            ) : (
              <>
                <MenuItem onClick={loginModal.onOpen} label={'Giriş Yap'} />
                <MenuItem onClick={registerModal.onOpen} label={'Kayıt Ol'} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
