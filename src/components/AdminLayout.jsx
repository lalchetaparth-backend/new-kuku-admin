import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import SvgSprite from "./SvgSprite";

function AdminLayout() {
  return (
    <>
      <SvgSprite />
      <Header />
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default AdminLayout;
