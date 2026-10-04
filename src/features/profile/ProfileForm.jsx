import { useState } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "../auth/authContext";
import { useFilterOptions } from "../sessions/useSessions";
import { updateProfile } from "../../api/profile";
import { applyServerErrors } from "../../utils/applyServerErrors";
import {
  fullNameRules,
  validateMobile,
  validateDateOfBirth,
} from "../../utils/validation";
import { isoToDisplayDate, displayToIsoDate } from "../../utils/date";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import arrowDownIcon from "../../assets/icons/arrowDown.svg";
import checkIcon from "../../assets/icons/check.svg";
import calendarIcon from "../../assets/icons/calendar.svg";
import styles from "./ProfileForm.module.css";

function toFormValues(user) {
  return {
    fullName: user.fullName ?? "",
    mobileNumber: user.mobileNumber ?? "",
    dateOfBirth: user.dateOfBirth ? isoToDisplayDate(user.dateOfBirth) : "",
    preferredVenueId: user.preferredVenue ? String(user.preferredVenue.id) : "",
  };
}
function getEligibility(age) {
  if (age == null) return null;
  if (age >= 18)
    return `You are ${age}, so you can buy tickets for all age ratings.`;
  if (age >= 16)
    return `You are ${age}, so you cannot buy tickets for 18+ titles.`;
  return `You are ${age}, so you cannot buy tickets for 16+ or 18+ titles.`;
}

function ProfileForm() {
  const { user, updateUser } = useAuth();
  const options = useFilterOptions();
  const [serverError, setServerError] = useState(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, touchedFields, isDirty, isValid, isSubmitting },
  } = useForm({ mode: "onTouched", defaultValues: toFormValues(user) });

  async function onSubmit(values) {
    setServerError(null);
    setSaved(false);
    try {
      const updated = await updateProfile({
        fullName: values.fullName.trim(),
        mobileNumber: values.mobileNumber.replace(/\s/g, ""),
        dateOfBirth: displayToIsoDate(values.dateOfBirth),
        preferredVenueId: values.preferredVenueId
          ? Number(values.preferredVenueId)
          : null,
      });
      updateUser(updated);
      reset(toFormValues(updated)); //saved value becomes unchanged state
      setSaved(true);
    } catch (error) {
      if (applyServerErrors(error, setError)) return;
      setServerError(error.message);
    }
  }
  const eligibility = getEligibility(user.age);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {user.profileComplete ? (
        <p className={`${styles.status} ${styles.complete}`}>
          Profile Complete{" "}
          <img src={checkIcon} alt="" className={styles.statusIcon} />
        </p>
      ) : (
        <p className={`${styles.status} ${styles.incomplete}`}>
          Please complete your profile to enable booking.
        </p>
      )}

      <Input
        label="Full name"
        placeholder="e.g. Meri Sanikidze"
        error={errors.fullName?.message}
        isValid={touchedFields.fullName && !errors.fullName}
        {...register("fullName", fullNameRules)}
      />
      <div className={styles.field}>
        <Input label="Email" value={user.email} disabled readOnly />
        <p className={styles.hint}>Set at registration and cannot be changed</p>
      </div>
      <Input
        label="Mobile number"
        placeholder="5XX XXX XXX"
        inputMode="numeric"
        error={errors.mobileNumber?.message}
        isValid={touchedFields.mobileNumber && !errors.mobileNumber}
        {...register("mobileNumber", { validate: validateMobile })}
      />
      <div className={styles.field}>
        <Input
          label="Date of birth"
          placeholder="DD/MM/YYYY"
          inputMode="numeric"
          error={errors.dateOfBirth?.message}
          isValid={touchedFields.dateOfBirth && !errors.dateOfBirth}
          action={
            <img src={calendarIcon} alt="" className={styles.calendarIcon} />
          }
          {...register("dateOfBirth", { validate: validateDateOfBirth })}
        />
        {eligibility && <p className={styles.hint}>{eligibility}</p>}
      </div>
      <label className={styles.selectField}>
        <span className={styles.label}>Preferred venue (optional)</span>
        <span className={styles.selectWrap}>
          <select
            className={styles.select}
            disabled={!options.data}
            {...register("preferredVenueId")}
          >
            <option value="">No preference</option>
            {options.data?.venues.map((venue) => (
              <option key={venue.id} value={String(venue.id)}>
                {venue.name} · {venue.city}
              </option>
            ))}
          </select>
          <img src={arrowDownIcon} alt="" className={styles.arrowDown} />
        </span>
      </label>
      {serverError && <p className={styles.formError}>{serverError}</p>}
      <div className={styles.actions}>
        <Button
          type="submit"
          disabled={!isDirty || !isValid}
          loading={isSubmitting}
        >
          Save changes
        </Button>
        {saved && !isDirty && (
          <span className={styles.saved}>Changes saved</span>
        )}
      </div>
    </form>
  );
}

export default ProfileForm;
