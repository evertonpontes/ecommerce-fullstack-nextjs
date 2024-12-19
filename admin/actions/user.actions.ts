'use server';
import bcrypt from 'bcrypt';
import User from '@/models/user';
import client, { connectDB } from '@/lib/db';
import { signIn } from '@/auth';

export async function getUserFromDb(email: string, password: string) {
  try {
    await connectDB();
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return {
        success: false,
        message: 'User not found.',
      };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return {
        success: false,
        message: 'Invalid password.',
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'Something went wrong.',
    };
  }
}

export async function register(name: string, email: string, password: string) {
  try {
    await connectDB();
    const userFound = await User.findOne({ email });
    if (userFound) {
      return {
        success: false,
        message: 'Email already exists!',
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(savedUser)),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: 'Something went wrong!',
    };
  }
}

export async function login(email: string, password: string) {
  try {
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      data: res,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Email or password is incorrect.',
    };
  }
}
