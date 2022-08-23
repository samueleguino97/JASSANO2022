import { Area, JAS, Stake, Ward } from ".prisma/client";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { ReactElement } from "react";
import AdminLayout from "../../components/AdminLayout";
import { trpc } from "../../utils/trpc";

const columnHelper = createColumnHelper<
  JAS & {
    ward: Ward & {
      stake: Stake & {
        area: Area;
      };
    };
  }
>();
const columns: ColumnDef<
  JAS & {
    ward: Ward & {
      stake: Stake & {
        area: Area;
      };
    };
  },
  any
>[] = [
  columnHelper.accessor("firstName", {
    cell: (jas) => <span>{jas.getValue()}</span>,
    header: (jas) => <span>Nombre</span>,
  }),
  columnHelper.accessor("lastName", {
    cell: (jas) => <span>{jas.getValue()}</span>,
    header: (jas) => <span>Apellido</span>,
  }),
  columnHelper.accessor("email", {
    cell: (jas) => <span>{jas.getValue()}</span>,
    header: (jas) => <span>Correo</span>,
  }),
  columnHelper.accessor("phoneNumber", {
    cell: (jas) => <span>{jas.getValue()}</span>,
    header: (jas) => <span>Telefono</span>,
  }),
  columnHelper.accessor("isLDSMember", {
    cell: (jas) => <span>{jas.getValue() ? "Si" : "No"}</span>,
    header: (jas) => <span>Miembro</span>,
  }),
  columnHelper.accessor("isReturnedMissionary", {
    cell: (jas) => <span>{jas.getValue() ? "Si" : "No"}</span>,
    header: (jas) => <span>Misionero Retornado</span>,
  }),
  columnHelper.accessor("ward", {
    cell: (jas) => <span>{jas.getValue()?.name}</span>,
    header: (jas) => <span>Barrio</span>,
  }),
  columnHelper.accessor("ward.stake", {
    cell: (jas) => <span>{jas.getValue()?.name}</span>,
    header: (jas) => <span>Estaca</span>,
  }),
  columnHelper.accessor("ward.stake.area", {
    cell: (jas) => <span>{jas.getValue()?.name}</span>,
    header: (jas) => <span>Area</span>,
  }),
];
function barrios() {
  const { data } = trpc.useQuery(["jas.all"]);
  const { data: wardData } = trpc.useQuery(["stakes.wards"]);
  const table = useReactTable({
    columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div>
      <h1 className="text-xl font-bold">Inscritos</h1>
      <div className=" overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 mt-4">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className="px-3 py-4 whitespace-nowrap" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </div>
  );
}
barrios.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default barrios;
