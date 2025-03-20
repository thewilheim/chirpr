import axios from "axios";
import { BASE_URL, USERS_URL } from "../constrants";
import { ChangeEvent, useEffect, useState } from "react";
import { IUser } from "../config/applicatonConfig";
import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";
import { useDebounce } from "./Debouce";

function Search() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<IUser[]>();
  const getUsers = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target) {
      setQuery(e.target.value);
    }
  };
  const processChange = useDebounce(getUsers, 1000);

  useEffect(() => {
    axios
      .get(`${BASE_URL}${USERS_URL}/search?username=${query}`)
      .then((res) => setUsers(res.data));
  }, [query]);
  return (
    <div className="py-6 mb-2">
      <div className="flex flex-col justify-center">
        <input
          type="text"
          onChange={processChange}
          className="rounded text-whte p-2 dark:bg-chirpr-600 placeholder:text-white"
          placeholder="Search"
        />
      </div>
      {query && (
        <div className="flex flex-col  bg-chirpr-700 mt-4 rounded border-chirpr-400 border">
          <div className="py-2 border-b border-chirpr-300">
            <p className="text-white p-2">Search for "{query}"</p>
          </div>
          {users &&
            users.map((user) => {
              return (
                <Link
                  to={`/profile/${user.id}`}
                  className="my-1 p-2"
                  onClick={() => setUsers([])}
                >
                  <div className="flex flex-row justify-start items-center hover:bg-chirpr-500 rounded align-middle p-1">
                    <div className="w-12 h-12">
                      <ProfilePicture
                        profile_picture_url={user.profile_picture_url}
                        editable={false}
                        width={"w-12"}
                        height={"h-12"}
                      />
                    </div>
                    <p className="ml-4">{user.username}</p>
                  </div>
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default Search;
