import { FaCircleUser } from "react-icons/fa6";
import { useGetSuggestedFollowersQuery } from "../slices/userApiSlice";
import { useSelector } from "react-redux";
import { isAuthenticted } from "../utils";
import { IUser } from "../config/applicatonConfig";
import FollowButton from "./FollowButton";

export const Sidebar = () => {
  return (
    <div className="flex flex-col md:p-4">
      <Trending />
      {isAuthenticted() && <Suggestions />}
    </div>
  );
};

const Suggestions = () => {
  const { userInfo } = useSelector(
    (state: { auth: { userInfo: IUser } }) => state.auth
  );
  const { data: suggestedFollowers, isLoading } = useGetSuggestedFollowersQuery(
    userInfo.id
  );
  return (
    <div className="mb-12">
      <h1 className="mb-4 text-2xl font-bold">Suggestions</h1>
      {isLoading ? (
        <>loading</>
      ) : (
        suggestedFollowers.map(
          (item: {
            id: number;
            username: string;
            profile_picture_url: string;
          }) => {
            return (
              <div
                className="flex flex-row justify-between items-center align-middle mb-4"
                key={item.id}
              >
                <div className="flex-row flex items-center">
                  <FaCircleUser size={45} className="mr-3" />
                  <p className="font-bold">{item.username}</p>
                </div>
                <FollowButton userToFollow={item.id} />
              </div>
            );
          }
        )
      )}
    </div>
  );
};

const Trending = () => {
  return (
    <div className="mb-12">
      <h1 className="mb-4 text-2xl font-bold">Trending</h1>
      <p>coming soon</p>
    </div>
  );
};
