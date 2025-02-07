import { auth } from "@/auth";

/**
 * mainly used in server actions
 */
export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();
  return session?.user?.role;
};
