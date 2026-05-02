import { useEffect } from "react";
import DataTable from "./DataTable";

const detailTableColumns = [
  {
    key: "label",
    header: "Label",
    grow: 1,
    cell: (row) => <span className="fw-semibold">{row.label}</span>,
  },
  {
    key: "value",
    header: "Value",
    grow: 1.3,
  },
];

const detailTableStyles = {
  headRow: {
    style: {
      display: "none",
    },
  },
  rows: {
    style: {
      fontSize: "0.875rem",
    },
  },
  cells: {
    style: {
      padding: "0.45rem 0.5rem",
      alignItems: "flex-start",
    },
  },
};

function DetailModal({ detail, onClose }) {
  useEffect(() => {
    if (!detail) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [detail, onClose]);

  if (!detail) {
    return null;
  }

  return (
    <>
      <div
        className="modal modal-lg fade show d-block"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {detail.title}
              </h1>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            <div className="modal-body">
              <div className="row">
                {detail.sections.map((section, sectionIndex) => (
                  <div className="col-md-6" key={`${detail.title}-${sectionIndex}`}>
                    <DataTable
                      columns={detailTableColumns}
                      rows={section.map(([label, value], rowIndex) => ({
                        id: `${sectionIndex}-${rowIndex}`,
                        label,
                        value,
                      }))}
                      noTableHead={true}
                      customStyles={detailTableStyles}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose} />
    </>
  );
}

export default DetailModal;
