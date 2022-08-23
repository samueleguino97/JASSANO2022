import { Area, JAS, Stake, Ward } from "@prisma/client";
import {
  ColumnDef,
  ColumnFiltersState,
  createColumnHelper,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { ReactElement, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import Select from "../../components/Select";
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
    header: (jas) => <span>Retornado</span>,
  }),
  columnHelper.accessor("ward", {
    cell: (jas) => <span>{jas.getValue()?.name}</span>,
    header: (jas) => <span>Barrio</span>,
    enableColumnFilter: true,
    filterFn: "testFilter",
  }),
  columnHelper.accessor("ward.stake", {
    cell: (jas) => <span>{jas.getValue()?.name}</span>,
    header: (jas) => <span>Estaca</span>,
    filterFn: "includesString",
  }),
  columnHelper.accessor("ward.stake.area", {
    cell: (jas) => <span>{jas.getValue()?.name}</span>,
    header: (jas) => <span>Area</span>,
  }),
];
const testFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Return if the item should be filtered in/out
  return (row.getValue(columnId) as any)?.slug === value;
};
function Inscritos() {
  const { data } = trpc.useQuery(["jas.all"]);
  const { data: wardData } = trpc.useQuery(["stakes.wards"]);
  const { data: stakeData } = trpc.useQuery(["stakes.stakes"]);
  const { data: areasData } = trpc.useQuery(["stakes.areas"]);
  const [wardFilter, setWardFilter] = useState("");
  const [stakeFilter, setStakeFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnFilters },
    filterFns: {
      testFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    enableFilters: true,
  });
  return (
    <div className="p-4 w-full">
      <h1 className="text-xl font-bold">Inscritos</h1>
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Select
            label="Por Barrio"
            onChange={(nv) => {
              table.setColumnFilters([{ id: "ward", value: nv }]);
              setWardFilter(nv);
            }}
            value={wardFilter}
            options={
              wardData?.map((w) => ({ id: w.slug, label: w.name })) || []
            }
            placeholder="Selecciona barrio"
          />
          <Select
            label="Por Estaca"
            onChange={() => {}}
            value={""}
            options={stakeData?.map((w) => ({ id: w.id, label: w.name })) || []}
            placeholder="Selecciona estaca"
          />{" "}
          <Select
            label="Por Area"
            onChange={() => {}}
            value={""}
            options={areasData?.map((w) => ({ id: w.id, label: w.name })) || []}
            placeholder="Selecciona Area"
          />
        </div>
        <div>Exportar a Excel</div>
      </div>
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
            {table?.getRowModel()?.rows?.map((row) => (
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

Inscritos.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Inscritos;
