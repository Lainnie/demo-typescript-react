export const setUserLastActivityDate = () => {
  localStorage.setItem('lastLogin', new Date().toString());
};

const getUserLastActivityDate = () => {
  const dateString = localStorage.getItem('lastLogin');
  if (dateString) {
    return new Date(dateString);
  }
  return null;
};

const getDurationSinceUserLastActivity = () => {
  const userLastLoginDate = getUserLastActivityDate();
  if (userLastLoginDate !== null) {
    return new Date().valueOf() - userLastLoginDate.valueOf();
  }
  return null;
};

export const isUserActiveWithinTheLast24h = () => {
  const duration = getDurationSinceUserLastActivity();
  if (duration) {
    return duration < 24 * 3600 * 1000; // is duration less than 24h
  }
  return false;
};
