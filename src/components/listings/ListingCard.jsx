import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useCountries from '../../hooks/useCountries';
import { format } from 'date-fns';
import HeartButton from '../HeartButton';
import Button from '../Button';

function ListingCard({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId,
  currentUser,
}) {
  const navigate = useNavigate();
  const { getByValue } = useCountries();

  const location = getByValue(data.location.value);

  const relativePath = data.imageUrl.split('public')[1];
  const finalPath = relativePath.replace('/public', ''); 

  console.log(finalPath); 

  const handleCancel = useCallback(
    (e) => {
      e.stopPropagation();
      if (disabled) return;
      onAction(actionId);
    },
    [onAction, actionId, disabled]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }
    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) return null;

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, 'PP')} - ${format(end, 'PP')}`;
  }, [reservation]);

  const handleHeartClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={() => {
        navigate(`/listings/${data.id}`);
      }}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <img
            alt="Listing"
            src={finalPath}
            className="object-fill h-full w-full group-hover:scale-110 transition"
          />

          <div className="absolute top-3 right-3" onClick={handleHeartClick}>
            {/* Handle heart button click without triggering navigation */}
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>
        <div className="font-semibold text-lg">
          {location
            ? `${location.region}, ${location.label}`
            : 'Bilinmeyen Konum'}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">₺{price}</div>
          {!reservation && <div className="font-light">gece</div>}
          {onAction && actionLabel && (
            <Button
              disabled={disabled}
              small
              label={actionLabel}
              onClick={handleCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ListingCard;