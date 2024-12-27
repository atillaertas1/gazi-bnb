import React, { useEffect, useState, useCallback, useMemo, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns';
import { categories } from '../navbar/Categories';
import { UserContext } from '../../context/userContext';
import toast from 'react-hot-toast';
import EmptyState from '../EmptyState';
import Container from '../Container';
import ListingHead from './ListingHead';
import ListingInfo from './ListingInfo';
import ListingReservation from './ListingReservation';
import useLoginModal from '../../hooks/UseLoginModal';
import { getReservationsByListing, createReservation } from '../../utils/reservation';
import { getListingById } from '../../utils/listing';

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection',
};

function ListingPage() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parsedLocation, setParsedLocation] = useState(undefined);
  const [reservations, setReservations] = useState([]);
  const [userId, setUserId] = useState();
  const { listingId } = useParams();

  const loginModal = useLoginModal();
  const navigation = useNavigate();
  const { currentUser } = useContext(UserContext);

  const disabledDates = useMemo(() => {
    let dates = [];
    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });
      dates = [...dates, ...range];
    });
    return dates;
  }, [reservations]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing?.price || 0);
  const [dateRange, setDateRange] = useState(initialDateRange);

  const onCreateReservation = useCallback(() => {
    const token = localStorage.getItem('token');

    if (!currentUser) {
      console.log('User is not logged in, opening login modal');
      return loginModal.onOpen(); 
    }

    if (!token) {
      console.error('No token found');
      return;
    }

    setIsLoading(true);

    createReservation(
      {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing?.id,
        userId: currentUser.id,
      },
      token
    )
      .then(() => {
        toast.success('Listing reserved!');
        setDateRange(initialDateRange);
        navigation(0);
      })
      .catch((error) => {
        console.error('Error creating reservation:', error);
        toast.error('Something went wrong.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [totalPrice, dateRange, listing?.id, navigation, currentUser, loginModal]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (dayCount && listing?.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing?.price || 0);
      }
    }
  }, [dateRange, listing?.price]);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const listingData = await getListingById(listingId, token);

        setListing(listingData);
        setUserId(listingData.userId);

        if (listingData) {
          const location = listingData.location;
          setParsedLocation(location);
        } else {
          console.error('No location value in response');
        }
      } catch (error) {
        setError('An error occurred while fetching the listing.');
        console.error('Error fetching listing by ID:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        const reservationsData = await getReservationsByListing(listingId, token);

        setReservations(Array.isArray(reservationsData) ? reservationsData : []);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    if (listingId) {
      fetchReservations();
    }
  }, [listingId]);

  const category = useMemo(() => {
    return categories.find((item) => item.label === listing?.category);
  }, [listing?.category]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!listing || !parsedLocation) {
    return <EmptyState />;
  }

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageUrl}
            locationValue={parsedLocation}
            id={listing.id}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              userId={userId}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={parsedLocation}
            />

            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ListingPage;
