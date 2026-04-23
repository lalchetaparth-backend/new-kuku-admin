import { useState } from "react";
import DataTable from "../components/DataTable";
import DetailModal from "../components/DetailModal";
import PageHeader from "../components/PageHeader";
import { detailPages } from "../data/detailPages";
import useDocumentTitle from "../hooks/useDocumentTitle";

function DetailRecordsPage({ pageKey }) {
  const page = detailPages[pageKey];
  const [selectedDetail, setSelectedDetail] = useState(null);

  useDocumentTitle(page.documentTitle);

  const handleAction = (action, row) => {
    if (action === "details") {
      setSelectedDetail(row.details);
    }
  };

  return (
    <>
      <PageHeader title={page.title} toolbarGroups={page.toolbarGroups} />
      <DataTable columns={page.columns} rows={page.rows} onAction={handleAction} />
      <DetailModal detail={selectedDetail} onClose={() => setSelectedDetail(null)} />
    </>
  );
}

export default DetailRecordsPage;
