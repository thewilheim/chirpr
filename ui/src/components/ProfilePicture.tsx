import { FaCircleUser } from "react-icons/fa6";

interface IProfilePicture {
  profile_picture_url: string;
  editable: boolean;
  width: string;
  height: string;
}

function ProfilePicture({
  profile_picture_url,
  width,
  height,
}: IProfilePicture) {
  return (
    <>
      <div
        className={`${width} ${height} rounded-full overflow-clip mb-4 relative hover: cursor-pointer`}
      >
        {!profile_picture_url ? (
          <FaCircleUser className={`cursor-pointer ${width} ${height}`} />
        ) : (
          <img
            src={`${profile_picture_url}`}
            alt=""
            className="object-cover w-full h-full"
          />
        )}
      </div>
    </>
  );
}

export default ProfilePicture;
