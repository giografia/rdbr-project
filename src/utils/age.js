const RESTRICTED_FROM_AGE = 16;

export function isAgeRestricted(movie, user) {
  const minAge = movie.ageRating.minAge;
  if (!user || user.age == null || minAge < RESTRICTED_FROM_AGE) return false;
  return user.age < minAge;
}
//logged out user is never restricted
