import { Outlet, Route, Routes } from "react-router-dom";

import { Overview } from "./Overview";
import { Layout } from "@components/Layout";

export const Home = () => {
  const homeContainer = (
    <Layout>
      <Outlet></Outlet>
    </Layout>
  );

  return (
    <Routes>
      <Route path='/' element={homeContainer}>
        <Route path='/' element={<Overview />}></Route>
      </Route>
    </Routes>
  );
};
