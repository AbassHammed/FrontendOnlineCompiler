import React, { useState } from 'react';

import { useRouter } from 'next/router';

import { authModalState } from '@/atoms';
import { useToast } from '@/components/ui/use-toast';
import { auth } from '@/firebase/firebase';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { useSetRecoilState } from 'recoil';

const Login: React.FC = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const setAuthModalState = useSetRecoilState(authModalState);
  const handleClick = (type: 'login' | 'register' | 'forgotPassword') => {
    setAuthModalState(prev => ({ ...prev, type }));
  };
  const [inputs, setInputs] = useState({ email: '', password: '' });
  const [signInWithEmailAndPassword, loading] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputs.email || !inputs.password) {
      toast({ title: 'Empty fields', description: 'Please fill in all fields' });
      return;
    }
    try {
      const newUser = await signInWithEmailAndPassword(inputs.email, inputs.password);
      if (newUser) {
        router.push('/session');
      }
    } catch (error: any) {
      toast({ description: error.message });
    }
  };
  return (
    <form className="space-y-6 px-6 pb-4" onSubmit={handleLogin}>
      <h3 className="text-xl font-medium text-white">Log In</h3>
      <div>
        <label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">
          Your Email
        </label>
        <input
          onChange={handleInputChange}
          type="email"
          name="email"
          id="email"
          className="
            border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            bg-gray-600 border-gray-500 placeholder-gray-400 text-white
        "
          placeholder="name@company.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium block mb-2 text-gray-300">
          Your Password
        </label>
        <div className="relative flex items-center">
          <input
            onChange={handleInputChange}
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="password"
            className="
				border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
				bg-gray-600 border-gray-500 placeholder-gray-400 text-white
			"
            placeholder="*******"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
            {showPassword ? (
              <FaRegEyeSlash className="h-5 w-5 text-white" onClick={togglePasswordVisibility} />
            ) : (
              <FaRegEye className="h-5 w-5 text-white" onClick={togglePasswordVisibility} />
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full text-white focus:ring-blue-300 font-medium rounded-lg
                text-sm px-5 py-2.5 text-center bg-brand-purple hover:bg-brand-purple-s
            ">
        {loading ? 'Loading...' : 'Log In'}
      </button>
      <button className="flex w-full justify-end" onClick={() => handleClick('forgotPassword')}>
        <a href="#" className="text-sm block text-gray-300 hover:underline w-full text-right">
          Forgot Password?
        </a>
      </button>
      <div className="text-sm font-medium text-gray-300">
        Not Registered?{' '}
        <a
          href="#"
          className="text-blue-700 hover:underline"
          onClick={() => handleClick('register')}>
          Create account
        </a>
      </div>
    </form>
  );
};
export default Login;
