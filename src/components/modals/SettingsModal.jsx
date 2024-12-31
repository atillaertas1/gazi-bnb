import React, { useContext, useState } from "react";
import Modal from "./Modal";
import { toast } from "react-hot-toast";
import { UserContext } from "../../context/userContext";
import { useForm } from "react-hook-form";
import useSettingsModal from "../../hooks/useSettingsModal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import { updateUser } from "../../utils/auth";
import { useNavigate } from 'react-router-dom';

function SettingsModal() {
  const settingsModal = useSettingsModal();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: currentUser?.username || "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Ayarları güncellemek için giriş yapmış olmalısınız.");
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await updateUser(currentUser.id, data, token);

      if(updatedUser){
        setCurrentUser(null);
      }
      toast.success("Ayarlar başarıyla güncellendi!");

      settingsModal.onClose();
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Bir şeyler ters gitti.");
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Ayarlarınızı Güncelleyin" subtitle="Kullanıcı adınızı ve şifrenizi değiştirin" />
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

  return (
    <Modal
      disabled={isLoading}
      isOpen={settingsModal.isOpen}
      title="Ayarlar"
      actionLabel={isLoading ? "Güncelleniyor..." : "Güncelle"}
      onClose={settingsModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
}

export default SettingsModal;