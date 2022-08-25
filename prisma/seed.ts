import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function seedDb() {
  const santaCruzId = randomUUID();
  const santaCruzNorthId = randomUUID();
  console.log("creating areas");

  await prisma.area.createMany({
    data: [
      {
        name: "Santa Cruz Norte",
        slug: "Bolivia Santa Cruz North",
        id: santaCruzNorthId,
      },
      { name: "Santa Cruz", slug: "Bolivia Santa Cruz", id: santaCruzId },
    ],
  });
  const stakes = {
    [santaCruzId]: [
      { name: "Bermejo", slug: "Bermejo Bolivia District" },
      { name: "Mision Santa Cruz", slug: "Mision Bolivia Santa Cruz" },
      { name: "Abundancia", slug: "Santa Cruz Bolivia Abundancia Stake" },
      { name: "Central", slug: "Santa Cruz Bolivia Central Stake" },
      { name: "La Colorada", slug: "Santa Cruz Bolivia La Colorada Stake" },
      { name: "La Libertad", slug: "Santa Cruz Bolivia La Libertad Stake" },
      { name: "La Merced", slug: "Santa Cruz Bolivia La Merced Stake" },
      { name: "Tarija", slug: "Tarija Bolivia Stake" },
      { name: "Tabladita", slug: "Tarija Bolivia Tabladita Stake" },
      { name: "Yacuiba", slug: "Yacuiba Bolivia District" },
    ],
    [santaCruzNorthId]: [
      {
        name: "Consejo de Coordinacion",
        slug: "Consejo de Coordinacion Bolivia Santa Cruz Norte",
      },
      { name: "Guayaramerin", slug: "Guayaramerin Bolivia District" },
      { name: "Montero", slug: "Montero Bolivia Stake" },
      { name: "Riberalta", slug: "Riberalta Bolivia District" },
      { name: "El Bajio", slug: "Santa Cruz Bolivia El Bajio Stake" },
      { name: "Equipetrol", slug: "Santa Cruz Bolivia Equipetrol Stake" },
      { name: "La Pampa", slug: "Santa Cruz Bolivia La Pampa Stake" },
      { name: "Paraiso", slug: "Santa Cruz Bolivia Paraiso Stake" },
      { name: "Viru Viru", slug: "Santa Cruz Bolivia Viru Viru Stake" },
      { name: "Trinidad", slug: "Trinidad Bolivia Stake" },
    ],
  };
  console.log("Creating stakes ");
  await prisma.stake.createMany({
    data:
      stakes[santaCruzId]?.map((s) => ({ ...s, areaId: santaCruzId })) || [],
  });
  console.log("Creating north stakes");
  await prisma.stake.createMany({
    data:
      stakes[santaCruzNorthId]?.map((s) => ({
        ...s,
        areaId: santaCruzNorthId,
      })) || [],
  });
  const sWards = {
    "Santa Cruz Bolivia La Colorada Stake": {
      "El Fuerte Ward": "El Fuerte",
      "Guaracal Ward": "Guaracal",
      "Jardin del Sur Ward": "Jardin del Sur",
      "La Colorada Ward": "La Colorada",
      "Los Olivos Ward": "Los Olivos",
      "Roca y Coronado Ward": "Roca y Coronado",
    },
    "Santa Cruz Bolivia La Libertad Stake": {
      //   "Dieciseis de Julio Ward": "16 de Julio",
      //   "La Canada Ward": "La Canada",
      //   "La Libertad Ward": "La Libertad",
      //   "Plan Tres Mil Ward": "Plan 3000",
      //   "Primero de Mayo Ward": "Primero de Mayo - La Libertad",
      //   "Quince de Septiembre Ward": "Quince de Septiembre",
    },
    "Santa Cruz Bolivia La Merced Stake": {
      "Cupesi Ward": "Cupesi",
      "El Quior Ward": "El Quior",
      "La Merced Ward": "La Merced",
      "Nuevo Mundo Ward": "Nuevo Mundo",
      "Suarez Ward": "Suarez",
    },
    "Tarija Bolivia Stake": {
      "Aeropuerto Ward": "Aeropuert",
      "Alianza Branch": "Alianza",
      "Jardin Branch": "Jardin",
      "Paraiso Ward": "Paraiso",
      "Progreso Ward": "Progreso",
      "Rosedal Ward": "Roselal",
      "San Bernardo Ward": "San Bernardo",
      "Tarija Ward": "Tarija",
      "Valle Hermoso Ward": "Valle Hermoso",
    },
    "Tarija Bolivia Tabladita Stake": {
      "Central Ward": "Central",
      "Cuatro de Julio Ward": "4 de Julio",
      "Guadalquivir Ward": "Guadalquivir",
      "Libertad Ward": "Libertad",
      "Panamericano Ward": "Panamericano",
      "Senac Ward": "Senac",
      "Tabladita Ward": "Tabladita",
    },
    "Yacuiba Bolivia District": {
      "El Carmen Branch": "El Carmen",
      "El Jardin Branch": "El Jardin",
      "Villamontes Branch": "Villamontes",
      "Yacuiba Branch": "Yacuiba",
    },
    "Bermejo Bolivia District": {
      "Bolivar Branch": "Bolivar",
      "Miraflores Branch": "Miraflores",
      "Primero de Mayo Branch": "Primero de Mayo",
      "Quince de Abril Branch": "Quince de Abril",
    },
    "Mision Bolivia Santa Cruz": {
      "Rama Camiri": "Camiri",
      "Rama Puerto Quijarro": "Puerto Quijarro",
      "Rama Puerto Suarez": "Puerto Suarez",
    },
    "Santa Cruz Bolivia Abundancia Stake": {
      "Abundancia Ward": "Abundancia",
      "Cortez Ward": "Cortez",
      "El Palmar Ward": "El Palmar",
      "Fortaleza Ward": "Fortaleza",
      "Las Americas Ward": "Las Americas",
      "Las Misiones Ward": "Las Misiones",
    },
    "Santa Cruz Bolivia Central Stake": {
      "Antofagasta Ward": "Antofagasta",
      "Canoto Ward": "Canoto",
      "Piray Ward": "Piray",
      "San Pedro Ward": "San Pedro",
      "Trompillo Ward": "Trompillo",
    },
  };

  const nWards = {
    "Consejo de Coordinacion Bolivia Santa Cruz Norte": {
      "Rama Vallegrande": "Vallegrande",
    },
    "Guayaramerin Bolivia District": {
      "Guayaramerin Branch": "Guayaramerin",
      "Las Arenas Branch": "Las Arenas",
      "Mamore Branch": "Mamore",
    },
    "Montero Bolivia Stake": {
      "Estadium Ward": "Estadium",
      "Floresta Ward": "Floresta",
      "Guabira Ward": "Guabira",
      "Mineros Ward": "Mineros",
      "Montero Estacion Ward": "Montero Estacion",
      "Montero Villa Verde Ward": "Montero Villa Verde",
      "Pampa La Madre Branch": "Pampa La Madre",
      "Yapacani Branch": "Yapacani",
    },
    "Riberalta Bolivia District": {
      "La Forestal Branch": "La Forestal",
      "Los Cerritos Branch": "Los Cerritos",
      "Los Tajibos Branch": "Los Tajibos",
      "Palmeras Branch": "Palmeras",
      "Riberalta Branch": "Riberalta",
    },
    "Santa Cruz Bolivia El Bajio Stake": {
      "Asai Ward": "Asai",
      "Campo Rosa Ward": "Campo Rosa",
      "Campo Verde Ward": "Campo Verde",
      "El Bajio Ward": "El Bajio",
      "El Carmen Ward": "El Carmen - Bajio",
      "El Jardin Ward": "El Jardin - Bajio",
      "El Torno Branch": "El Torno",
      "La Guardia Ward": "La Guardia",
      "Monte Rey Ward": "Monte Rey",
    },
    "Santa Cruz Bolivia Equipetrol Stake": {
      "Belen Ward": "Belen",
      "Centenario Ward": "Centenario",
      "Equipetrol Ward": "Equipetrol",
      "Hamacas Ward": "Hamacas",
      "Los Mangales Ward": "Los Mangales",
    },
    "Santa Cruz Bolivia La Pampa Stake": {
      "Cotoca Ward": "Cotoca",
      "El Dorado Ward": "El Dorado",
      "Guapilo Ward": "Guapilo",
      "La Pampa Ward": "La Pampa",
      "Las Piedades Ward": "Los Piedades",
      "Lucero Ward": "Lucero",
      "Samaritano Ward": "Samaritano",
    },
    "Santa Cruz Bolivia Paraiso Stake": {
      "Charcas Ward": "Charcas",
      "El Bibosi Ward": "El Bibosi",
      "El Paraiso Ward": "El Paraiso",
      "Los Angeles Ward": "Los Angeles",
      "Los Chacos Ward": "Los Chacos",
      "Los Pinos Ward": "Los Pinos",
      "Progreso Ward": "Progreso",
    },
    "Santa Cruz Bolivia Viru Viru Stake": {
      "El Remanso Ward": "El Remanso",
      "Integracion del Norte Branch": "Integracion del Norte",
      "Jenecheru Ward": "Jenecheru",
      "Pentaguazu Ward": "Pentaguazu",
      "Satelite Ward": "Satelite",
      "Universitario Ward": "Universitario",
      "Valle Sanchez Ward": "Valle Sanchez",
      "Viru Viru Ward": "Viru Viru",
      "Warnes Ward": "Warnes",
    },
    "Trinidad Bolivia Stake": {
      "Mangalitos Ward": "Mangalitos",
      "Moxos Branch": "Moxos",
      "Paititi Ward": "Paititi",
      "Pompeya Ward": "Pompeya",
      "Trinidad Ward": "Trinidad",
      "Villa Corina Ward": "Villa Corina",
    },
  };
  console.log("creating wards");
  const createdStakes = await prisma.stake.findMany();
  for (let i = 0; i < createdStakes.length; i++) {
    const stake = createdStakes[i];

    const key = stake?.slug as keyof typeof nWards & keyof typeof sWards;
    const wardsObj = { ...nWards, ...sWards };
    if (!wardsObj[key]) {
      continue;
    }
    const wards = Object.keys(wardsObj[key]).map((w: any) => ({
      slug: w,
      name: (wardsObj[key] as any)[w],
      stakeId: stake?.id!,
    }));
    console.log("Creating wards for:", stake?.name);
    try {
      for (let j = 0; j < wards.length; j++) {
        const ward = wards[j]!;
        await prisma.ward.upsert({
          create: ward,
          update: ward,
          where: { slug: ward.slug },
        });
      }
    } catch (error) {
      console.log(error);
      //   return;
    }
  }
}
seedDb();
