import React, { useMemo, useState, useContext } from 'react';
import Modal from './Modal';
import useRentModal from '../../hooks/useRentModal';
import Heading from '../Heading';
import { categories } from '../navbar/Categories';
import CategoryInput from '../inputs/CategoryInput';
import CountrySelect from '../inputs/CountrySelect';
import Map from '../Map';
import { useForm } from 'react-hook-form';
import Counter from '../inputs/Counter';
import ImageUpload from '../inputs/ImageUpload';
import Input from '../inputs/Input';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../context/userContext';
import Loading from '../Loading';
import Error from '../Error';
import { useNavigate } from 'react-router-dom';

const STEPS = {
  CATEGORY: 0,
  LOCATION: 1,
  INFO: 2,
  IMAGES: 3,
  DESCRIPTION: 4,
  PRICE: 5,
};

function RentModal() {
  const rentModal = useRentModal();
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      category: '',
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      price: 1,
      title: '',
      description: '',
      location: '',
      userId: currentUser?.id || '',
    },
  });

  const category = watch('category');
  const location = watch('location');
  const guestCount = watch('guestCount');
  const roomCount = watch('roomCount');
  const bathroomCount = watch('bathroomCount');

  const setCustomValue = (id, value) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit = async (data) => {
    if (step !== STEPS.PRICE) return onNext();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to create a listing.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      const listingData = {
        ...data,
        userId: currentUser.id,
      };

      formData.append('listing', JSON.stringify(listingData));
      formData.append('imageFile', data.imageFile);

      console.log(formData);

      const response = await fetch('http://localhost:8080/api/listings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        <Error error={error} />;
      }

      toast.success('Listing created!');
      reset();
      setStep(STEPS.CATEGORY);
      rentModal.onClose();
      navigate(0);
    } catch (error) {
      setError(error.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const actionLabel = useMemo(() => {
    return step === STEPS.PRICE ? 'Create' : 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    return step === STEPS.CATEGORY ? undefined : 'Back';
  }, [step]);

  let bodyContent;

  if (isLoading) {
    bodyContent = <Loading />;
  } else if (error) {
    bodyContent = <Error error={error} />;
  } else {
    if (step === STEPS.CATEGORY) {
      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading title="Pick a category" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
            {categories.map((item) => (
              <div key={item.label}>
                <CategoryInput
                  onClick={(category) => setCustomValue('category', category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={item.icon}
                />
              </div>
            ))}
          </div>
        </div>
      );
    } else if (step === STEPS.LOCATION) {
      // Fallback in case location.latlng is not available yet
      const mapCenter = location?.latlng || [0, 0];

      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading title="Where is your place located?" />
          <CountrySelect
            value={location}
            onChange={(value) => {
              setCustomValue('location', value); // This updates the form state
            }}
          />
          {/* Haritaya key ekleyerek her güncellemede yeniden render edilmesini sağlıyoruz */}
          <Map key={location?.latlng?.join(',')} center={mapCenter} />
        </div>
      );
    } else if (step === STEPS.INFO) {
      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading title="Describe your place" />
          <Counter
            title="Guests"
            subtitle="alt başlığı ayarlarsın"
            value={guestCount}
            onChange={(value) => setCustomValue('guestCount', value)}
          />
          <Counter
            title="Rooms"
            subtitle="alt başlığı ayarlarsın"
            value={roomCount}
            onChange={(value) => setCustomValue('roomCount', value)}
          />
          <Counter
            title="Bathrooms"
            subtitle="alt başlığı ayarlarsın"
            value={bathroomCount}
            onChange={(value) => setCustomValue('bathroomCount', value)}
          />
        </div>
      );
    } else if (step === STEPS.IMAGES) {
      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading title="Add a photo" />
          <ImageUpload onChange={(file) => setCustomValue('imageFile', file)} />
        </div>
      );
    } else if (step === STEPS.DESCRIPTION) {
      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading title="Describe your place" />
          <Input
            id="title"
            label="Title"
            register={register}
            errors={errors}
            required
          />
          <Input
            id="description"
            label="Description"
            register={register}
            errors={errors}
            required
          />
        </div>
      );
    } else if (step === STEPS.PRICE) {
      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading title="Set your price" />
          <Input
            id="price"
            label="Price"
            type="number"
            register={register}
            errors={errors}
            required
          />
        </div>
      );
    }
  }

  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      title="Create your listing"
      body={bodyContent}
    />
  );
}

export default RentModal;
