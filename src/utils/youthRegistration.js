export const isYouthRegistered = (user) => {
  if (!user || user.role !== "Youth") {
    return true;
  }

  if (typeof user.is_registered === "boolean") {
    return user.is_registered;
  }

  if (typeof user.registered === "boolean") {
    return user.registered;
  }

  return false;
};

export const getUserHomePath = (user) => {
  if (!user) return "/";

  switch (user.role) {
    case "Youth":
      return isYouthRegistered(user) ? "/youth/dashboard" : "/youth/my-profile";
    case "SK":
      return "/sk/dashboard";
    case "Admin":
      return "/admin/dashboard";
    default:
      return "/";
  }
};