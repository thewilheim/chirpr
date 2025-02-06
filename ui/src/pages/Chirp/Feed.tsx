import { useGetChirpsQuery } from "../../slices/chirpSlice.ts";
import Chirp from "../../components/Chirp.tsx";
import { IChirp } from "../../config/applicatonConfig.ts";
import CreateChirp from "../../components/CreateChirp.tsx";
import Loader from "../../components/Loader.tsx";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../slices/apiSlice.ts";

const ChirpFeed = () => {
  const { data: chirps, isLoading } = useGetChirpsQuery();
  const isAuthenticted = useSelector(selectCurrentToken)

  return (
    <div className="md:p-6">
      <div className="flex flex-row justify-between mb-5 px-4">
        <h1 className="text-2xl font-bold">Chirps</h1>
        <div className="flex flex-row">
          <p>Recents</p>
          <p className="mx-4">Friends</p>
          <p>Popular</p>
        </div>
      </div>
      {isAuthenticted && <CreateChirp parent_id={0} />}
      <section className="flex flex-col justify-center">
        {isLoading ? (
          <Loader />
        ) : (
          chirps?.map((item: IChirp) => {
            return <Chirp chirpData={item} key={item.id} />;
          })
        )}
      </section>
    </div>
  );
};

export default ChirpFeed;
