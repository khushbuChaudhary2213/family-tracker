const getLastSeen = (date) => {
  const diffMilisecs = new Date() - date;
  const diffSecs = Math.floor(diffMilisecs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just Now";

  if (diffMins < 60)
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;

  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

export default getLastSeen;
