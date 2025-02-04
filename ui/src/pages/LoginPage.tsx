import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiNestBirds } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { useLoginMutation } from "../slices/userApiSlice";
import { selectCurrentToken } from "../slices/apiSlice";

interface FormErrors {
  email?: string;
  password?: string;
}

function LoginPage() {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectCurrentToken);

  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const location = useLocation();

  // Validate form inputs
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }
    try {
      const response = await login({ email, password }).unwrap();
      if (response) {
        dispatch(setCredentials(response));
      }
      navigate('/');
    } catch (error) {
      console.log(error);
      setSubmitError(authError || 'An unexpected error occurred');
    }
  };

  // Clear specific error when user starts typing
  const handleInputChange = (field: keyof FormErrors, value: string) => {
    setErrors(prev => ({ ...prev, [field]: undefined }));
    setSubmitError(null);
    
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Error message component
  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <p className="text-red-500 text-sm mt-1">{message}</p>;
  };

  return (
    <main className="flex flex-col md:flex-row justify-center items-center h-screen w-full bg-chirpr-800 dark:text-chirpr-100">
      {/* Left Section */}
      <div className="text-center md:text-right flex flex-col justify-center p-4 md:pr-16 w-full md:w-1/2">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Chirpr</h1>
        <p className="font-medium mb-8 md:mb-16 text-lg">
          Chirpr where you can express you're freedom of chirp
        </p>
      </div>

      <div className="h-1/2 bg-chirpr-300 w-[1px] rounded-lg">

      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex flex-col pl-16">
        <GiNestBirds size={64} className="mb-8 text-chirpr-100" />
        
        {submitError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {submitError}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm md:max-w-md lg:max-w-lg space-y-6 justify-self-start"
        >
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`bg-chirpr-200 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } text-sm rounded-lg w-full p-2.5 dark:text-black focus:ring-chirpr-300`}
              placeholder="name@chirpr.com"
              required
            />
            <ErrorMessage message={errors.email} />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Your Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`bg-chirpr-200 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } text-sm rounded-lg w-full p-2.5 dark:text-black focus:ring-chirpr-300`}
              placeholder="********"
              required
            />
            <ErrorMessage message={errors.password} />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-chirpr-700 hover:bg-chirpr-800 focus:ring-4 focus:outline-none focus:ring-chirpr-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-chirpr-500 dark:hover:bg-chirpr-600 dark:focus:ring-chirpr-800 w-full sm:w-auto"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-chirpr-700 hover:bg-chirpr-800 focus:ring-4 focus:outline-none focus:ring-chirpr-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-chirpr-600 dark:hover:bg-chirpr-700 dark:focus:ring-chirpr-800 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {'Submit'}
            </button>
          </div>

          {/* Link to Register */}
          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;
