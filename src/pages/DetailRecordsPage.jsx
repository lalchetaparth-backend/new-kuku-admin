import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import DetailModal from "../components/DetailModal";
import PageHeader from "../components/PageHeader";
import { detailPages } from "../data/detailPages";
import useDocumentTitle from "../hooks/useDocumentTitle";

function DetailRecordsPage({ pageKey }) {
  const page = detailPages[pageKey];
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [rows, setRows] = useState(page.rows ?? []);
  const [isLoading, setIsLoading] = useState(Boolean(page.loadRows));
  const [errorMessage, setErrorMessage] = useState("");

  useDocumentTitle(page.documentTitle);

  useEffect(() => {
    let isMounted = true;

    setSelectedDetail(null);

    if (!page.loadRows) {
      setRows(page.rows ?? []);
      setIsLoading(false);
      setErrorMessage("");

      return undefined;
    }

    const loadRows = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextRows = await page.loadRows();

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
          error instanceof Error ? error.message : "Unable to load records.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadRows();

    return () => {
      isMounted = false;
    };
  }, [page]);

  const handleAction = (action, row) => {
    if (action === "details") {
      setSelectedDetail(row.details);
    }
  };

  return (
    <>
      <PageHeader title={page.title} toolbarGroups={page.toolbarGroups} />
      {errorMessage ? (
        <div className="alert alert-danger" role="alert">
          Failed to load records. {errorMessage}
        </div>
      ) : null}
      {isLoading ? (
        <div className="d-flex align-items-center gap-2 text-secondary small mb-3">
          <div className="spinner-border spinner-border-sm" role="status" />
          <span>Loading records...</span>
        </div>
      ) : null}
      {!isLoading && !errorMessage && rows.length === 0 ? (
        <div className="alert alert-light border" role="status">
          {page.emptyMessage ?? "No records found."}
        </div>
      ) : null}
      {rows.length > 0 ? (
        <DataTable columns={page.columns} rows={rows} onAction={handleAction} />
      ) : null}
      <DetailModal detail={selectedDetail} onClose={() => setSelectedDetail(null)} />
    </>
  );
}

export default DetailRecordsPage;
