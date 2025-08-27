"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeader from "../common/SectionHeader";

const committee = [
  {
    name: "Dr.Areej Adnan Aldossary",
    role: "Permanent DaleelFM Committee",
    image: "/images/Areej.png",
    group: "permanent",
  },
  {
    name: "Dr. Aseel Masaad A. AlAssimi",
    role: "Permanent DaleelFM Committee",
    image: "/images/Aseel.png",
    group: "permanent",
  },
  {
    name: "Dr.Muna Ali Almaghaslah",
    role: "Permanent DaleelFM Committee",
    image: "/images/Muna.png",
    group: "permanent",
  },
  {
    name: "Dr. Adel F. Yasky",
    role: "Digital partener",
    image: "/images/Adel.png",
    group: "digital",
  },
  {
    name: "Dr.Fajr Aldulajian",
    role: "Organizing Committee Lead",
    image: "/images/Fajr.png",
    group: "organizing",
  },
];

const CommitteeSection: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
        ease: "easeOut",
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const memberVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const logoVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 15,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  const MemberCard = ({
    member,
    index,
  }: {
    member: (typeof committee)[0];
    index: number;
  }) => (
    <motion.div
      className="flex flex-col items-center"
      variants={memberVariants}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
    >
      <div className="relative flex items-center justify-center w-40 h-32 mb-2">
        {/* Circle background - NO ANIMATION, stays static */}
        <span className="absolute left-1/2 -translate-x-1/2 top-2 w-32 h-32 rounded-full bg-[#B5E2DD] z-0" />
        {/* Image with subtle animation */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: index * 0.1 + 0.2,
          }}
          whileHover={{
            y: -2,
            transition: { duration: 0.2, ease: "easeOut" },
          }}
        >
          <Image
            src={member.image}
            alt={member.name}
            width={120}
            height={180}
            className="w-34 h-44 object-cover relative -top-4"
          />
        </motion.div>
      </div>
      <motion.span
        className="text-primary font-bold text-sm text-center leading-tight"
        variants={textVariants}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.2, ease: "easeOut" },
        }}
      >
        {member.name}
      </motion.span>
    </motion.div>
  );

  return (
    <section className="w-full bg-white py-12 px-2 md:px-0 overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Permanent Committee */}
        <motion.div
          className="flex flex-col items-center mb-10"
          variants={sectionVariants}
        >
          <motion.div variants={textVariants}>
            <SectionHeader
              primaryText="Permanent"
              secondaryText="DaleelFM Committee"
              className="mb-12"
            />
          </motion.div>
          <motion.div
            className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-center"
            variants={containerVariants}
          >
            {committee
              .filter((m) => m.group === "permanent")
              .map((member, i) => (
                <MemberCard key={member.name + i} member={member} index={i} />
              ))}
          </motion.div>
        </motion.div>

        {/* Digital Partner & Organizing Committee */}
        <motion.div
          className="flex flex-col items-center md:items-start md:flex-row justify-center gap-24"
          variants={sectionVariants}
        >
          {/* Digital Partner */}
          <motion.div
            className="flex flex-col items-center"
            variants={sectionVariants}
          >
            <motion.div variants={textVariants}>
              <SectionHeader
                primaryText="Digital"
                secondaryText="partener"
                className="mb-12"
              />
            </motion.div>
            <motion.div
              className="flex flex-col items-center"
              variants={containerVariants}
            >
              <MemberCard member={committee[3]} index={0} />
              <motion.div
                variants={logoVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
              >
                <Image
                  src="/icons/eptech.png"
                  alt="EPTECH"
                  width={90}
                  height={24}
                  className="mt-4"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Organizing Committee Lead */}
          <motion.div
            className="flex flex-col items-center"
            variants={sectionVariants}
          >
            <motion.div variants={textVariants}>
              <SectionHeader
                primaryText="Organizing Committee"
                secondaryText="Lead"
                className="mb-12"
              />
            </motion.div>
            <motion.div
              className="flex flex-col items-center"
              variants={containerVariants}
            >
              <MemberCard member={committee[4]} index={0} />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CommitteeSection;

// "use client";
// import Image from "next/image";
// import SectionHeader from "../common/SectionHeader";

// const committee = [
//   {
//     name: "Dr.Areej Adnan Aldossary",
//     role: "Permanent DaleelFM Committee",
//     image: "/images/Areej.png",
//     group: "permanent",
//   },
//   {
//     name: "Dr. Aseel Masaad A. AlAssimi",
//     role: "Permanent DaleelFM Committee",
//     image: "/images/Aseel.png",
//     group: "permanent",
//   },
//   {
//     name: "Dr.Muna Ali Almaghaslah",
//     role: "Permanent DaleelFM Committee",
//     image: "/images/Muna.png",
//     group: "permanent",
//   },
//   {
//     name: "Dr. Adel F. Yasky",
//     role: "Digital partener",
//     image: "/images/Adel.png",
//     group: "digital",
//   },
//   {
//     name: "Dr.Fajr Aldulajian",
//     role: "Organizing Committee Lead",
//     image: "/images/Fajr.png",
//     group: "organizing",
//   },
// ];

// const CommitteeSection: React.FC = () => (
//   <section className="w-full bg-white py-12 px-2 md:px-0">
//     {/* Permanent Committee */}
//     <div className="flex flex-col items-center mb-10">
//       <SectionHeader
//         primaryText="Permanent"
//         secondaryText="DaleelFM Committee"
//         className="mb-12"
//       />
//       <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-center">
//         {committee
//           .filter((m) => m.group === "permanent")
//           .map((member, i) => (
//             <div className="flex flex-col items-center" key={member.name + i}>
//               <div className="relative flex items-center justify-center w-40 h-32 mb-2">
//                 {/* Circle background */}
//                 <span className="absolute left-1/2 -translate-x-1/2 top-2 w-32 h-32 rounded-full bg-[#B5E2DD] z-0" />
//                 {/* Image is taller and shifted up so the head is above the circle */}
//                 <Image
//                   src={member.image}
//                   alt={member.name}
//                   width={120}
//                   height={180}
//                   className="w-34 h-44 object-cover z-10 relative -top-4"
//                 />
//               </div>
//               <span className="text-primary font-bold text-sm text-center leading-tight">
//                 {member.name}
//               </span>
//             </div>
//           ))}
//       </div>
//     </div>

//     {/* Digital Partner & Organizing Committee */}
//     <div className="flex flex-col items-center md:items-start md:flex-row justify-center gap-24">
//       {/* Digital Partner */}
//       <div className="flex flex-col items-center ">
//         <SectionHeader
//           primaryText="Digital"
//           secondaryText="partener"
//           className="mb-12"
//         />
//         <div className="flex flex-col items-center">
//           <div className="relative flex items-center justify-center w-40 h-32 mb-2">
//             {/* Circle background */}
//             <span className="absolute left-1/2 -translate-x-1/2 top-2 w-32 h-32 rounded-full bg-[#B5E2DD] z-0" />
//             {/* Image is taller and shifted up so the head is above the circle */}
//             <Image
//               src={committee[3].image}
//               alt={committee[3].name}
//               width={120}
//               height={180}
//               className="w-34 h-44 object-cover z-10 relative -top-4"
//             />
//           </div>
//           <span className="text-primary font-bold text-sm text-center leading-tight">
//             {committee[3].name}
//           </span>
//         </div>

//         <Image
//           src="/icons/eptech.png"
//           alt="EPTECH"
//           width={90}
//           height={24}
//           className="mt-4"
//         />
//       </div>
//       {/* Organizing Committee Lead */}
//       <div className="flex flex-col items-center ">
//         <SectionHeader
//           primaryText="Organizing Committee"
//           secondaryText="Lead"
//           className="mb-12"
//         />
//         <div className="flex flex-col items-center">
//           <div className="relative flex items-center justify-center w-40 h-32 mb-2">
//             {/* Circle background */}
//             <span className="absolute left-1/2 -translate-x-1/2 top-2 w-32 h-32 rounded-full bg-[#B5E2DD] z-0" />
//             {/* Image is taller and shifted up so the head is above the circle */}
//             <Image
//               src={committee[4].image}
//               alt={committee[4].name}
//               width={120}
//               height={180}
//               className="w-34 h-44 object-cover z-10 relative -top-4"
//             />
//           </div>
//           <span className="text-primary font-bold text-sm text-center leading-tight">
//             {committee[4].name}
//           </span>
//         </div>
//       </div>
//     </div>
//   </section>
// );

// export default CommitteeSection;
