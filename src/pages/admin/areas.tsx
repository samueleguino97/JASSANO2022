import React, { ReactElement } from "react";
import AdminLayout from "../../components/AdminLayout";

function Areas() {
  return <div>Areas</div>;
}
Areas.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default Areas;
