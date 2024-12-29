import React, { useCallback, useMemo, useState } from 'react';
import Modal from './Modal';
import useSearchModal from '../../hooks/useSearchModal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Map from '../Map';
import qs from 'query-string';
import { formatISO } from 'date-fns';
import Heading from '../Heading';
import CountrySelect from '../inputs/CountrySelect';
import Calendar from '../inputs/Calendar';
import Counter from '../inputs/Counter';

function SearchModal() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const searchModal = useSearchModal();

  const STEPS = {
    LOCATION: 0,
    DATE: 1,
    INFO: 2,
  };

  const [location, setLocation] = useState();
  const [step, setStep] = useState(STEPS.LOCATION);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery = {
      ...currentQuery,
      locationValue: location.value, 
      guestCount,
      roomCount,
      bathroomCount,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl(
      {
        url: '/',
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION);
    searchModal.onClose();

    navigate(url);
  }, [
    step,
    searchModal,
    location,
    navigate,
    guestCount,
    roomCount,
    bathroomCount,
    dateRange,
    onNext,
    params,
    STEPS.INFO,
    STEPS.LOCATION
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Ara';
    }

    return 'İleri';
  }, [step, STEPS.INFO]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return 'Geri';
  }, [step, STEPS.LOCATION]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Nereye gitmek istiyorsunuz?"
        subtitle="Mükemmel lokasyonu bulun"
      />
      <CountrySelect
        value={location}
        onChange={(value) => {
          setLocation(value);
        }}
      />
      <hr />
      <Map
        key={location?.latlng?.join(',')}
        center={location?.latlng || [0, 0]}
      />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Ne zaman gitmeyi planlıyorsunuz?"
          subtitle="Herkesin müsait olduğundan emin olun!"
        />
        <Calendar
          value={dateRange}
          onChange={(value) => setDateRange(value.selection)}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Daha fazla bilgi" subtitle="Mükemmel yeri bulun!" />
        <Counter
          title="Misafirler"
          subtitle="Kaç misafir geliyor?"
          value={guestCount}
          onChange={(value) => setGuestCount(value)}
        />
        <Counter
          title="Odalar"
          subtitle="Kaç odaya ihtiyacınız var?"
          value={roomCount}
          onChange={(value) => setRoomCount(value)}
        />
        <Counter
          title="Banyolar"
          subtitle="Kaç banyoya ihtiyacınız var?"
          value={bathroomCount}
          onChange={(value) => setBathroomCount(value)}
        />
      </div>
    );
  }
  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      title="Filtreler"
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      body={bodyContent}
    />
  );
}

export default SearchModal;
