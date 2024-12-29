import React, { useState, useEffect } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { ImSpinner2 } from 'react-icons/im';
import { addFavorite, removeFavorite } from '../utils/favorite';
import Error from './Error';
import { getCurrentUser } from '../utils/getCurrentUser';

function HeartButton({ listingId }) {
  const [hasFavorited, setHasFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    async function fetchCurrentUser() {
      const response = await getCurrentUser();
      setCurrentUser(response);
    }
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.favorites) {
      const isFavorited = currentUser.favorites.some(
        (favorite) => favorite.listing.id === listingId
      );
      setHasFavorited(isFavorited);
    }
  }, [currentUser, listingId]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token bulunamadı');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (hasFavorited) {
        await removeFavorite(currentUser.id, listingId, token);
      } else {
        await addFavorite(currentUser.id, listingId, token);
      }
      setHasFavorited((prev) => !prev);
    } catch (error) {
      console.error('Favori durumu değiştirilirken bir hata oluştu', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={toggleFavorite}
      className="relative hover:opacity-80 transition cursor-pointer"
    >
      {isLoading ? (
        <ImSpinner2 size={28} className="animate-spin text-gray-400" />
      ) : (
        <>
          <AiOutlineHeart
            size={28}
            className="absolute -top-[2px] -right-[2px] text-gray-400"
          />
          <AiFillHeart
            size={24}
            className={hasFavorited ? 'text-rose-500' : 'text-neutral-500/70'}
          />
        </>
      )}
      {error && <Error message="Bir hata oluştu, lütfen tekrar deneyin." />}
    </div>
  );
}

export default HeartButton;
