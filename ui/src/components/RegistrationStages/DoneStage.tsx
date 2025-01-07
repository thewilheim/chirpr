import { MdOutlineDoneAll } from "react-icons/md";

export const DoneStage = () => {
    return (
      <div className="text-center">
        <MdOutlineDoneAll className="mx-auto text-6xl mb-4 text-green-500" />
        <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
        <p className="text-gray-300 mb-4">
          Click submit to complete your registration and join Chirpr.
        </p>
        <button
          type="submit"
          className="w-full bg-chirpr-700 hover:bg-chirpr-800 px-4 py-2 rounded-lg text-sm"
        >
          Complete Registration
        </button>
      </div>
    );
  };