import PageHeader from "../components/PageHeader";
import StatusSwitch from "../components/StatusSwitch";
import { categoryPageData } from "../data/categoryData";
import useDocumentTitle from "../hooks/useDocumentTitle";

function CategoryPage() {
  useDocumentTitle(categoryPageData.documentTitle);

  return (
    <div className="category-page">
      <PageHeader
        title={categoryPageData.title}
        toolbarGroups={categoryPageData.toolbarGroups}
      />

      <div className="category-form-section border-bottom">
        <h5 className="category-section-title">Add Category</h5>
        <form onSubmit={(event) => event.preventDefault()} className="category-form">
          <div className="row g-2 align-items-start">
            <div className="col-xl-3 col-lg-4 col-md-5">
              <input
                type="text"
                className="form-control category-input"
                placeholder="Category name"
                aria-label="Category name"
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-5">
              <input
                type="file"
                className="form-control category-file-input"
                aria-label="Choose category image"
                accept="image/*"
              />
            </div>
            <div className="col-xl-auto col-lg-auto col-md-2">
              <button type="submit" className="btn btn-dark category-submit-button">
                Add Category
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="table-responsive small category-table-wrap">
        <table className="table table-striped table-sm category-table">
          <thead>
            <tr>
              <th scope="col" className="category-id-column">
                #
              </th>
              <th scope="col" className="category-image-column">
                Image
              </th>
              <th scope="col">Category</th>
              <th scope="col">Product (4)</th>
              <th scope="col" className="category-status-column">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {categoryPageData.rows.map((row) => (
              <tr key={row.id}>
                <td className="category-id-cell">{row.id}</td>
                <td className="category-image-cell">
                  <img
                    src={categoryPageData.imageSrc}
                    alt={row.imageAlt}
                    className="category-logo"
                  />
                </td>
                <td className="category-name-cell">{row.category}</td>
                <td className="category-products-cell">
                  <div className="category-product-list">
                    {row.products.map((product) => (
                      <span className="category-product-pill" key={`${row.id}-${product}`}>
                        {product}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="category-status-cell">
                  <StatusSwitch
                    current={row.status.current}
                    options={row.status.options}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoryPage;
