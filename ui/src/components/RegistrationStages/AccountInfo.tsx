import { StageInfoProps } from "../../pages/Register/RegisterPage";

export const AccountInfoStage: React.FC<StageInfoProps> = ({ formData, handleInputChange, errors, ErrorMessage, handleFileChange }) => {
    return (
      <>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            className={`bg-chirpr-200 border ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            } text-sm w-full rounded-lg block p-2.5 dark:text-black focus:ring-chirpr-300`}
            placeholder="johndoe"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            required
          />
          <ErrorMessage message={errors.username} />
        </div>
  
        <div className="mb-4">
          <label htmlFor="profilePicture" className="block mb-2 text-sm font-medium">
            Profile Picture URL (Optional)
          </label>
          <input
            type="file"
            id="profilePicture"
            className="bg-chirpr-200 border border-gray-300 text-sm w-full rounded-lg block p-2.5 dark:text-black focus:ring-chirpr-300"
            placeholder="https://example.com/picture.jpg"
            onChange={handleFileChange}
          />
        </div>
      </>
    );
  }