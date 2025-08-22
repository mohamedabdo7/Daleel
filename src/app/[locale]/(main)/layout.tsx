import Footer from "@/app/components/layouts/Footer";
import Navbar from "@/app/components/layouts/Navbar";
import React from "react";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed navbar at top */}
      <Navbar />

      {/* Main content area with navbar offset and flex-grow */}
      <main className="flex-1 pt-16 lg:pt-20">
        {/* pt-16 for mobile (h-16), pt-20 for desktop (lg:h-20) to match navbar height */}
        {children}
      </main>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  );
};

export default MainLayout;

// import Footer from "@/app/components/layouts/Footer";
// import Navbar from "@/app/components/layouts/Navbar";
// import React from "react";

// const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   return (
//     <>
//       {/* Sticky transparent navbar that works on all pages */}
//       <Navbar />

//       {/* Page content */}
//       {children}

//       {/* Footer with different background */}
//       <Footer />
//     </>
//   );
// };

// export default MainLayout;
