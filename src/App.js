import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./project/Header/Header";
import Register from "./project/Register/Register";
import SignIn from "./project/Register/SignIn";
import ExploreProject from "./project/Screen/ExploreProject";
import ProjectSpace from "./project/Screen/ProjectSpace";
import WorkSpace from "./project/Screen/WorkSpace";
import PersonalSpace from "./project/Screen/PersonalProject";
import CreateSteps from "./project/Screen/CreateSteps";
import Review from "./project/Screen/Review";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/workSpace" element={<WorkSpace />} />
          <Route path="/personal" element={<PersonalSpace />} />
          <Route path="/project/:id" element={<ProjectSpace />} />
          <Route path="/explore/:id" element={<ExploreProject />} />
          <Route path="/steps/:id" element={<CreateSteps />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
