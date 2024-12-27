import React, { useEffect, useState } from 'react';
import { getUserById } from '../../utils/getUserById'; 
import Avatar from '../Avatar';
import ListingCategory from './ListingCategory';
import Map from '../Map';
import useCountries from '../../hooks/useCountries';

function ListingInfo({ userId, description, guestCount, roomCount, bathroomCount, category, locationValue }) {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const { getByValue } = useCountries();

  const coordinates = getByValue(locationValue.value)?.latlng;

  console.log("userId", userId);
  


  const token = localStorage.getItem('token'); 


  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId && token) {
          const userData = await getUserById(userId, token);
          console.log("userData", userData);
          
          setUser(userData); 
        }
      } catch (error) {
        setError('Error fetching user data');
      } finally {
        setLoading(false); 
      }
    };

    fetchUser();
  }, [userId, token]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  return (
    <div className='col-span-4 flex flex-col gap-8'>
      <div className='flex flex-col gap-2'>
        <div className='text-xl font-semibold flex flex-row items-center gap-2'>
          <div>
            {user ? `Hosted by ${user.username}` : 'Hosted by unknown user'}
          </div>
          <Avatar src={user ? "/profile.png" : "/default-avatar.png"}/>
        </div>
        <div className='flex flex-row items-center gap-4 font-light text-neutral-500'>
          <div>
            {guestCount} guests
          </div>
          <div>
            {roomCount} rooms
          </div>
          <div>
            {bathroomCount} bathrooms
          </div>
        </div>
      </div>
      <hr />
      {
        category && (
          <ListingCategory 
            icon={category.icon}
            label={category.label}
            description={category.description}
          />
        )
      }
      <hr />
      <div className='text-lg font-light text-neutral-500'>
        {description}
      </div>
      <hr />
      {coordinates && (
        <Map center={coordinates}/>
      )}
    </div>
  );
}

export default ListingInfo;