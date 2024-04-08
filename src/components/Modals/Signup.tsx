import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { authModalState } from '@/atoms/authModalAtom';
import { AvartarImg } from '@/data';
import { auth, firestore } from '@/firebase/firebase';
import { currentUserQuery } from '@/firebase/query';
import { useSession } from '@/hooks/useSession';
import { random } from '@/lib/utils';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { useSetRecoilState } from 'recoil';
import { toast } from 'sonner';

import { Icons } from '../icons';

const Signup: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();
  const { setSessionData } = useSession();
  const [createUserWithEmailAndPassword, loading] = useCreateUserWithEmailAndPassword(auth);

  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    const isValid =
      passwordRegex.test(inputs.password) && inputs.password === inputs.confirmPassword;
    setIsFormValid(isValid);

    if (!passwordRegex.test(inputs.password)) {
      setPasswordError(
        'Password must be at least 8 characters long and include uppercase, lowercase, numeric, and special characters.',
      );
    } else if (inputs.password !== inputs.confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  }, [inputs, passwordRegex]);

  const handleClick = () => {
    setAuthModalState(prev => ({ ...prev, type: 'login' }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    if (!inputs.email || !inputs.password || !inputs.confirmPassword || !inputs.fullName) {
      toast.info('Please fill all fields');
    }
    try {
      const newUser = await createUserWithEmailAndPassword(inputs.email, inputs.password);
      if (newUser) {
        await setDoc(doc(firestore, 'users', newUser.user.uid), {
          uid: newUser.user.uid,
          fullName: inputs.fullName,
          email: newUser.user.email,
          createdAt: serverTimestamp(),
          imageUrl: random(AvartarImg),
        });
        await currentUserQuery(newUser.user.uid, setSessionData);
        router.push('/session');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6 px-6 pb-4" onSubmit={handleRegister}>
      <h3 className="text-xl font-medium text-white">Sign Up</h3>
      <div>
        <label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">
          Email
        </label>
        <input
          onChange={handleChangeInput}
          type="email"
          name="email"
          id="email"
          required
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
          placeholder="name@company.com"
        />
      </div>
      <div>
        <label htmlFor="fullName" className="text-sm font-medium block mb-2 text-gray-300">
          Full Name
        </label>
        <input
          onChange={handleChangeInput}
          type="fullName"
          id="fullName"
          name="fullName"
          placeholder="Joe Doe"
          required
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium block mb-2 text-gray-300 ">
          Password
        </label>
        <div className="relative flex items-center">
          <a
            className="text-gray-400 absolute right-3 inset-y-0 mt-4 active:text-gray-600"
            onClick={togglePasswordVisibility}>
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </a>
          <input
            onChange={handleChangeInput}
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            required
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
          />
        </div>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="text-sm font-medium block mb-2 text-gray-300">
          Confirm password
        </label>
        <input
          onChange={handleChangeInput}
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          id="confirmPassword"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white "
          placeholder="*******"
        />
      </div>
      {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}

      <button
        type="submit"
        disabled={!isFormValid}
        className="w-full text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-purple hover:bg-brand-purple-s">
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>

      <div className="text-sm font-medium text-gray-300">
        Already have an account?{' '}
        <a href="#" className="text-blue-700 hover:underline" onClick={() => handleClick()}>
          Log In
        </a>
      </div>
    </form>
  );
};
export default Signup;
