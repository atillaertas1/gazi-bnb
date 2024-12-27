import React from 'react';
import useCountries from '../../hooks/useCountries';
import Heading from '../Heading';
import HeartButton from '../HeartButton';

function ListingHead({ title, locationValue, imageSrc, id, currentUser }) {
  const { getByValue } = useCountries();
  const location = getByValue(locationValue.value);
  console.log(imageSrc);

  const relativePath = imageSrc.split('public')[1];  
  const finalPath = relativePath.replace('/public', '');

  console.log(finalPath);

  return (
    <>
      <Heading
        title={title}
        subtitle={`${location?.region}, ${location?.label}`}
      />
      <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
        <img alt='property' src={finalPath} className="object-cover w-full" />
        <div className="absolute top-5 right-5">
          <HeartButton listingId={id} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
}

export default ListingHead;
