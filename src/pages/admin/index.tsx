import React, { ReactElement } from "react";
import AdminLayout from "../../components/AdminLayout";

function Admin() {
  return <div className="">Admin</div>;
}
Admin.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Admin;
