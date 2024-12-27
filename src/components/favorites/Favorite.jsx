import React, { useState, useEffect } from 'react';
import { getListings } from '../../utils/listing'; 
import EmptyState from '../EmptyState';
import Heading from '../Heading';
import Container from '../Container';
import ListingCard from '../listings/ListingCard';
import { getCurrentUser } from '../../utils/getCurrentUser';
import Loading from '../Loading';
import Error from '../Error';

function Favorite() {
  const [listings, setListings] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    async function fetchCurrentUser () {
        const response = await getCurrentUser();
        setCurrentUser(response);
    }
    fetchCurrentUser();
  },[])

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings();
        setListings(data); 
        console.log(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []); 

  if (!currentUser) {
    console.log('No user logged in, showing unauthorized state');
    return <EmptyState title="Unauthorized" subtitle="Please log in" />;
  }

  if (loading) {
    console.log('Reservations are loading...');
    return <Loading />;
  }

  if (error) {
    console.log('An error occurred while fetching reservations:', error.message);
    return <Error error={error} />;
  }


  const favoriteListings = listings.filter(listing => 
    currentUser && currentUser.favorites.some(favorite => favorite.listing.id === listing.id)
  );

  if (favoriteListings.length === 0) {
    return (
      <EmptyState
        title="No favorites found"
        subtitle="Looks like you have no favorite listings"
      />
    );
  }

  return (
    <Container>
      <Heading
        title="Favorites"
        subtitle="List of places you have favorited!"
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {favoriteListings.map((listing) => { 
          return (
            <ListingCard 
              key={listing.id} 
              data={listing} 
              currentUser={currentUser}
              />
          );
        })}
      </div>
    </Container>
  );
}

export default Favorite;
