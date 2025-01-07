import { StageInfoProps } from "../../pages/RegisterPage";

export const PersonalInfoStage: React.FC<StageInfoProps> = ({ formData, handleInputChange, errors, ErrorMessage }) => {
    return (
      <>
        {/* First and Last Name Row */}
        <div className="flex flex-row w-full justify-between items-center space-x-4 mb-4">
          <div className="w-1/2">
            <label htmlFor="firstName" className="block mb-2 text-sm font-medium">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className={`bg-chirpr-200 border ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              } text-sm w-full rounded-lg block p-2.5 dark:text-black focus:ring-chirpr-300`}
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
            />
            <ErrorMessage message={errors.firstName} />
          </div>
          <div className="w-1/2">
            <label htmlFor="lastName" className="block mb-2 text-sm font-medium">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className={`bg-chirpr-200 border ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              } text-sm w-full rounded-lg block p-2.5 dark:text-black focus:ring-chirpr-300`}
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
            />
            <ErrorMessage message={errors.lastName} />
          </div>
        </div>
  
        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            className={`bg-chirpr-200 border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } text-sm w-full rounded-lg block p-2.5 dark:text-black focus:ring-chirpr-300`}
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
          <ErrorMessage message={errors.email} />
        </div>
  
        {/* Password Fields */}
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            className={`bg-chirpr-200 border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } text-sm w-full rounded-lg block p-2.5 dark:text-black focus:ring-chirpr-300`}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required
          />
          <ErrorMessage message={errors.password} />
        </div>
  
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className={`bg-chirpr-200 border ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            } text-sm w-full rounded-lg block p-2.5 dark:text-black focus:ring-chirpr-300`}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            required
          />
          <ErrorMessage message={errors.confirmPassword} />
        </div>
      </>
    );
  };