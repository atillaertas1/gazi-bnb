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

    console.log(
      locationValue,
      startDate,
      endDate,
      guestCount,
      roomCount,
      bathroomCount
    );

    let filtered = [...listings];

    if (category) {
      filtered = filtered.filter((listing) => {
        const isCategoryMatch =
          listing.category?.toLowerCase() === category.toLowerCase();
        console.log(
          `Category filter: Listing category "${listing.category}" matches with "${category}"? ${isCategoryMatch}`
        );
        return isCategoryMatch;
      });
    }

    if (locationValue) {
      filtered = filtered.filter((listing) => {
        const isLocationMatch =
          listing.location?.value?.toString().toLowerCase() ===
          locationValue.toString().toLowerCase();
        console.log(
          `Location filter: Listing location "${listing.location?.value}" matches with "${locationValue}"? ${isLocationMatch}`
        );
        return isLocationMatch;
      });
    }

    if (startDate && endDate) {
      const parsedStartDate = parseISO(startDate);
      const parsedEndDate = parseISO(endDate);
      if (!isNaN(parsedStartDate) && !isNaN(parsedEndDate)) {
        filtered = filtered.filter((listing) => {
          // Rezervasyonların tarihlerini kontrol et
          const hasConflict = listing.reservations.some((reservation) => {
            const reservationStart = new Date(reservation.startDate);
            const reservationEnd = new Date(reservation.endDate);
            const isDateConflict =
              reservationStart <= parsedEndDate &&
              reservationEnd >= parsedStartDate;
            console.log(
              `Date conflict: Reservation dates "${reservationStart}" to "${reservationEnd}" match with range "${parsedStartDate}" to "${parsedEndDate}"? ${isDateConflict}`
            );
            return isDateConflict;
          });

          return !hasConflict;
        });
      } else {
        console.error('Invalid date format in the query params');
      }
    }

    if (bathroomCount) {
      filtered = filtered.filter((listing) => {
        const isBathroomCountMatch =
          listing.bathroomCount >= parseInt(bathroomCount, 10);
        console.log(
          `Bathroom count filter: Listing bathroom count "${listing.bathroomCount}" matches with "${bathroomCount}"? ${isBathroomCountMatch}`
        );
        return isBathroomCountMatch;
      });
    } else {
      console.log('bathroomCount', bathroomCount);
    }

    setFilteredListings(filtered);
  }, [params, listings]);

  if (currentUser === null) {
    return <EmptyState title="Unauthorized" subtitle="Please log in" />;
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
        title="No Listings Found"
        subtitle="Try adjusting your filters"
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
