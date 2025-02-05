import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { AppDispatch } from "./store";
import { useEffect } from "react";
import { fetchUser } from "./slices/authSlice";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    //@ts-expect-error no error
    dispatch(fetchUser());
  }, [dispatch]);
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
