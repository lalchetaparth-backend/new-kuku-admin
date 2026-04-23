import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import { simpleTablePages } from "../data/simpleTablePages";
import useDocumentTitle from "../hooks/useDocumentTitle";

function SimpleTablePage({ pageKey }) {
  const page = simpleTablePages[pageKey];

  useDocumentTitle(page.documentTitle);

  return (
    <>
      <PageHeader title={page.title} toolbarGroups={page.toolbarGroups} />
      {/* <DataTable columns={page.columns} rows={page.rows} /> */}
    </>
  );
}

export default SimpleTablePage;
