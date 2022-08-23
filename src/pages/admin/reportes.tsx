import React, { ReactElement } from "react";
import AdminLayout from "../../components/AdminLayout";

function Reportes() {
  return <div>Reportes</div>;
}

Reportes.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default Reportes;
