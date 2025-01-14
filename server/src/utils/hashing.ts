import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    return password

  }


