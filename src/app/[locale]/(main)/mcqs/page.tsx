import React from "react";
import { ProtectedRoute } from "../login/components/protected-route";

const page = () => {
  return (
    <ProtectedRoute>
      <div>page</div>
    </ProtectedRoute>
  );
};

export default page;
