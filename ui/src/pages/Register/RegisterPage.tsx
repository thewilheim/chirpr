import { ChangeEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GiNestBirds } from "react-icons/gi";
import { AccountInfoStage } from "../../components/RegistrationStages/AccountInfo";
import { DoneStage } from "../../components/RegistrationStages/DoneStage";
import { PersonalInfoStage } from "../../components/RegistrationStages/PersonalInfo";
import axios from "axios";
import { useRegisterMutation } from "../../slices/userApiSlice";

export interface StageInfoProps {
  formData: {
    email?: string,
    password?: string,
    confirmPassword?: string,
    username?: string,
    firstName?: string,
    lastName?: string,
    profilePicture?: string,
  };
  handleInputChange: (field: string, value: string) => void;
  handleFileChange?: (e: ChangeEvent<HTMLInputElement>) => Promise<void>
  file?: File | null;
  errors: FormErrors;
  ErrorMessage: React.FC<{ message?: string }>;
}


interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
}

function RegisterPage() {
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    firstName: "",
    lastName: "",
    profilePicture: "",
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  console.log(uploadProgress)
  const [register] = useRegisterMutation();
  const navigate = useNavigate();

  const steps = ["Personal Info", "Account Info", "Done!"];
  const onLastStep = currentStep === steps.length;

  // Validate form inputs for each step
  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      // Personal Info validation
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (step === 2) {
      // Account Info validation
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateStep(currentStep)) {
      return;
    }

    if (onLastStep) {
      try {
        const response = await handleFileUpload();
        await register({email: formData.email, password: formData.password, username: formData.username, first_name: formData.firstName, last_name: formData.lastName, profile_picture_url: response?.data.filePath});
        navigate("/");
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'Registration failed');
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  const handleFileUpload = async () => {
    if(!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await axios.post(`http://localhost:5042/api/v1/Upload`, formData, {
        headers: {
          "Content-Type": "multipar/form-data",
        },
        onUploadProgress: (processEvent) => {
          //@ts-expect-error should be fine
          const progress = Math.round((processEvent.loaded * 100) / processEvent?.total);
          setUploadProgress(progress);
        }
      });
      if(!response) throw new Error('File upload failed')
      console.log("File uploaded successfully:", response);
      return response
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  // Error message component
  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <p className="text-red-500 text-sm mt-1">{message}</p>;
  };

  return (
    <main className="flex flex-col md:flex-row items-center h-screen w-full bg-chirpr-800 dark:text-chirpr-100">
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex flex-col justify-center p-6 md:w-1/3 border-r-2 border-chirpr-600">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Sign up</h1>
        <p className="mb-16 font-bold">
          Enter your information to join Chirpr.
        </p>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-2/3 h-full flex flex-col justify-center items-center p-4">
        <GiNestBirds size={64} className="mb-6" />
        
        {submitError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {submitError}
          </div>
        )}

        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <StepsHeader steps={steps} currentStep={currentStep} />
          
          {currentStep === 1 && (
            <PersonalInfoStage
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
              ErrorMessage={ErrorMessage}
            />
          )}
          
          {currentStep === 2 && (
            <AccountInfoStage
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
              handleFileChange={handleFileChange}
              file={file}
              ErrorMessage={ErrorMessage}
            />
          )}
          
          {currentStep === 3 && <DoneStage />}

          {/* Navigation Buttons */}
          {!onLastStep && (
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() =>
                  currentStep === 1 ? navigate("/") : setCurrentStep(currentStep - 1)
                }
                className="bg-chirpr-700 hover:bg-chirpr-800 px-4 py-2 rounded-lg text-sm"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-chirpr-700 hover:bg-chirpr-800 px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {'Next'}
              </button>
            </div>
          )}

          {onLastStep && (
            <p className="mt-4 text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login here
              </Link>
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

// Existing components with updated props
const StepsHeader = ({ steps, currentStep }: { steps: string[]; currentStep: number }) => {
  // Reference existing implementation
  return (
    <div className="flex justify-between mb-4 text-chirpr-200/50">
      {steps.map((step, index) => (
        <div key={step} className="text-center flex-1">
          <p className={`text-sm ${currentStep === index + 1 ? "text-chirpr-200" : ""}`}>{index + 1}</p>
          <p className={`text-xs ${currentStep === index + 1 ? "text-chirpr-200" : ""}`}>{step}</p>
        </div>
      ))}
    </div>
  );
};

export default RegisterPage;


