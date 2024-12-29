import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import Button from '../Button';
import { loginUser } from '../../utils/auth'; 
import useRegisterModal from '../../hooks/useRegisterModal';
import useLoginModal from '../../hooks/UseLoginModal';

function LoginModal() {
  const navigate = useNavigate();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const token = await loginUser(data);
      localStorage.setItem('token', token);
      loginModal.onClose();
      navigate(0); 
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title={'Hoş geldiniz'} subtitle={'Hesabınıza giriş yapın'} />
      <Input
        id="username"
        label="Kullanıcı Adı"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        type="password"
        label="Şifre"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label={'Google ile devam et'}
        icon={FcGoogle}
        onClick={() => {}}
      />
      <Button
        outline
        label={'Github ile devam et'}
        icon={AiFillGithub}
        onClick={() => {}}
      />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="justify-center flex flex-row items-center gap-2">
          <div>İlk kez Airbnb kullanıyor musunuz?</div>
          <div
            onClick={toggle}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Hesap oluştur
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title={'Giriş Yap'}
      actionLabel={'Devam Et'}
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default LoginModal;
