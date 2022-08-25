import { NextApiRequest, NextApiResponse } from "next";
import ExcelJS from "exceljs";
import { prisma } from "../../server/db/client";
const mapToYesOrNo = (v: boolean) => (v ? "Si" : "No");
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const workbook = new ExcelJS.Workbook();
  const jas = await prisma.jAS.findMany({
    include: { ward: { include: { stake: { include: { area: true } } } } },
  });
  if (!jas.length) {
    return res.json({ resultado: "Todavia no hay inscritos" });
  }

  const ws = workbook.addWorksheet("Inscritos");
  ws.addTable({
    name: "Inscritos",
    ref: "A1",
    headerRow: true,
    columns: [
      { name: "Nombres", filterButton: true },
      { name: "Apellidos", filterButton: false },
      { name: "Barrio", filterButton: true },
      { name: "Estaca", filterButton: true },
      { name: "Area", filterButton: true },
      { name: "Edad", filterButton: false },
      { name: "Genero", filterButton: false },
      { name: "Telefono", filterButton: false },
      { name: "Correo Electronico", filterButton: false },
      { name: "Fecha de Nacimiento", filterButton: false },
      { name: "Es Miembro", filterButton: false },
      { name: "Es Retornado", filterButton: false },
      { name: "Formacion", filterButton: false },
      { name: "A que te dedicas", filterButton: false },
      { name: "Tema TedX 1", filterButton: false },
      { name: "Tema TedX 2", filterButton: false },
      { name: "Quien te invito", filterButton: false },
      { name: "Informacion Adicional", filterButton: false },
    ],
    rows: jas.map((j) => [
      j.firstName,
      j.lastName,
      j.ward.name,
      j.ward.stake.name,
      j.ward.stake.area.name,
      j.age,
      j.gender,
      j.phoneNumber,
      j.email,
      j.birthDate,
      mapToYesOrNo(j.isLDSMember),
      mapToYesOrNo(j.isReturnedMissionary),
      j.profesion,
      j.studies,
      j.theme1,
      j.theme2,
      j.invitedBy,
      j.notes,
    ]),
  });
  const buffer = await workbook.xlsx.writeBuffer();

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Inscritos JAS SANO 2022 - ${new Date().getHours()}:${new Date().getMinutes()}.xlsx`
  );
  res.send(buffer);
};
