import React, { useCallback, useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/userContext';
import Container from '../Container';
import Heading from '../Heading';
import EmptyState from '../EmptyState';
import ListingCard from '../listings/ListingCard';
import { getUserReservations, cancelReservation } from '../../utils/reservation';
import { getListingById } from '../../utils/listing';
import Loading from '../Loading';
import Error from '../Error';

function Trips() {
  const { currentUser } = useContext(UserContext);
  const [reservations, setReservations] = useState([]);
  const [listings, setListings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const token = localStorage.getItem('token');
      setIsLoading(true);
      setError(null);

      getUserReservations(currentUser.id, token)
        .then((data) => {
          setReservations(data);
          console.log("Rezervasyonlar:", data);

          const fetchListings = data.map((reservation) => {
            if (reservation.listingId) {
              return getListingById(reservation.listingId, token)
                .then((listing) => {
                  setListings((prevListings) => ({
                    ...prevListings,
                    [reservation.listingId]: listing, 
                  }));
                })
                .catch((listingError) => {
                  console.error(
                    `Rezervasyon ID ${reservation.id} için ilan alınırken hata oluştu:`,
                    listingError.message
                  );
                  setError(listingError);
                });
            }
            return null;
          });

          Promise.all(fetchListings).finally(() => setIsLoading(false));
        })
        .catch((fetchError) => {
          console.error('Rezervasyonlar alınırken hata oluştu:', fetchError.message);
          setError(fetchError);
          setIsLoading(false);
        });
    }
  }, [currentUser]);

  const onCancel = useCallback((id) => {
    const token = localStorage.getItem('token');
    console.log(`Rezervasyon ID ${id} iptal edilmeye çalışılıyor.`);
    cancelReservation(id, token)
      .then(() => {
        console.log(`Rezervasyon ID ${id} başarıyla iptal edildi.`);
        setReservations((prevReservations) =>
          prevReservations.filter((reservation) => reservation.id !== id)
        );
      })
      .catch((cancelError) => {
        console.error(`Rezervasyon ID ${id} iptal edilirken hata oluştu:`, cancelError.message);
        setError(cancelError);
      });
  }, []);

  if (!currentUser) {
    return <EmptyState title="Yetkilendirme yok" subtitle="Lütfen giriş yapın" />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="Hiç seyahat bulunamadı"
        subtitle="Henüz herhangi bir seyahat rezervasyonu yapmamışsınız gibi görünüyor"
      />
    );
  }

  return (
    <Container>
      <Heading title="Seyahatler" subtitle="Nerelerde bulundunuz ve nereye gidiyorsunuz" />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {reservations.map((reservation) => {
          const listing = listings[reservation.listingId]; // Doğru ilanı al
          return listing ? (
            <ListingCard
              key={reservation.id}
              data={listing} // İlan bilgisini gönder
              reservation={reservation}
              actionId={reservation.id}
              onAction={onCancel}
              actionLabel="Rezervasyonu iptal et"
              currentUser={currentUser}
            />
          ) : (
            <Loading key={reservation.id} /> // İlan henüz yüklenmediyse Loading göster
          );
        })}
      </div>
    </Container>
  );
}

export default Trips;
