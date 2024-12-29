import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import { getListings } from '../utils/listing';
import Container from './Container';
import EmptyState from './EmptyState';
import ListingCard from './listings/ListingCard';
import parseISO from 'date-fns/parseISO';
import Loading from '../components/Loading';
import Error from './Error';

function Home() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(UserContext);
  const [params] = useSearchParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setError(null); 
        const data = await getListings(); 
        setListings(data);
        setFilteredListings(data);
      } catch (err) {
        setError(err); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    if (!listings.length) return;

    const category = params.get('category');
    const locationValue = params.get('locationValue');
    const startDate = params.get('startDate');
    const endDate = params.get('endDate');
    const guestCount = params.get('guestCount');
    const roomCount = params.get('roomCount');
    const bathroomCount = params.get('bathroomCount');

    let filtered = [...listings];

    if (category) {
      filtered = filtered.filter((listing) => {
        return listing.category?.toLowerCase() === category.toLowerCase();
      });
    }

    if (locationValue) {
      filtered = filtered.filter((listing) => {
        return listing.location?.value?.toString().toLowerCase() ===
          locationValue.toString().toLowerCase();
      });
    }

    if (startDate && endDate) {
      const parsedStartDate = parseISO(startDate);
      const parsedEndDate = parseISO(endDate);
      if (!isNaN(parsedStartDate) && !isNaN(parsedEndDate)) {
        filtered = filtered.filter((listing) => {
          const hasConflict = listing.reservations.some((reservation) => {
            const reservationStart = new Date(reservation.startDate);
            const reservationEnd = new Date(reservation.endDate);
            return reservationStart <= parsedEndDate &&
              reservationEnd >= parsedStartDate;
          });
          return !hasConflict;
        });
      }
    }

    if (guestCount) {
      filtered = filtered.filter((listing) => {
        return listing.guestCount >= parseInt(guestCount, 10);
      });
    }

    if (roomCount) {
      filtered = filtered.filter((listing) => {
        return listing.roomCount >= parseInt(roomCount, 10);
      });
    }

    if (bathroomCount) {
      filtered = filtered.filter((listing) => {
        return listing.bathroomCount >= parseInt(bathroomCount, 10);
      });
    }

    setFilteredListings(filtered);
  }, [params, listings]);

  if (currentUser === null) {
    return <EmptyState title="Yetkisiz" subtitle="Lütfen giriş yapın" />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (filteredListings.length === 0) {
    return (
      <EmptyState
        title="Hiç Liste Bulunamadı"
        subtitle="Filtrelerinizi ayarlamayı deneyin"
        showReset
      />
    );
  }

  return (
    <Container>
      <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {filteredListings.map((listing) => (
          <div key={listing.id}>
            <ListingCard currentUser={currentUser} data={listing} />
          </div>
        ))}
      </div>
    </Container>
  );
}

export default Home;
