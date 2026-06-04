import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import StatusSwitch from "../components/StatusSwitch";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { addBlogAd, getBlogAds, updateBlogAdStatus } from "../services/blogAds";
import { getProductCategoryOptions } from "../services/products";

const statusToolbar = {
  id: "blogAdStatus",
  type: "dropdown",
  className: "btn-group me-2",
  buttonClass: "btn btn-primary dropdown-toggle",
  iconClass: "bi bi-hourglass-split",
  label: "Select Status",
  defaultValue: "all",
  items: [
    { label: "All Status", value: "all" },
    { label: "Live", value: "active" },
    { label: "On Hold", value: "hold" },
  ],
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

function createInitialToolbarState(toolbarGroups = []) {
  return toolbarGroups.reduce((state, group) => {
    if (group.type === "dropdown" && group.id) {
      state[group.id] = group.defaultValue ?? "";
    }

    return state;
  }, {});
}

function filterBlogAdRows(rows, toolbarState) {
  const selectedStatus = toolbarState.blogAdStatus ?? "all";

  if (selectedStatus === "all") {
    return rows;
  }

  return rows.filter((row) => row.status === selectedStatus);
}

function getMessage(response, fallbackMessage) {
  if (typeof response === "object" && response !== null) {
    return response.msg || response.message || fallbackMessage;
  }

  return fallbackMessage;
}

function setBlogAdStatusDisabled(rows, disabled) {
  return rows.map((row) => ({
    ...row,
    statusDisabled: disabled,
  }));
}

function updateBlogAdStatusRow(rows, targetBlogAdId, nextStatus) {
  return rows.map((row) => ({
    ...row,
    status: row.blogAdId === targetBlogAdId ? nextStatus : row.status,
    statusDisabled: false,
  }));
}

function BlogsOfferPage() {
  useDocumentTitle("Blog offers Page - Kuku Foods");
  const toolbarGroups = [exportToolbar, statusToolbar];
  const [rows, setRows] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isLoadingRows, setIsLoadingRows] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryErrorMessage, setCategoryErrorMessage] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [statusErrorMessage, setStatusErrorMessage] = useState("");
  const [statusToastMessage, setStatusToastMessage] = useState("");
  const [toolbarState, setToolbarState] = useState(() =>
    createInitialToolbarState(toolbarGroups),
  );

  const loadRows = async (options = categoryOptions) => {
    setIsLoadingRows(true);
    setErrorMessage("");

    try {
      const nextRows = await getBlogAds(options);

      setRows(nextRows);
    } catch (error) {
      setRows([]);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load blog ads.",
      );
    } finally {
      setIsLoadingRows(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadPageData = async () => {
      let nextCategoryOptions = [];

      setIsLoadingCategories(true);
      setCategoryErrorMessage("");

      try {
        nextCategoryOptions = await getProductCategoryOptions();

        if (!isMounted) {
          return;
        }

        setCategoryOptions(nextCategoryOptions);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setCategoryOptions([]);
        setCategoryErrorMessage(
          error instanceof Error ? error.message : "Unable to load categories.",
        );
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }

      setIsLoadingRows(true);
      setErrorMessage("");

      try {
        const nextRows = await getBlogAds(nextCategoryOptions);

        if (!isMounted) {
          return;
        }

        setRows(nextRows);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setRows([]);
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load blog ads.",
        );
      } finally {
        if (isMounted) {
          setIsLoadingRows(false);
        }
      }
    };

    loadPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!statusToastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setStatusToastMessage("");
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [statusToastMessage]);

  const handleToolbarAction = (groupId, value) => {
    if (!groupId) {
      return;
    }

    setToolbarState((currentState) => ({
      ...currentState,
      [groupId]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    setIsSubmitting(true);
    setFormErrorMessage("");

    try {
      const response = await addBlogAd(new FormData(form));

      form.reset();
      setStatusToastMessage(getMessage(response, "Advertisement added successfully."));
      await loadRows(categoryOptions);
    } catch (error) {
      setFormErrorMessage(
        error instanceof Error ? error.message : "Unable to add advertisement.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (row, checked) => {
    if (!row.blogAdId) {
      setStatusErrorMessage("Unable to update status. Missing blog advertisement id.");
      return;
    }

    const nextStatus = checked ? "active" : "hold";

    setRows((currentRows) => setBlogAdStatusDisabled(currentRows, true));
    setIsUpdatingStatus(true);
    setStatusToastMessage("");
    setStatusErrorMessage("");

    try {
      const response = await updateBlogAdStatus(row.blogAdId, nextStatus);

      setRows((currentRows) =>
        updateBlogAdStatusRow(currentRows, row.blogAdId, nextStatus),
      );
      setStatusToastMessage(getMessage(response, "Status updated successfully."));
    } catch (error) {
      setRows((currentRows) => setBlogAdStatusDisabled(currentRows, false));
      setStatusErrorMessage(
        error instanceof Error ? error.message : "Unable to update status.",
      );
      await loadRows(categoryOptions);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const visibleRows = filterBlogAdRows(rows, toolbarState);

  return (
    <>
      {statusToastMessage ? (
        <div className="app-toast-container" role="status" aria-live="polite">
          <div className="app-toast app-toast-success">{statusToastMessage}</div>
        </div>
      ) : null}
      <PageHeader
        title="Blog Advertisement"
        toolbarGroups={toolbarGroups}
        toolbarState={toolbarState}
        onToolbarAction={handleToolbarAction}
      />

      <div className="add-blog-adv border-bottom mb-3">
        <h5>Add Blogs Advertisement</h5>
        <form onSubmit={handleSubmit}>
          {formErrorMessage ? (
            <div className="alert alert-danger" role="alert">
              Failed to add advertisement. {formErrorMessage}
            </div>
          ) : null}
          {categoryErrorMessage ? (
            <div className="alert alert-danger" role="alert">
              Failed to load categories. {categoryErrorMessage}
            </div>
          ) : null}
          <div className="row g-2">
            <div className="col-md-3">
              <div className="mb-3">
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Advertisement title"
                  aria-label="Advertisement title"
                  required
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  placeholder="Advertisement photo"
                  aria-label="Advertisement photo"
                  accept="image/*"
                  required
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <select
                  className="form-control"
                  name="category_id"
                  defaultValue=""
                  required
                  disabled={isLoadingCategories || categoryOptions.length === 0}
                >
                  <option value="">
                    {isLoadingCategories ? "Loading categories..." : "Select Category"}
                  </option>
                  {categoryOptions.map((option) => (
                    <option key={`blog-ad-category-${option.value}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <input
                  type="submit"
                  className="btn btn-dark"
                  value="Add Advertisement"
                  disabled={
                    isSubmitting || isLoadingCategories || categoryOptions.length === 0
                  }
                />
              </div>
            </div>
          </div>
          {isSubmitting ? (
            <div className="d-flex align-items-center gap-2 text-secondary small mb-3">
              <div className="spinner-border spinner-border-sm" role="status" />
              <span>Submitting advertisement...</span>
            </div>
          ) : null}
        </form>
      </div>

      {errorMessage ? (
        <div className="alert alert-danger" role="alert">
          Failed to load blog ads. {errorMessage}
        </div>
      ) : null}
      {statusErrorMessage ? (
        <div className="alert alert-danger" role="alert">
          Failed to update status. {statusErrorMessage}
        </div>
      ) : null}
      {isLoadingRows ? (
        <div className="d-flex align-items-center gap-2 text-secondary small mb-3">
          <div className="spinner-border spinner-border-sm" role="status" />
          <span>Loading blog advertisements...</span>
        </div>
      ) : null}
      {isUpdatingStatus ? (
        <div className="d-flex align-items-center gap-2 text-secondary small mb-3">
          <div className="spinner-border spinner-border-sm" role="status" />
          <span>Updating status...</span>
        </div>
      ) : null}
      <div className="table-responsive small">
        <table className="table table-striped table-sm mb-3">
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
            {!isLoadingRows && !errorMessage && visibleRows.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="alert alert-light border mb-0" role="status">
                    No blog advertisements found.
                  </div>
                </td>
              </tr>
            ) : null}
            {visibleRows.map((row) => {
              return (
                <tr key={row.blogAdId || row.id}>
                  <td>{row.id}</td>
                  <td>
                    <img src={row.image} width="100" alt={row.title} />
                  </td>
                  <td>{row.title}</td>
                  <td>
                    <p className="mb-0">{row.category}</p>
                  </td>
                  <td>
                    <StatusSwitch
                      current={row.status}
                      options={[
                        { value: "active", label: "Live", badgeClass: "text-bg-success" },
                        { value: "hold", label: "On Hold", badgeClass: "text-bg-warning" },
                      ]}
                      activeValue="active"
                      showCurrentOnly={true}
                      interactive={true}
                      disabled={isUpdatingStatus || row.statusDisabled}
                      onChange={(checked) => handleStatusChange(row, checked)}
                    />
                  </td>
                  <td>
                    <button type="button" className="delete-link">
                      <i className="bi bi-trash" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {visibleRows.length > 0 ? <Pagination /> : null}
    </>
  );
}

export default BlogsOfferPage;
