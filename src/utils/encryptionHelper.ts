import bcrypt from 'bcrypt';

const SALT_ROUNDS = +process.env.SALT_ROUNDS || 10;

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return hashedPassword;
};

export const comparePassword = async (password: string, hashedPassword: string) => {
  const isPasswordValid = await bcrypt.compare(password, hashedPassword);

  return isPasswordValid;
};
