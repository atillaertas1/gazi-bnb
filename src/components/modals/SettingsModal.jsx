import React, { useContext, useState } from "react";
import Modal from "./Modal";
import { toast } from "react-hot-toast";
import { UserContext } from "../../context/userContext";
import { useForm } from "react-hook-form";
import useSettingsModal from "../../hooks/useSettingsModal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import { updateUser } from "../../utils/auth";

function SettingsModal() {
  const settingsModal = useSettingsModal();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

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
      toast.error("You must be logged in to update settings.");
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await updateUser(currentUser.id, data, token);

      if(updatedUser){
        setCurrentUser(null);
      }
      toast.success("Settings updated successfully!");

      settingsModal.onClose();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Update Your Settings" subtitle="Change your username and password" />
      <Input
        id="username"
        label="Username"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        type="password"
        label="Password"
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
      title="Settings"
      actionLabel={isLoading ? "Updating..." : "Update"}
      onClose={settingsModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
}

export default SettingsModal;