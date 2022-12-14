import { Transition, Dialog, Combobox, Switch } from "@headlessui/react";
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
  gender: boolean;
  isReturnedMissionary: boolean;
  firstTopicChoice: string;
  secondTopicChoice: string;
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

    gender: z.boolean(),
    firstTopicChoice: z.string().nullable().optional(),
    secondTopicChoice: z.string().nullable().optional(),
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
      notes: " ",
      gender: true,
      firstTopicChoice: "",
      secondTopicChoice: "",
    },
  });
  const stake = watch("stake");
  const area = watch("area");
  const isMember = watch("isMember");
  const [step, setStep] = useState(0);
  function closeModal() {
    onClose();
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
    try {
      const token = await executeRecaptcha("enquiryFormSubmit");
      console.log(data);
      const response = await mutateAsync({
        captchaToken: token,
        ...data,
        wardId: data.ward,
        gender: data.gender ? "Masculino" : "Femenino",
        birthDate: new Date(data.birthDate + "T00:00"),
        phoneNumber: parseInt(data.phone),
        theme1: data.firstTopicChoice,
        theme2: data.secondTopicChoice,
      });
      if (response?.id) {
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
    } catch (error: any) {
      if (error?.code === -32603) {
        console.dir(error);
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
              className={`bg-red-400 max-w-md w-full font-normal px-6 py-4 shadow-md rounded-xl `}
            >
              <div className="text-black mb-2 font-black">Error</div>
              {error?.message}
            </div>
          </Transition.Child>
        </Transition>
      ));
    }
  });
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
              <div className="flex flex-col gap-4 justify-center pb-[6px]">
                <Controller
                  name="isMember"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Switch.Group>
                      <div className="flex flex-col gap-4 text-sm">
                        <Switch.Label className="mr-4">
                          Eres Miembro
                        </Switch.Label>
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                          className={`${
                            field.value ? "bg-orange-600" : "bg-gray-200"
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              field.value ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </Switch>
                      </div>
                    </Switch.Group>
                  )}
                />
                <div className="flex-1 flex items-end ">
                  {!isMember && (
                    <Input
                      label="Quien te invito"
                      placeholder="Nombre de la persona"
                      {...register("invitedBy", { required: true })}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>Genero</label>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <ButtonSelect
                      leftButtonText="Masculino"
                      rightButtonText="Femenino"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
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
              <Controller
                name="profesion"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    error={errors.stake?.message}
                    ref={field.ref}
                    placeholder="Selecciona formacion"
                    label="Formacion acad??mica"
                    options={
                      [
                        "Bachiller",
                        "Tecnico Medio",
                        "Tecnico Superior",
                        "Licenciatura",
                        "Postgrado",
                      ].map((p) => ({
                        id: p,
                        label: p,
                      })) || []
                    }
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="studies"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    error={errors.stake?.message}
                    ref={field.ref}
                    placeholder="A que te dedicas"
                    label="Actualmente a que te dedicas"
                    options={
                      [
                        "Estudio",
                        "Trabajo",
                        "Estudio y trabajo",
                        "Ninguna de las anteriores",
                      ].map((p) => ({
                        id: p,
                        label: p,
                      })) || []
                    }
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {isMember && (
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
              )}
              <div className="md:col-span-2">
                <Controller
                  name="firstTopicChoice"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <Select
                      error={errors.stake?.message}
                      ref={field.ref}
                      placeholder="Selecciona el primer tema"
                      label="Que tema te gustaria que toquemos en la convencion"
                      options={
                        [
                          "Podemos escoger enamorarnos?",
                          "Soy un agente o un objeto en mi noviazgo?",
                          "Existe la persona ideal?",
                          "Como fortalecer mi noviazgo",
                          "Como superar a un ex",
                          "Fantasia vs Realidad",
                        ].map((p) => ({
                          id: p,
                          label: p,
                        })) || []
                      }
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="md:col-span-2">
                <Controller
                  name="secondTopicChoice"
                  rules={{ required: false }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      error={errors.stake?.message}
                      ref={field.ref}
                      placeholder="Selecciona el segundo tema"
                      label="Que tema te gustaria que toquemos en la convencion"
                      options={
                        [
                          "??C??mo saber si mi testimonio es suficientemente para la misi??n?",
                          "??Estoy preparado emocionalmente para la misi??n?",
                          "??Debo terminar con mi novia si voy a la misi??n?",
                          "Experiencia contada Vs Experiencia vivida",
                        ].map((p) => ({
                          id: p,
                          label: p,
                        })) || []
                      }
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
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
