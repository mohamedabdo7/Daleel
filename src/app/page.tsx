import React from "react";
import { redirect } from "next/navigation";

const HomePage: React.FC = () => {
  redirect("/en");
  return null;
};

export default HomePage;
