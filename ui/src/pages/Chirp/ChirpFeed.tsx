import { useGetChirpsQuery } from "../../slices/chirpSlice.ts";
import Chirp from "../../components/Chirp.tsx";
import { IChirp } from "../../config/applicatonConfig.ts";
import CreateChirp from "../../components/CreateChirp.tsx";
import { isAuthenticted } from "../../utils/index.ts";
import Loader from "../../components/Loader.tsx";

const ChirpFeed = () => {
  const { data: chirps, isLoading } = useGetChirpsQuery();

  return (
    <div className="md:p-6">
      <div className="flex flex-row justify-between mb-5">
        <h1 className="text-2xl font-bold">Chirps</h1>
        <div className="flex flex-row">
          <p>Recents</p>
          <p className="mx-4">Friends</p>
          <p>Popular</p>
        </div>
      </div>
      {isAuthenticted() && <CreateChirp parent_id={0} />}
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
