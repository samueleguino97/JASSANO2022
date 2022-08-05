import Head from "next/head";
import Image from "next/image";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import Logo from "../assets/logo.png";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import { zodResolver } from "@hookform/resolvers/zod";
// @ts-check
import { z } from "zod";

export type FormData = {
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  ward: string;
  stake: string;
  invitedBy: string;
  notes: string;
};
const schema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    birthDate: z.string(),
    phone: z.string(),
    email: z.string().email().email(),
    ward: z.string(),
    stake: z.string(),
    invitedBy: z.string(),
    notes: z.string(),
  })
  .required();
function Registro() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    reValidateMode: "onChange",
  });
  console.log(errors);
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div className="w-full h-screen flex flex-col  bg-[#EBEBEB]">
      <header className="h-[80px] flex justify-center items-center bg-[#F9F9F9] w-full">
        <Image src={Logo} />
      </header>
      <main className="p-[24px] flex-1">
        <div className="max-w-3xl p-8 flex flex-col shadow-lg mx-auto  rounded-xl bg-[#F9F9F9]">
          <h1 className="font-bold text-lg">
            Formulario de inscripcion Convencion JAS 2022
          </h1>
          <div className=" mt-6 ">
            <form onSubmit={onSubmit} className="w-full flex flex-col  gap-6">
              <div className="grid gap-6 grid-cols-3">
                <Input
                  label="Nombre(s)"
                  placeholder="Ingresa tu nombre aqui"
                  {...register("firstName", { required: true })}
                />
                <Input
                  label="Apellido(s)"
                  placeholder="Ingresa tu apellido aqui"
                  {...register("lastName", { required: true })}
                />
                <Input
                  label="Fecha de nacimiento"
                  placeholder="Fecha de nacimiento aqui"
                  {...register("birthDate", { required: true })}
                />
                <Input
                  label="Telefono/Celular"
                  placeholder="Tu numero de telefono"
                  {...register("phone", { required: true })}
                />
                <div className="col-span-2">
                  <Input
                    label="Correo electronico"
                    placeholder="Tu correo electronico"
                    {...register("email", { required: true })}
                  />
                </div>
                <Input label="Barrio/Rama" />
                <Input label="Estaca/Distrito" />
                <Input label="Area/Mision" />
                <div className="col-span-2">
                  <TextArea
                    style={{ height: 150, paddingTop: 12, resize: "none" }}
                    label="Informacion Adicional"
                    placeholder="Alergias, necesidades especiales, cualquier detalle que necesitemos saber."
                    {...register("notes", { required: true })}
                  />
                </div>
                <Input
                  label="Quien te invito"
                  placeholder="Nombre de la persona"
                  {...register("invitedBy", { required: true })}
                />
              </div>
              <div className="flex justify-center items-center ">
                <button className=" disabled:opacity-40 bg-[#FF7D00] p-4 px-10 text-white rounded-xl ">
                  Registrarme
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Registro;
