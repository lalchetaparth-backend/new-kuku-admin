import DataTable from "../components/DataTable";
import FormFields from "../components/FormFields";
import PageHeader from "../components/PageHeader";
import { categoryPageData } from "../data/categoryData";
import useDocumentTitle from "../hooks/useDocumentTitle";

function CategoryPage() {
  useDocumentTitle(categoryPageData.documentTitle);

  return (
    <>
      <PageHeader
        title={categoryPageData.title}
        toolbarGroups={categoryPageData.toolbarGroups}
      />

      <div className="add-category border-bottom mb-3">
        <h5>Add Category</h5>
        <form onSubmit={(event) => event.preventDefault()}>
          <div className="row g-2">
            <FormFields fields={categoryPageData.formFields} />
          </div>
        </form>
      </div>

      {/* <DataTable columns={categoryPageData.columns} rows={categoryPageData.rows} /> */}
    </>
  );
}

export default CategoryPage;
