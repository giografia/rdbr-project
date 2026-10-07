import { useForm } from "react-hook-form";

import { formatShortDate } from "../../utils/date";
import { formatPrice } from "../../utils/price";
import {
  EMAIL_PATTERN,
  fullNameRules,
  validateMobile,
  validateCardNumber,
  validateExpiry,
  validateCvv,
} from "../../utils/validation";
import { countTickets } from "../../utils/tickets";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import styles from "./CheckoutStep.module.css";

function CheckoutStep({
  movie,
  session,
  hall,
  hold,
  user,
  isPaying,
  onBack,
  onPay,
  children,
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, touchedFields, isValid },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      fullName: user.fullName ?? "",
      email: user.email ?? "",
      mobileNumber: user.mobileNumber ?? "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  });
  function showValid(name) {
    return touchedFields[name] && !errors[name];
  }
  return (
    <form
      className={styles.body}
      onSubmit={handleSubmit((values) => onPay(values, setError))}
      noValidate
    >
      <div className={styles.main}>
        {children}

        <div className={styles.fields}>
          <Input
            label="Full Name"
            error={errors.fullName?.message}
            isValid={showValid("fullName")}
            {...register("fullName", fullNameRules)}
          />

          <div className={styles.pair}>
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              isValid={showValid("email")}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: EMAIL_PATTERN,
                  message: "Enter a valid email",
                },
              })}
            />
            <Input
              label="Mobile Number"
              error={errors.mobileNumber?.message}
              isValid={showValid("mobileNumber")}
              {...register("mobileNumber", {
                required: "Mobile number is required",
                validate: validateMobile,
              })}
            />
          </div>

          <hr className={styles.divider} />

          <Input
            label="Card Number"
            placeholder="e.g. 1234 4567 8901 2345"
            inputMode="numeric"
            maxLength={19}
            error={errors.cardNumber?.message}
            isValid={showValid("cardNumber")}
            {...register("cardNumber", {
              required: "Card number is required",
              validate: validateCardNumber,
            })}
          />

          <div className={styles.pair}>
            <Input
              label="Expiry"
              placeholder="e.g. 12/34"
              inputMode="numeric"
              maxLength={5}
              error={errors.expiry?.message}
              isValid={showValid("expiry")}
              {...register("expiry", {
                required: "Expiry is required",
                validate: validateExpiry,
              })}
            />
            <Input
              label="CVV"
              placeholder="e.g. 123"
              inputMode="numeric"
              maxLength={3}
              error={errors.cvv?.message}
              isValid={showValid("cvv")}
              {...register("cvv", {
                required: "CVV is required",
                validate: validateCvv,
              })}
            />
          </div>
        </div>
      </div>

      <aside className={styles.panel}>
        <h3 className={styles.panelTitle}>Summary</h3>
        <div className={styles.summary}>
          <h3 className={styles.movieTitle}>{movie.title}</h3>
          <p className={styles.meta}>
            Hall {hall.name} · {formatShortDate(session.date)} · {session.time}
          </p>
          <dl className={styles.lines}>
            <div className={styles.line}>
              <dt>Seats</dt>
              <dd>{hold.seats.map((s) => s.code).join(", ")}</dd>
            </div>
            <div className={styles.line}>
              <dt>Tickets</dt>
              <dd>{countTickets(hold.seats)}</dd>
            </div>
          </dl>
        </div>

        <div className={styles.footer}>
          <div className={styles.subtotal}>
            <span>Subtotal</span>
            <strong>{formatPrice(hold.subtotal)}</strong>
          </div>
          <div className={styles.actions}>
            <Button
              type="submit"
              fullWidth
              loading={isPaying}
              disabled={!isValid}
            >
              Pay: Complete order
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={onBack}
              disabled={isPaying}
            >
              Back
            </Button>
          </div>
        </div>
      </aside>
    </form>
  );
}

export default CheckoutStep;
