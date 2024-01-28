import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import Navbar from '@/components/Navbar/Navbar';
import { useResetPassword } from '@/hooks/useResetPassword';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { resetPassword, error, isSuccessful, loading } = useResetPassword();
  const [inputs, setInputs] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [oobCode, setOobCode] = useState('');

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (router.isReady) {
      const code = router.query.oobCode as string;
      console.log('oobCode:', oobCode);
      if (code) {
        setOobCode(code);
      } else {
        toast.error('Invalid or missing code for password reset.');
        router.push('/some-error-page'); // Redirect to a suitable error page or home
      }
    }
  }, [router]);

  useEffect(() => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const valid = passwordRegex.test(inputs.password) && inputs.password === inputs.confirmPassword;
    setIsValid(valid);

    setPasswordError(
      !passwordRegex.test(inputs.password)
        ? 'Password must be at least 8 characters long and include uppercase, lowercase, numeric, and special characters.'
        : inputs.password !== inputs.confirmPassword
          ? 'Passwords do not match'
          : '',
    );
  }, [inputs.password, inputs.confirmPassword]);

  useEffect(() => {
    if (error) {toast.error(error.message);}
  }, [error]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(oobCode);
    console.log('Hello');

    if (!oobCode) {
      toast.error('Invalid or missing code for password reset.');
      return;
    }

    try {
      toast.info('Starting...');
      await resetPassword(oobCode, inputs.password);
      if (isSuccessful) {
        toast.success('Your password has been updated');
        setTimeout(() => router.push('/auth'), 3000);
      }
    } catch (error) {
      toast.error('Error resetting password. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1A1A1A] text-white relative">
      <div className="absolute w-full top-0">
        <Navbar />
      </div>
      <div className="w-full sm:w-[450px]  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  flex justify-center items-center">
        <div className="relative w-full h-full mx-auto flex items-center justify-center">
          <div className="bg-white rounded-lg shadow relative w-full bg-gradient-to-b from-brand-purple to-slate-900 mx-6">
            <form className="space-y-6 px-6 pb-4" onSubmit={handleSubmit}>
              <h3 className="text-xl font-medium text-white mt-4">Reset Password</h3>
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
                      <FaRegEyeSlash
                        className="h-5 w-5 text-white"
                        onClick={togglePasswordVisibility}
                      />
                    ) : (
                      <FaRegEye className="h-5 w-5 text-white" onClick={togglePasswordVisibility} />
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium block mb-2 text-gray-300">
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
                disabled={!isValid}
                className="w-full text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-purple hover:bg-brand-purple-s">
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
