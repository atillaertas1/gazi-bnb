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
          console.log("user listings", userListings);

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

          console.log("all reservations", allReservations);
          setReservations(allReservations);
        } catch (error) {
          console.error('Error fetching user listings:', error.message);
          setError(error); 
        } finally {
          setIsLoading(false); 
        }
      }
    };

    fetchListings();
  }, [currentUser]);

  const onCancel = useCallback((reservationId) => {
    console.log('Attempting to cancel reservation with ID:', reservationId);
    const token = localStorage.getItem('token');
    cancelReservation(reservationId, token)
      .then(() => {
        console.log('Reservation cancelled successfully, removing from UI:', reservationId);
        setReservations((prevReservations) =>
          prevReservations.filter((reservation) => reservation.id !== reservationId)
        );
      })
      .catch((error) => {
        console.error('Error deleting reservation:', error);
        setError(error);
      });
  }, []);

  if (!currentUser) {
    console.log('No user logged in, showing unauthorized state');
    return <EmptyState title="Unauthorized" subtitle="Please log in" />;
  }

  if (isLoading) {
    console.log('Reservations are loading...');
    return <Loading />;
  }

  if (reservations.length === 0) {
    console.log('No reservations found for the user');
    return (
      <EmptyState
        title="No reservations found"
        subtitle="Looks like you have no reservations on your property"
      />
    );
  }


  if (error) {
    console.log('An error occurred while fetching reservations:', error.message);
    return <Error error={error} />;
  }


  return (
    <Container>
      <Heading title="Reservations" subtitle="Bookings on your properties" />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            actionLabel="Cancel guest reservation"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
}

export default Reservation;
