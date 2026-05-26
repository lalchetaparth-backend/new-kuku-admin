import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import useDocumentTitle from "../hooks/useDocumentTitle";

const exportToolbar = {
  type: "buttons",
  className: "btn-group me-2",
  items: [
    {
      label: "Export PDF",
      iconClass: "bi bi-filetype-pdf me-1",
      buttonClass: "btn btn-sm btn-outline-secondary",
    },
    {
      label: "Export CSV",
      iconClass: "bi bi-file-spreadsheet me-1",
      buttonClass: "btn btn-sm btn-outline-secondary",
    },
  ],
};

const statusToolbar = {
  type: "dropdown",
  className: "btn-group me-2",
  buttonClass: "btn btn-primary dropdown-toggle",
  iconClass: "bi bi-hourglass-split",
  label: "Select Status",
  items: [{ label: "Active" }, { label: "Hold" }],
};

function MarqueePage() {
  useDocumentTitle("Marquee Page - Kuku Foods");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <PageHeader title="Add Marquee" toolbarGroups={[exportToolbar, statusToolbar]} />

      <div className="add-marquee border-bottom mb-3">
        <h5>Add Marquee</h5>
        <form action="" onSubmit={handleSubmit}>
          <div className="row g-2">
            <div className="col-md-5">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add Marquee"
                  aria-label="add marquee"
                />
              </div>
            </div>

            <div className="col-md-3">
              <div className="mb-3">
                <input type="submit" className="btn btn-dark" value="Add Marquee" />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="table-responsive small">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Marquee</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Kachori</td>
              <td>
                <a
                  href="#"
                  className="delete-link"
                  onClick={(event) => event.preventDefault()}
                >
                  <i className="bi bi-trash" />
                  <span>Delete</span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination />
    </>
  );
}

export default MarqueePage;
