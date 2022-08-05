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
        reverse ? "flex-row-reverse flex gap-5" : "gap-5 flex flex-row"
      }
    >
      <div className="flex items-center justify-between flex-1">
        <div
          className={
            reverse ? "ml-[86px] w-full" : "mr-[86px] w-full text-left"
          }
        >
          <div className="text-[16px] mb-3">{title}</div>
          <div className="text-[36px] mb-3 font-medium ">{description}</div>
          <a href={link} className="text-[#FF7D00]">
            {linkText} <img src="arrow.svg" className="inline ml-2" />
          </a>
        </div>
      </div>
      <div className="flex-1 aspect-[1.7] relative">
        <Image src={image} layout="fill" objectFit="cover" />
      </div>
    </div>
  );
}

export default LandingInfo;
