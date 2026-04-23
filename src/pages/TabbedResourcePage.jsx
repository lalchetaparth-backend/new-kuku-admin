import DataTable from "../components/DataTable";
import FormFields from "../components/FormFields";
import PageHeader from "../components/PageHeader";
import TabbedPage from "../components/TabbedPage";
import { tabbedPages } from "../data/tabbedPages";
import useDocumentTitle from "../hooks/useDocumentTitle";

function TabbedResourcePage({ pageKey }) {
  const page = tabbedPages[pageKey];

  useDocumentTitle(page.documentTitle);

  return (
    <>
      <PageHeader title={page.title} toolbarGroups={page.toolbarGroups} />
      <TabbedPage
        tabs={page.tabs}
        renderTabContent={(tab) => {
          if (tab.columns) {
            return <DataTable columns={tab.columns} rows={tab.rows} />;
          }

          return (
            <form onSubmit={(event) => event.preventDefault()}>
              <div className="row g-2">
                <FormFields fields={tab.formFields} />
              </div>
            </form>
          );
        }}
      />
    </>
  );
}

export default TabbedResourcePage;
