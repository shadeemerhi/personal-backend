export const isAuth = (inputKey: string): boolean =>
  inputKey === process.env.ADMIN_PASSKEY;
