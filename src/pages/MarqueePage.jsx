import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { addMarquee, deleteMarquee, getMarqueeRows } from "../services/marquee";

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

function getMessage(response, fallbackMessage) {
  if (typeof response === "object" && response !== null) {
    return response.msg || response.message || fallbackMessage;
  }

  return fallbackMessage;
}

function MarqueePage() {
  useDocumentTitle("Marquee Page - Kuku Foods");
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [actionErrorMessage, setActionErrorMessage] = useState("");
  const [statusToastMessage, setStatusToastMessage] = useState("");
  const [deleteConfirmRow, setDeleteConfirmRow] = useState(null);

  const loadRows = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const nextRows = await getMarqueeRows();

      setRows(nextRows);
    } catch (error) {
      setRows([]);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load marquees.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialRows = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextRows = await getMarqueeRows();

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
          error instanceof Error ? error.message : "Unable to load marquees.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialRows();

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    setIsSubmitting(true);
    setFormErrorMessage("");
    setActionErrorMessage("");

    try {
      const response = await addMarquee(new FormData(form));

      form.reset();
      setStatusToastMessage(getMessage(response, "Marquee added successfully."));
      await loadRows();
    } catch (error) {
      setFormErrorMessage(
        error instanceof Error ? error.message : "Unable to add marquee.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (row) => {
    if (!row.marqueeId) {
      setActionErrorMessage("Unable to delete marquee. Missing marquee id.");
      return;
    }

    setDeleteConfirmRow(null);
    setIsDeleting(true);
    setActionErrorMessage("");

    try {
      const response = await deleteMarquee(row.marqueeId);

      setStatusToastMessage(getMessage(response, "Marquee deleted successfully."));
      await loadRows();
    } catch (error) {
      setActionErrorMessage(
        error instanceof Error ? error.message : "Unable to delete marquee.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {statusToastMessage ? (
        <div className="app-toast-container" role="status" aria-live="polite">
          <div className="app-toast app-toast-success">{statusToastMessage}</div>
        </div>
      ) : null}
      <PageHeader title="Add Marquee" toolbarGroups={[exportToolbar]} />

      <div className="add-marquee border-bottom mb-3">
        <h5>Add Marquee</h5>
        <form onSubmit={handleSubmit}>
          {formErrorMessage ? (
            <div className="alert alert-danger" role="alert">
              Failed to add marquee. {formErrorMessage}
            </div>
          ) : null}
          <div className="row g-2">
            <div className="col-md-5">
              <div className="mb-3">
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Add Marquee"
                  aria-label="add marquee"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="col-md-3">
              <div className="mb-3">
                <input
                  type="submit"
                  className="btn btn-dark"
                  value={isSubmitting ? "Adding..." : "Add Marquee"}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
          {isSubmitting ? (
            <div className="d-flex align-items-center gap-2 text-secondary small mb-3">
              <div className="spinner-border spinner-border-sm" role="status" />
              <span>Submitting marquee...</span>
            </div>
          ) : null}
        </form>
      </div>

      {errorMessage ? (
        <div className="alert alert-danger" role="alert">
          Failed to load marquees. {errorMessage}
        </div>
      ) : null}
      {actionErrorMessage ? (
        <div className="alert alert-danger" role="alert">
          Action failed. {actionErrorMessage}
        </div>
      ) : null}
      {isLoading ? (
        <div className="d-flex align-items-center gap-2 text-secondary small mb-3">
          <div className="spinner-border spinner-border-sm" role="status" />
          <span>Loading marquees...</span>
        </div>
      ) : null}
      {isDeleting ? (
        <div className="d-flex align-items-center gap-2 text-secondary small mb-3">
          <div className="spinner-border spinner-border-sm" role="status" />
          <span>Deleting marquee...</span>
        </div>
      ) : null}

      <div className="table-responsive small">
        <table className="table table-striped table-sm mb-3">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Marquee</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && !errorMessage && rows.length === 0 ? (
              <tr>
                <td colSpan="3">
                  <div className="alert alert-light border mb-0" role="status">
                    No marquees found.
                  </div>
                </td>
              </tr>
            ) : null}
            {rows.map((row) => (
              <tr key={row.marqueeId || row.id}>
                <td>{row.id}</td>
                <td>{row.title}</td>
                <td>
                  <button
                    type="button"
                    className="delete-link"
                    disabled={isDeleting}
                    onClick={() => setDeleteConfirmRow(row)}
                  >
                    <i className="bi bi-trash" />
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > 0 ? <Pagination /> : null}

      {deleteConfirmRow ? (
        <div className="app-confirm-backdrop" onClick={() => setDeleteConfirmRow(null)}>
          <div
            className="app-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Delete confirmation"
            onClick={(event) => event.stopPropagation()}
          >
            <h5 className="app-confirm-title">Delete marquee?</h5>
            <p className="app-confirm-text">Are you sure you want to delete this marquee?</p>
            <div className="app-confirm-actions">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setDeleteConfirmRow(null)}
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(deleteConfirmRow)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default MarqueePage;
