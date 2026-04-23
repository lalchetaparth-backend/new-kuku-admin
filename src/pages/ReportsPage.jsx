import PageHeader from "../components/PageHeader";
import { reportsPageData } from "../data/reportsData";
import useDocumentTitle from "../hooks/useDocumentTitle";

function ReportsPage() {
  useDocumentTitle(reportsPageData.documentTitle);

  return (
    <PageHeader
      title={reportsPageData.title}
      toolbarGroups={reportsPageData.toolbarGroups}
    />
  );
}

export default ReportsPage;
