import DataTable from "../components/DataTable";
import FormFields from "../components/FormFields";
import PageHeader from "../components/PageHeader";
import TabbedPage from "../components/TabbedPage";
import { productsPageData } from "../data/productsData";
import useDocumentTitle from "../hooks/useDocumentTitle";

function VariantRow({ variant }) {
  return (
    <>
      <div className="col-md-3">
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id={`${variant.id}-weight`}
            placeholder="Weight"
          />
          <label htmlFor={`${variant.id}-weight`}>Weight</label>
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id={`${variant.id}-price`}
            placeholder="Weight"
          />
          <label htmlFor={`${variant.id}-price`}>Price</label>
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id={`${variant.id}-mrp`}
            placeholder="Weight"
          />
          <label htmlFor={`${variant.id}-mrp`}>MRP</label>
        </div>
      </div>
      <div className="col-md-3">
        <a
          href="#"
          className="btn btn-info btn-sm rounded-pill px-3"
          onClick={(event) => event.preventDefault()}
        >
          <i className="bi bi-plus me-1" />
          Add New Variant
        </a>
      </div>
    </>
  );
}

function ProductsPage() {
  useDocumentTitle(productsPageData.documentTitle);

  return (
    <>
      <PageHeader
        title={productsPageData.title}
        toolbarGroups={productsPageData.toolbarGroups}
      />
      <TabbedPage
        tabs={productsPageData.tabs}
        renderTabContent={(tab) => {
          if (tab.id === "products-list") {
            return <DataTable columns={productsPageData.columns} rows={productsPageData.rows} />;
          }

          return (
            <form onSubmit={(event) => event.preventDefault()}>
              <div className="row g-2">
                <FormFields fields={productsPageData.primaryFields} />

                <div className="col-md-12">
                  <div className="mb-3">Custome editor space</div>
                </div>

                {productsPageData.variants.map((variant) => (
                  <VariantRow key={variant.id} variant={variant} />
                ))}

                <div className="col-md-3">
                  <div>
                    <label htmlFor="product-main-photo" className="form-label">
                      {productsPageData.mainPhoto.label}
                    </label>
                    <input className="form-control" id="product-main-photo" type="file" />
                  </div>
                  <img
                    src={productsPageData.mainPhoto.previewSrc}
                    className="admin-pro-img"
                    alt={productsPageData.mainPhoto.label}
                  />
                </div>

                <div className="col-md-9">
                  <div>
                    <label htmlFor="product-other-photos" className="form-label">
                      {productsPageData.otherPhotos.label}
                    </label>
                    <input
                      className="form-control"
                      id="product-other-photos"
                      type="file"
                      multiple
                    />
                  </div>
                  <div className="row">
                    {productsPageData.otherPhotos.previewImages.map((imageSrc, index) => (
                      <div className="col-md-2 col-4" key={`${imageSrc}-${index}`}>
                        <img src={imageSrc} className="admin-pro-img" alt="Product preview" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-md-12 mt-4">
                  <label>Shipping Details</label>
                </div>

                <FormFields fields={productsPageData.shippingFields} />

                <div className="col-md-12">
                  <input type="submit" className="btn btn-primary" value="Upload Product" />
                </div>
              </div>
            </form>
          );
        }}
      />
    </>
  );
}

export default ProductsPage;
