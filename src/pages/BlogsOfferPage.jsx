import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import useDocumentTitle from "../hooks/useDocumentTitle";

const statusToolbar = {
  type: "dropdown",
  className: "btn-group me-2",
  buttonClass: "btn btn-primary dropdown-toggle",
  iconClass: "bi bi-hourglass-split",
  label: "Select Status",
  items: [{ label: "Active" }, { label: "Hold" }],
};

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

function BlogsOfferPage() {
  useDocumentTitle("Blog offers Page - Kuku Foods");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <PageHeader
        title="Blog Advertisement"
        toolbarGroups={[exportToolbar, statusToolbar]}
      />

      <div className="add-blog-adv border-bottom mb-3">
        <h5>Add Blogs Advertisement</h5>
        <form action="" onSubmit={handleSubmit}>
          <div className="row g-2">
            <div className="col-md-3">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Advertisement title"
                  aria-label="Advertisement title"
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  placeholder="Advertisement photo"
                  aria-label="Advertisement photo"
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <select className="form-control" defaultValue="Sweets">
                  <option value="Sweets">Sweets</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <input
                  type="submit"
                  className="btn btn-dark"
                  value="Add Advertisement"
                />
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
              <th scope="col">Image</th>
              <th scope="col">Adv Title</th>
              <th scope="col">Category</th>
              <th scope="col">Status</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <img src="/assets/images/kuku-namkeen-logo.png" width="100" alt="" />
              </td>
              <td>Kachori</td>
              <td>
                <p>Sweets</p>
              </td>
              <td>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="blogAdvSwitch1"
                    readOnly
                  />
                  <label
                    className="form-check-label badge text-bg-success"
                    htmlFor="blogAdvSwitch1"
                  >
                    Active
                  </label>
                  <label
                    className="form-check-label badge text-bg-warning"
                    htmlFor="blogAdvSwitch1"
                  >
                    Hold
                  </label>
                </div>
              </td>
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
            <tr>
              <td>2</td>
              <td>
                <img src="/assets/images/kuku-namkeen-logo.png" width="100" alt="" />
              </td>
              <td>title of image</td>
              <td>
                <p>Other</p>
              </td>
              <td>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="blogAdvSwitch2"
                    readOnly
                  />
                  <label
                    className="form-check-label badge text-bg-success"
                    htmlFor="blogAdvSwitch2"
                  >
                    Active
                  </label>
                  <label
                    className="form-check-label badge text-bg-warning"
                    htmlFor="blogAdvSwitch2"
                  >
                    Hold
                  </label>
                </div>
              </td>
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

export default BlogsOfferPage;
