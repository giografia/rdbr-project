import { useForm } from "react-hook-form";

import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import styles from "./LoginModal.module.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginModal({ onClose, onSwitchToRegister }) {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid, isSubmitting },
  } = useForm({ mode: "onTouched" });

  async function onSubmit(data) {
    console.log(data); // replace with api call !!!!!
  }

  return (
    <Modal onClose={onClose}>
      <header className={styles.header}>
        <h2 className={styles.title}>Log in</h2>
        <p className={styles.subtitle}>Welcome back to Kino XII</p>
      </header>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
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

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          isValid={touchedFields.password && !errors.password}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 3,
              message: "At least 3 characters",
            },
          })}
        />

        <Button
          type="submit"
          fullWidth
          disabled={!isValid}
          loading={isSubmitting}
        >
          Log in
        </Button>
      </form>
      <p className={styles.footer}>
        Don't have an account?{" "}
        <button
          type="button"
          className={styles.switchLink}
          onClick={onSwitchToRegister}
        >
          Sign up
        </button>
      </p>
    </Modal>
  );
}

export default LoginModal;
