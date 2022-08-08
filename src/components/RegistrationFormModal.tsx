import { Transition, Dialog, Combobox } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import Input from "./Input";
import TextArea from "./TextArea";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "./Select";
import { trpc } from "../utils/trpc";
import ButtonSelect from "./ButtonSelect";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import toast from "react-hot-toast";
export type FormData = {
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  ward: string;
  stake: string;
  invitedBy: string;
  area: string;
  notes: string;
  isMember: boolean;
  profesion: string;
  studies: string;
  isReturnedMissionary: boolean;
};

const schema = z
  .object({
    firstName: z.string().min(1, "El nombre es obligatorio"),
    lastName: z.string().min(1, "El apellido es obligatorio"),
    birthDate: z.string().min(1, "La fecha de nacimiento es obligatoria"),
    phone: z
      .string()
      .min(6, "El formato del telefono es incorrecto")
      .max(10, "El formato del telefono es incorrecto"),
    email: z
      .string()
      .min(1, "El correo es obligatorio")
      .email("El correo tiene un formato incorrecto"),
    ward: z.string().min(1, "El barrio es obligatoria"),
    stake: z.string().min(1, "La estaca es obligatoria"),
    invitedBy: z.string(),
    notes: z.string(),
    isMember: z.boolean(),
    profesion: z.string().optional(),
    studies: z.string().optional(),
    isReturnedMissionary: z.boolean(),
  })
  .required();
function RegistrationFormModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    reValidateMode: "onChange",
    defaultValues: {
      isReturnedMissionary: false,
      isMember: false,
      profesion: "",
      studies: "",
    },
  });
  const stake = watch("stake");
  const area = watch("area");
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [step, setStep] = useState(0);
  function closeModal() {
    onClose();
    setIsMember(null);
    setStep(0);
    reset();
  }
  const { executeRecaptcha } = useGoogleReCaptcha();

  const { data: areaData, isFetching: isFetchingArea } = trpc.useQuery([
    "stakes.areas",
  ]);
  const { data: stakesData, isFetching: isFetchingStakes } = trpc.useQuery([
    "stakes.stakes",
  ]);
  const { data: wardData, isFetching: isFetchingWard } = trpc.useQuery([
    "stakes.wards",
  ]);
  const { mutateAsync } = trpc.useMutation("jas.enroll");

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }
    toast.custom((t) => (
      <Transition appear show={t.visible} as={Fragment}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={`bg-gray-200 max-w-md w-full px-6 py-4 shadow-md rounded-xl `}
          >
            <div className="text-black mb-2 font-bold">Subiendo formulario</div>
          </div>
        </Transition.Child>
      </Transition>
    ));
    const token = await executeRecaptcha("enquiryFormSubmit");
    const response = await mutateAsync({
      captchaToken: token,
      ...data,
      wardId: data.ward,
      birthDate: new Date(data.birthDate + "T00:00"),
      phoneNumber: parseInt(data.phone),
    });
    if (response.id) {
      console.log("creation successful");
      reset();
      toast.custom((t) => (
        <Transition appear show={t.visible} as={Fragment}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={`bg-orange-400 max-w-md w-full px-6 py-4 shadow-md rounded-xl `}
            >
              <div className="text-white mb-2 font-bold">
                Registro exitoso! :)
              </div>
            </div>
          </Transition.Child>
        </Transition>
      ));
      closeModal();
    }
  });
  console.log(stake);
  const onSubmitFirst = handleSubmit(
    async (data) => {
      setStep((s) => s + 1);
    },
    (errors) => {
      console.log(errors);
      return;
    }
  );

  function renderStep() {
    if (step === 0)
      return (
        <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Formulario de inscripcion Convencion JAS 2022
          </Dialog.Title>
          <form
            onSubmit={onSubmitFirst}
            className="w-full flex flex-col mt-6  gap-6"
          >
            <div className="grid gap-3 md:gap-6 grid-cols-1 md:grid-cols-3">
              <Input
                error={errors.firstName?.message}
                label="Nombre(s)"
                placeholder="Ingresa tu nombre aqui"
                {...register("firstName", { required: true })}
              />
              <Input
                error={errors.lastName?.message}
                label="Apellido(s)"
                placeholder="Ingresa tu apellido aqui"
                {...register("lastName", { required: true })}
              />
              <Input
                error={errors.birthDate?.message}
                type="date"
                label="Fecha de nacimiento"
                placeholder="Fecha de nacimiento aqui"
                {...register("birthDate", { required: true })}
              />
              <Input
                error={errors.phone?.message}
                label="Telefono/Celular"
                placeholder="Tu numero de telefono"
                {...register("phone", { required: true })}
              />
              <div className="md:col-span-2">
                <Input
                  error={errors.email?.message}
                  label="Correo electronico"
                  placeholder="Tu correo electronico"
                  {...register("email", { required: true })}
                />
              </div>
              <Controller
                name="area"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    error={errors.area?.message}
                    ref={field.ref}
                    placeholder="Selecciona Mision o Area"
                    label="Mision/Area"
                    options={
                      areaData?.map((p) => ({
                        id: p.id,
                        label: p.name,
                      })) || []
                    }
                    value={field.value}
                    onChange={(v) => {
                      field.onChange(v);
                      setValue("ward", "");
                      setValue("stake", "");
                    }}
                  />
                )}
              />

              <Controller
                name="stake"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    error={errors.stake?.message}
                    ref={field.ref}
                    placeholder="Selecciona Estaca o Distrito"
                    label="Estaca/Distrito"
                    options={
                      stakesData
                        ?.filter((w) => (area ? w.areaId === area : true))
                        .map((p) => ({
                          id: p.id,
                          label: p.name,
                        })) || []
                    }
                    value={field.value}
                    onChange={(v) => {
                      field.onChange(v);
                      setValue("ward", "");
                      setValue(
                        "area",
                        stakesData?.find((s) => s.id === v)?.areaId || ""
                      );
                    }}
                  />
                )}
              />
              <Controller
                name="ward"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    error={errors.ward?.message}
                    ref={field.ref}
                    placeholder="Selecciona Barrio o Rama"
                    label="Barrio/Rama"
                    options={
                      wardData
                        ?.filter((w) =>
                          stake
                            ? w.stakeId === stake
                            : area
                            ? w.stake.areaId === area
                            : true
                        )
                        .map((p) => ({
                          id: p.id,
                          label: p.name,
                        })) || []
                    }
                    value={field.value}
                    onChange={(v) => {
                      field.onChange(v);
                      setValue(
                        "stake",
                        wardData?.find((w) => w.id === v)?.stakeId || ""
                      );
                      setValue(
                        "area",
                        wardData?.find((w) => w.id === v)?.stake.areaId || ""
                      );
                    }}
                  />
                )}
              />

              <Input
                label="Quien te invito"
                placeholder="Nombre de la persona"
                {...register("invitedBy", { required: true })}
              />
              <div className="md:col-span-2">
                <TextArea
                  style={{
                    height: 150,
                    paddingTop: 12,
                    resize: "none",
                  }}
                  label="Informacion Adicional"
                  placeholder="Alergias, necesidades especiales, cualquier detalle que necesitemos saber."
                  {...register("notes", { required: true })}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-end md:mt-4 items-center ">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex md:mr-4 w-full justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              >
                Cancelar
              </button>{" "}
              <button
                type="submit"
                className="inline-flex mt-2 w-full md:mt-0 justify-center rounded-md border border-transparent bg-orange-500  px-8 py-2 text-sm font-medium text-black hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                Siguiente
              </button>
            </div>
          </form>
        </Dialog.Panel>
      );
    if (step === 1)
      return (
        <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Informacion Adicional
          </Dialog.Title>
          <form onSubmit={onSubmit}>
            <div className="mt-2 grid grid-cols-1  gap-5">
              <Input
                {...register("profesion", { required: false })}
                label="Cual es tu profesion?/ A que te dedicas?"
                placeholder="Ingresia tu profesion"
              />
              <Input
                {...register("studies", { required: false })}
                label="Que estas estudiando actualmente?"
                placeholder="ingresa tus Estudios"
              />

              <div className="flex flex-col gap-2">
                <label>
                  Eres miembro de la Iglesia de Jesucristo de los Santos de los
                  Ultimos Dias?
                </label>
                <Controller
                  name="isMember"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <ButtonSelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Eres misionero retornado?</label>
                <Controller
                  name="isReturnedMissionary"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <ButtonSelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>{" "}
            <div className="flex flex-col mt-6 justify-end items-center ">
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className=" w-full inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              >
                Regresar a formulario
              </button>{" "}
              <button
                disabled={!executeRecaptcha || isSubmitting}
                type="submit"
                className="w-full mt-2 inline-flex justify-center rounded-md border border-transparent bg-orange-500 px-8 py-2 text-sm font-medium text-black hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                Registrarme
              </button>
            </div>
          </form>
        </Dialog.Panel>
      );
  }
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-25 "
            onClick={closeModal}
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 md:p-4 text-center">
            <Transition.Child
              as={"div"}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {renderStep()}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default RegistrationFormModal;
