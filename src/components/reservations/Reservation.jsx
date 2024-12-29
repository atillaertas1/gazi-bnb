import React, { useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from '../../context/userContext';
import Container from '../Container';
import EmptyState from '../EmptyState';
import Heading from '../Heading';
import ListingCard from '../listings/ListingCard';
import { cancelReservation } from '../../utils/reservation'; 
import { getListingsForUser } from '../../utils/listing';
import Loading from '../Loading';
import Error from '../Error';

function Reservation() {
  const { currentUser } = useContext(UserContext);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      if (currentUser) {
        try {
          setIsLoading(true);
          setError(null); 
          
          const userListings = await getListingsForUser(currentUser.id, localStorage.getItem('token'));
          console.log("Kullanıcı ilanları", userListings);

          const allReservations = [];
          userListings.forEach((listing) => {
            if (listing.reservations && listing.reservations.length > 0) {
              listing.reservations.forEach((reservation) => {
                allReservations.push({
                  ...reservation,
                  listing: listing,
                });
              });
            }
          });

          console.log("Tüm rezervasyonlar", allReservations);
          setReservations(allReservations);
        } catch (error) {
          console.error('Kullanıcı ilanları alınırken hata oluştu:', error.message);
          setError(error); 
        } finally {
          setIsLoading(false); 
        }
      }
    };

    fetchListings();
  }, [currentUser]);

  const onCancel = useCallback((reservationId) => {
    console.log('Rezervasyon iptali deneniyor, ID:', reservationId);
    const token = localStorage.getItem('token');
    cancelReservation(reservationId, token)
      .then(() => {
        console.log('Rezervasyon başarıyla iptal edildi, arayüzden kaldırılıyor:', reservationId);
        setReservations((prevReservations) =>
          prevReservations.filter((reservation) => reservation.id !== reservationId)
        );
      })
      .catch((error) => {
        console.error('Rezervasyon iptal edilirken hata oluştu:', error);
        setError(error);
      });
  }, []);

  if (!currentUser) {
    console.log('Giriş yapmış kullanıcı yok, yetkisiz durum gösteriliyor');
    return <EmptyState title="Yetkisiz" subtitle="Lütfen giriş yapın" />;
  }

  if (isLoading) {
    console.log('Rezervasyonlar yükleniyor...');
    return <Loading />;
  }

  if (reservations.length === 0) {
    console.log('Kullanıcı için hiçbir rezervasyon bulunamadı');
    return (
      <EmptyState
        title="Hiç rezervasyon bulunamadı"
        subtitle="Görünüşe göre mülkünüzde herhangi bir rezervasyon yok"
      />
    );
  }


  if (error) {
    console.log('Rezervasyonlar alınırken bir hata oluştu:', error.message);
    return <Error error={error} />;
  }


  return (
    <Container>
      <Heading title="Rezervasyonlar" subtitle="Mülklerinizdeki rezervasyonlar" />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            actionLabel="Misafir rezervasyonunu iptal et"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
}

export default Reservation;
