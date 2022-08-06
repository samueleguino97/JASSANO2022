import Image from "next/image";
import React from "react";

function LandingInfo({
  image,
  reverse,
  description,
  link,
  linkText,
  title,
}: {
  image: any;
  reverse?: boolean;
  title: string;
  description: string;
  link: string;
  linkText: string;
}) {
  return (
    <div
      className={
        reverse
          ? " flex-col-reverse md:flex-row-reverse flex gap-2 md:gap-5"
          : " gap-2 md:gap-5 flex flex-col-reverse md:flex-row"
      }
    >
      <div className="flex items-center justify-between flex-1">
        <div
          className={
            reverse ? "md:ml-[86px] w-full" : "md:mr-[86px] w-full text-left"
          }
        >
          <div className="hidden md:block text-[16px] mb-3">{title}</div>
          <div className=" text-[24px] md:text-[36px] mb-1 md:mb-3 font-bold ">
            {description}
          </div>
          <a href={link} className="text-[#FF7D00]">
            {linkText} <img src="arrow.svg" className="inline ml-2" />
          </a>
        </div>
      </div>
      <div className="flex-1 aspect-[1.7] relative">
        <Image src={image} layout="fill" objectFit="cover" />
      </div>
      <div className="md:hidden block text-[16px] ">{title}</div>
    </div>
  );
}

export default LandingInfo;
