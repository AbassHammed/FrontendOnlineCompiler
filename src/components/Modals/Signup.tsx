import { authModalState } from '@/atoms/authModalAtom';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

type SignupProps = {};

const Signup: React.FC<SignupProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const [inputs, setInputs] = useState({ email: '', password: '', confirmPassword: '' });
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    const isValid =
      passwordRegex.test(inputs.password) && inputs.password === inputs.confirmPassword;
    setIsFormValid(isValid);

    if (!passwordRegex.test(inputs.password)) {
      setPasswordError(
        'Password must be at least 8 characters long and include uppercase, lowercase, numeric, and special characters.',
      );
    } else if (inputs.password != inputs.confirmPassword) {setPasswordError('Passwords do not match');} else {setPasswordError('');}
  }, [inputs]);

  const handleClick = () => {
    setAuthModalState(prev => ({ ...prev, type: 'login' }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputs.email || !inputs.password) {return toast.info('Please fill all fields');}
    try {
      const newUser = await createUserWithEmailAndPassword(inputs.email, inputs.password);
      if (!newUser) {return;}
      router.push('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (error) {toast.error(error.message);}
  }, [error]);

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
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
          placeholder="name@company.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium block mb-2 text-gray-300">
          Password
        </label>
        <div className="relative flex items-center">
          <input
            onChange={handleChangeInput}
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="password"
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white "
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
