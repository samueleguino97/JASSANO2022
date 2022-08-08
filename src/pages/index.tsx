import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Logo from "../assets/logohome.png";
import Banner from "../assets/banner.png";
import Jesus from "../assets/jesus.png";
import Book from "../assets/book.png";
import Hymns from "../assets/hymns.png";
import LandingInfo from "../components/LandingInfo";
import Face from "../assets/face.png";
import Whats from "../assets/whats.png";
import Inst from "../assets/inst.png";
import RegistrationFormModal from "../components/RegistrationFormModal";
import { useState } from "react";
const Home: NextPage = () => {
  const [registering, setRegistering] = useState(false);
  return (
    <>
      <Head>
        <title>JAS SANO 2022 - Santa Cruz</title>
        <meta
          name="description"
          content="Inscripciones para convencion jas sano 2022"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen w-full">
        <div className="relative w-full h-[250px] md:h-4/5 ">
          <div className=" md:absolute w-full">
            <header className=" pt-6 md:h-28 px-4 w-full flex container mx-auto justify-between items-center">
              <div className="flex items-center">
                <div className=" w-12 h-6 md:h-12 md:w-24 relative">
                  <Image src={Logo} objectFit="contain" layout="fill" />
                </div>
                <div className='text-white h-full text-center font-["Nunito",_sans-serif] text-[10px] md:text-[16px]'>
                  <div className="flex font-black">
                    <span className="text-[#FF7D00] mr-2">JAS</span> 2022
                  </div>
                  <div className="text-[7px] md:text-[10px]">CONVENCION</div>
                </div>
              </div>
              <div className="z-[5] flex gap-8 items-center text-white">
                <div className=" hidden  gap-8 items-center ">
                  <div>Conoce mas</div>
                  <div>Normas</div>
                  <div>Donde va a ser?</div>
                </div>
                <button
                  onClick={() => {
                    setRegistering(true);
                    console.log("sam");
                  }}
                  className="bg-[#FF7D00] cursor-pointer text-[10px] md:text-[14px] px-[24px] text-black rounded-xl py-[12px]"
                >
                  Inscribete
                </button>
              </div>
            </header>
          </div>
          <Image
            src={Banner}
            className="md:absolute object-cover z-[-1] pointer-events-none  select-none"
            layout="fill"
            objectFit="cover"
          />
          <div
            className="absolute top-0 w-full h-full  z-[-1] pb-8 flex items-end md:items-center  pointer-events-none "
            style={{
              background:
                "linear-gradient(102.7deg, #000000 0%, rgba(0, 0, 0, 0) 67.73%, rgba(0, 0, 0, 0) 100.81%)",
            }}
          >
            <div className="md:container text-white font-bold md:mx-auto manrope text-[24px] md:text-[64px] px-4 md:px-12">
              <div className="text-white md:leading-[70px]">“Mi Casa y yo</div>
              <div> Serviremos al Señor”</div>
              <div className="mt-2 md:mt-4 font-light text-sm md:text-[32px]">
                {" "}
                Josue 24:15
              </div>
            </div>
          </div>
        </div>
        <main className="container mx-auto px-4 pt-8 md:pt-16">
          <LandingInfo
            title="Tema"
            description='"Mi casa y yo serviremos al señor”'
            linkText="Servir"
            link="https://www.churchofjesuschrist.org/study/scriptures/ot/josh/24?lang=spa&id=15#p15"
            image={Jesus}
          />
          <div className=" h-8 md:h-20" />
          <LandingInfo
            title="Lema"
            description="Josue 24:15"
            linkText="Leer el lema"
            link="https://www.churchofjesuschrist.org/study/scriptures/ot/josh/24?lang=spa&id=15#p15"
            reverse
            image={Book}
          />
          <div className=" h-8 md:h-20" />
          <LandingInfo
            title="Himno"
            description="#154 Haz tu lo justo"
            linkText="Leer el himno"
            link="https://www.churchofjesuschrist.org/study/manual/hymns/do-what-is-right?lang=spa"
            image={Hymns}
          />
          {/* <div className="mt-36">
            <h2 className="font-[600] text-[36px]">Testimonios</h2>
            <div></div>
          </div> */}
        </main>
        <footer className="bg-[#E9E9E9] h-64 mt-[100px] flex justify-center items-center">
          <div>
            <div className="flex items-center gap-6 justify-center mb-5">
              <a
                target={"_blank"}
                rel="noreferrer"
                href="https://www.facebook.com/JAS.SANOSantaCruzNorte/"
              >
                <Image src={Face} />
              </a>
              <a
                target={"_blank"}
                rel="noreferrer"
                href="https://wa.link/l526th"
              >
                <Image src={Whats} />
              </a>
            </div>
            <div className="text-[20px]">Nuestras redes sociales</div>
          </div>
        </footer>

        <RegistrationFormModal
          isOpen={registering}
          onClose={() => setRegistering(false)}
        />
      </div>
    </>
  );
};
export default Home;
