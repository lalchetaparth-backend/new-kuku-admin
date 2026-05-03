import { NavLink, useNavigate } from "react-router-dom";
import { navSections } from "../data/shared";
import { clearAdminSession } from "../services/auth";
import Icon from "./Icon";

function closeMobileSidebar() {
  if (window.innerWidth >= 768) {
    return;
  }

  const sidebarElement = document.getElementById("sidebarMenu");

  if (!sidebarElement || !window.bootstrap?.Offcanvas) {
    return;
  }

  const sidebar =
    window.bootstrap.Offcanvas.getInstance(sidebarElement) ||
    new window.bootstrap.Offcanvas(sidebarElement);

  sidebar.hide();
}

function renderLabel(item) {
  return (
    <>
      {item.labelLines.map((line, index) => (
        <span key={`${item.path}-${line}`}>
          {line}
          {index < item.labelLines.length - 1 ? <br /> : null}
        </span>
      ))}
      {item.showDot ? (
        <sup>
          <i className="bi bi-circle-fill text-danger" />
        </sup>
      ) : null}
    </>
  );
}

function Sidebar() {
  const navigate = useNavigate();

  const handleSignOut = (event) => {
    event.preventDefault();
    clearAdminSession();
    closeMobileSidebar();
    navigate("/", { replace: true });
  };

  return (
    <div className="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
      <div
        className="offcanvas-md offcanvas-end bg-body-tertiary"
        tabIndex="-1"
        id="sidebarMenu"
        aria-labelledby="sidebarMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="sidebarMenuLabel">
            KuKu Food Products
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            data-bs-target="#sidebarMenu"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
          {navSections.map((section) => (
            <ul className="nav flex-column" key={section.heading ?? "main-section"}>
              {section.heading ? (
                <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                  <span>{section.heading}</span>
                </h6>
              ) : null}
              {section.items.map((item) => (
                <li className="nav-item" key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center gap-2 ${isActive ? "active" : ""}`
                    }
                    onClick={closeMobileSidebar}
                  >
                    <Icon symbol={item.symbol} iconClass={item.iconClass} />
                    <span>{renderLabel(item)}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          ))}

          <hr className="my-3" />
          <ul className="nav flex-column mb-auto">
            <li className="nav-item">
              <a
                className="nav-link d-flex align-items-center gap-2"
                href="#"
                onClick={handleSignOut}
              >
                <Icon symbol="door-closed" />
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
