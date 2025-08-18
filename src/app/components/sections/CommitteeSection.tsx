"use client";
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

const CommitteeSection: React.FC = () => (
  <section className="w-full bg-white py-12 px-2 md:px-0">
    {/* Permanent Committee */}
    <div className="flex flex-col items-center mb-10">
      <SectionHeader
        primaryText="Permanent"
        secondaryText="DaleelFM Committee"
        className="mb-12"
      />
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-center">
        {committee
          .filter((m) => m.group === "permanent")
          .map((member) => (
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center w-40 h-32 mb-2">
                {/* Circle background */}
                <span className="absolute left-1/2 -translate-x-1/2 top-2 w-32 h-32 rounded-full bg-[#B5E2DD] z-0" />
                {/* Image is taller and shifted up so the head is above the circle */}
                <Image
                  src={member.image}
                  alt={member.name}
                  width={120}
                  height={180}
                  className="w-34 h-44 object-cover z-10 relative -top-4"
                />
              </div>
              <span className="text-primary font-bold text-sm text-center leading-tight">
                {member.name}
              </span>
            </div>
          ))}
      </div>
    </div>

    {/* Digital Partner & Organizing Committee */}
    <div className="flex flex-col items-center md:items-start md:flex-row justify-center gap-24">
      {/* Digital Partner */}
      <div className="flex flex-col items-center ">
        <SectionHeader
          primaryText="Digital"
          secondaryText="partener"
          className="mb-12"
        />
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center w-40 h-32 mb-2">
            {/* Circle background */}
            <span className="absolute left-1/2 -translate-x-1/2 top-2 w-32 h-32 rounded-full bg-[#B5E2DD] z-0" />
            {/* Image is taller and shifted up so the head is above the circle */}
            <Image
              src={committee[3].image}
              alt={committee[3].name}
              width={120}
              height={180}
              className="w-34 h-44 object-cover z-10 relative -top-4"
            />
          </div>
          <span className="text-primary font-bold text-sm text-center leading-tight">
            {committee[3].name}
          </span>
        </div>

        <Image
          src="/icons/eptech.png"
          alt="EPTECH"
          width={90}
          height={24}
          className="mt-4"
        />
      </div>
      {/* Organizing Committee Lead */}
      <div className="flex flex-col items-center ">
        <SectionHeader
          primaryText="Organizing Committee"
          secondaryText="Lead"
          className="mb-12"
        />
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center w-40 h-32 mb-2">
            {/* Circle background */}
            <span className="absolute left-1/2 -translate-x-1/2 top-2 w-32 h-32 rounded-full bg-[#B5E2DD] z-0" />
            {/* Image is taller and shifted up so the head is above the circle */}
            <Image
              src={committee[4].image}
              alt={committee[4].name}
              width={120}
              height={180}
              className="w-34 h-44 object-cover z-10 relative -top-4"
            />
          </div>
          <span className="text-primary font-bold text-sm text-center leading-tight">
            {committee[4].name}
          </span>
        </div>
      </div>
    </div>
  </section>
);

export default CommitteeSection;
