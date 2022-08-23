import React, { ReactElement } from "react";
import AdminLayout from "../../components/AdminLayout";

function estacas() {
  return <div>estacas</div>;
}
estacas.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default estacas;
