import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "./authContext";
import { applyServerErrors } from "../../utils/applyServerErrors";
import { EMAIL_PATTERN } from "../../utils/validation";
import uploadIcon from "../../assets/icons/upload.svg";
import styles from "./AuthModal.module.css";

const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const AVATAR_MAX_SIZE = 2 * 1024 * 1024; //given in api

function RegisterModal({ onClose, onSwitchToLogin }) {
  const { register: registerUser } = useAuth(); //rename context's register because react hook form's register uses same name
  const [serverError, setServerError] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [avatarError, setAvatarError] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, touchedFields, isValid, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const avatarPreview = useMemo(
    () => (avatar ? URL.createObjectURL(avatar) : null),
    [avatar], //created temporary local url for chosen file to preview
  );
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; //allows to pick same file after error
    if (!file) return;

    if (!AVATAR_TYPES.includes(file.type)) {
      setAvatar(null);
      setAvatarError("Please upload a JPG, PNG or WEBP image");
      return;
    }
    if (file.size > AVATAR_MAX_SIZE) {
      setAvatar(null);
      setAvatarError("Image must be 2MB or smaller");
      return;
    }
    setAvatarError(null);
    setAvatar(file);
  }

  async function onSubmit(data) {
    setServerError(null);

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);
    if (avatar) formData.append("avatar", avatar);

    try {
      await registerUser(formData);
    } catch (error) {
      if (applyServerErrors(error, setError)) return;
      setServerError(error.message);
    }
  }

  const avatarMessage = avatarError || errors.avatar?.message;

  return (
    <Modal onClose={onClose} maxWidth={475} className={styles.RegisterModal}>
      <header className={styles.header}>
        <h2 className={styles.title}>Sign up</h2>
        <p className={styles.subtitle}>Welcome to Kino XII</p>
      </header>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className={styles.avatarField}>
          <label className={styles.avatar}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={styles.fileInput}
              onChange={handleAvatarChange}
            />
            <span className={styles.avatarBox}>
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className={styles.avatarImage}
                />
              ) : (
                <img src={uploadIcon} alt="" className={styles.uploadIcon} />
              )}
            </span>
            <span className={styles.avatarText}>
              <span className={styles.avatarTitle}>
                Upload avatar (optional)
              </span>
              <span className={styles.avatarHint}>JPG, PNG or WEBP</span>
            </span>
          </label>
          {avatarMessage && (
            <p className={styles.fieldError}>{avatarMessage}</p>
          )}
        </div>

        <Input
          label="Username"
          placeholder="User"
          error={errors.username?.message}
          isValid={touchedFields.username && !errors.username}
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
          })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="example@gmail.com"
          error={errors.email?.message}
          isValid={touchedFields.email && !errors.email}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: EMAIL_PATTERN,
              message: "Please enter a valid email",
            },
          })}
        />

        <div className={styles.row}>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            isValid={touchedFields.password && !errors.password}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 3, message: "At least 3 characters" },
              deps: ["password_confirmation"], //if user changes password after filling confirmm field, matching gets checked again
            })}
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            error={errors.password_confirmation?.message}
            isValid={
              touchedFields.password_confirmation &&
              !errors.password_confirmation
            }
            {...register("password_confirmation", {
              required: "Please confirm your password",
              validate: (value) =>
                value === getValues("password") || "Passwords do not match",
            })}
          />
        </div>
        {serverError && <p className={styles.formError}>{serverError}</p>}

        <Button
          type="submit"
          fullWidth
          disabled={!isValid}
          loading={isSubmitting}
        >
          Sign up
        </Button>
      </form>

      <p className={styles.footer}>
        Already have an account?{" "}
        <button
          type="button"
          className={styles.switchLink}
          onClick={onSwitchToLogin}
        >
          Log in
        </button>
      </p>
    </Modal>
  );
}

export default RegisterModal;
