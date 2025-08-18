"use client";
import React from "react";
import SectionHeader from "../common/SectionHeader";
import Image from "next/image";

const FounderSection: React.FC = () => {
  return (
    <section className="w-full bg-white px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 py-8 sm:py-12">
      <SectionHeader
        primaryText="DaleelFM"
        secondaryText="Founder"
        className="mb-6 sm:mb-8 md:mb-10 text-center"
      />

      <div className="flex justify-center">
        <div className="w-full max-w-4xl bg-white sm:shadow-lg sm:rounded-lg p-4 sm:p-6">
          <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 sm:gap-6 md:gap-8">
            {/* Founder Image with Circle BG */}
            <div className="flex-shrink-0 relative flex items-center justify-center">
              <span className="absolute w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full bg-[#B5E2DD] -z-10 translate-y-2 sm:translate-y-3 md:translate-y-4" />
              <Image
                src="/images/founder.png"
                alt="Dr. Hadi Alenazy"
                width={180}
                height={240}
                className="w-28 h-40 sm:w-32 sm:h-48 md:w-36 md:h-52 lg:w-40 lg:h-56 object-cover z-10 relative rounded-lg"
                priority
              />
            </div>

            {/* Founder Info */}
            <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-primary mb-3 sm:mb-4 leading-tight">
                Dr. Hadi Alenazy
              </h2>
              <div className="text-secondary text-xs sm:text-sm md:text-base font-medium leading-relaxed space-y-3 sm:space-y-4">
                <p>
                  <span className="font-semibold">
                    Founder and Editor-In-Chief of{" "}
                    <a
                      href="https://www.DaleelFM.com"
                      className="underline text-secondary hover:text-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      www.DaleelFM.com
                    </a>
                  </span>
                  , currently serving as Executive Director, Planning and
                  Quality at Health and Life Sector, Tawuniya.
                </p>

                <p>
                  Dr. Hadi Saeed Alenazy is a highly experienced Consultant in
                  Family Medicine, Medical Education, and Healthcare Quality and
                  Patient Safety.
                </p>

                <p>
                  His extensive expertise in the healthcare sector has led to
                  numerous national roles supporting the Kingdom&apos;s
                  healthcare transformation, including Deputy-Chair and Member
                  of the Family Medicine Scientific Council, SCFHS, and Board
                  Member and Head of Scientific Committee, SSFCM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;

// "use client";
// import React from "react";
// import SectionHeader from "../common/SectionHeader";
// import Image from "next/image";

// const FounderSection: React.FC = () => {
//   return (
//     <section className="w-full bg-white px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 py-8 sm:py-12">
//       <SectionHeader
//         primaryText="DaleelFM"
//         secondaryText="Founder"
//         className="mb-6 sm:mb-8 md:mb-10 text-center"
//       />

//       <div className="flex justify-center">
//         <div className="w-full max-w-4xl bg-white sm:shadow-lg sm:rounded-lg p-4 sm:p-6">
//           <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 sm:gap-6 md:gap-8">
//             {/* Founder Image with Circle BG */}
//             <div className="flex-shrink-0 relative flex items-center justify-center">
//               <span className="absolute w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full bg-[#B5E2DD] -z-10 translate-y-2 sm:translate-y-3 md:translate-y-4" />
//               <Image
//                 src="/images/founder.png"
//                 alt="Dr. Hadi Alenazy"
//                 width={180}
//                 height={240}
//                 className="w-28 h-40 sm:w-32 sm:h-48 md:w-36 md:h-52 lg:w-40 lg:h-56 object-cover z-10 relative rounded-lg"
//                 priority
//               />
//             </div>

//             {/* Founder Info */}
//             <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
//               <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-primary mb-3 sm:mb-4 leading-tight">
//                 Dr. Hadi Alenazy
//               </h2>
//               <div className="text-secondary text-xs sm:text-sm md:text-base font-medium leading-relaxed space-y-3 sm:space-y-4">
//                 <p>
//                   <span className="font-semibold">
//                     Founder and Editor-In-Chief of{" "}
//                     <a
//                       href="https://www.DaleelFM.com"
//                       className="underline text-secondary hover:text-primary transition-colors"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       www.DaleelFM.com
//                     </a>
//                   </span>
//                   , currently serving as Executive Director, Planning and
//                   Quality at Health and Life Sector, Tawuniya.
//                 </p>

//                 <p>
//                   Dr. Hadi Saeed Alenazy is a highly experienced Consultant in
//                   Family Medicine, Medical Education, and Healthcare Quality and
//                   Patient Safety.
//                 </p>

//                 <p>
//                   His extensive expertise in the healthcare sector has led to
//                   numerous national roles supporting the Kingdom's healthcare
//                   transformation, including Deputy-Chair and Member of the
//                   Family Medicine Scientific Council, SCFHS, and Board Member
//                   and Head of Scientific Committee, SSFCM.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FounderSection;
