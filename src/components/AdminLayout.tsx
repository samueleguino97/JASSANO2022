import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
const Links = [
  { to: "/admin/reportes", label: "Reportes" },
  { to: "/admin/inscritos", label: "Inscritos" },
  { to: "/admin/areas", label: "Areas" },
  { to: "/admin/estacas", label: "Estacas" },
  { to: "/admin/barrios", label: "Barrios" },
];
function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const currentRoute = router.pathname;
  return (
    <div className="h-screen p-6 w-full grid gap-4 grid-cols-[200px_1fr]">
      <div className="rounded-xl shadow-lg p-4">
        <div className="flex w-full justify-center">
          <div className='text-black h-full text-center font-["Nunito",_sans-serif] text-[10px] md:text-[16px]'>
            <div className="flex font-black">
              <span className="text-[#FF7D00] mr-2">JAS</span> 2022
            </div>
            <span className="text-[#FF7D00] text-[7px] font-black text-xs">
              Santa Cruz
            </span>
          </div>
        </div>
        {Links.map((link) => (
          <Link
            key={link.to}
            style={{ width: "100%", height: "100%" }}
            href={link.to}
          >
            <a
              className={`${
                currentRoute === link.to ? "text-orange-500" : "text-gray-300"
              } bg-white cursor-pointer hover:opacity-50 transition-all font-bold  py-1 flex items-center px-2 rounded-lg my-2`}
            >
              {link.label}
            </a>
          </Link>
        ))}
      </div>
      <main className="rounded-xl shadow-lg h-full overflow-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
