import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import FormFields from "../components/FormFields";
import PageHeader from "../components/PageHeader";
import TabbedPage from "../components/TabbedPage";
import { createProductVariant, productsPageData } from "../data/productsData";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  addProduct,
  getProductCategoryOptions,
  updateProductStatus,
} from "../services/products";

function createInitialToolbarState(toolbarGroups = []) {
  return toolbarGroups.reduce((state, group) => {
    if (group.type === "dropdown" && group.id) {
      state[group.id] = group.defaultValue ?? "";
    }

    return state;
  }, {});
}

function filterProductRows(rows, filters) {
  const selectedStatus = filters.productStatus ?? "all";

  if (selectedStatus === "all") {
    return rows;
  }

  return rows.filter((row) => row.status?.current === selectedStatus);
}

function VariantInput({ id, name, label, placeholder }) {
  return (
    <div className="col-md-3">
      <div className="form-floating mb-3">
        <input type="text" className="form-control" id={id} name={name} placeholder={placeholder} />
        <label htmlFor={id}>{label}</label>
      </div>
    </div>
  );
}

function VariantRow({ variant, index, isLastVariant, onAddVariant }) {
  const variantNumber = index + 1;

  return (
    <div className="col-12">
      <div className="product-variant-card">
        <div className="product-variant-header">
          <span className="product-variant-title">Variant {variantNumber}</span>
          {isLastVariant ? (
            <button type="button" className="btn btn-info btn-sm rounded-pill px-3" onClick={onAddVariant}>
              <i className="bi bi-plus me-1" />
              Add New Variant
            </button>
          ) : null}
        </div>
        <div className="row g-2">
          <VariantInput
            id={`${variant.id}-weight`}
            name={`variants[${index}].weight`}
            label="Weight"
            placeholder="Weight"
          />
          <VariantInput
            id={`${variant.id}-price`}
            name={`variants[${index}].price`}
            label="Price"
            placeholder="Price"
          />
          <VariantInput id={`${variant.id}-mrp`} name={`variants[${index}].mrp`} label="MRP" placeholder="MRP" />
          <div className="col-md-3">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id={`${variant.id}-item-weight`}
                name={`variants[${index}].itemWeight`}
                placeholder="Item Weight (kg)"
              />
              <label htmlFor={`${variant.id}-item-weight`}>Item Weight (kg)</label>
            </div>
          </div>
          <VariantInput
            id={`${variant.id}-item-length`}
            name={`variants[${index}].itemLength`}
            label="Item length(mm)"
            placeholder="Item length(mm)"
          />
          <VariantInput
            id={`${variant.id}-item-width`}
            name={`variants[${index}].itemWidth`}
            label="Item Width(mm)"
            placeholder="Item Width(mm)"
          />
          <VariantInput
            id={`${variant.id}-item-height`}
            name={`variants[${index}].itemHeight`}
            label="Item Height(mm)"
            placeholder="Item Height(mm)"
          />
        </div>
      </div>
    </div>
  );
}

function setProductStatusDisabled(rows, disabled) {
  return rows.map((row) => ({
    ...row,
    status:
      row.status?.type === "statusSwitch"
        ? {
            ...row.status,
            disabled,
          }
        : row.status,
  }));
}

function updateProductStatusRow(rows, targetProductId, nextStatus) {
  return rows.map((row) => ({
    ...row,
    status:
      row.status?.type === "statusSwitch"
        ? {
            ...row.status,
            current: row.productId === targetProductId ? nextStatus : row.status.current,
            disabled: false,
          }
        : row.status,
  }));
}

function ProductsPage() {
  useDocumentTitle(productsPageData.documentTitle);
  const createInitialVariants = () =>
    productsPageData.variants.map((variant) => ({ ...variant }));
  const [variants, setVariants] = useState(() =>
    createInitialVariants(),
  );
  const [rows, setRows] = useState(productsPageData.rows ?? []);
  const [isLoading, setIsLoading] = useState(Boolean(productsPageData.loadRows));
  const [errorMessage, setErrorMessage] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [statusToastMessage, setStatusToastMessage] = useState("");
  const [statusErrorMessage, setStatusErrorMessage] = useState("");
  const [productFormErrorMessage, setProductFormErrorMessage] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryErrorMessage, setCategoryErrorMessage] = useState("");
  const [toolbarState, setToolbarState] = useState(() =>
    createInitialToolbarState(productsPageData.toolbarGroups),
  );

  const loadProductRows = async () => {
    if (!productsPageData.loadRows) {
      setRows(productsPageData.rows ?? []);
      setIsLoading(false);
      setErrorMessage("");

      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const nextRows = await productsPageData.loadRows();

      setRows(nextRows);
    } catch (error) {
      setRows([]);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load records.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadRows = async () => {
      if (!productsPageData.loadRows) {
        if (!isMounted) {
          return;
        }

        setRows(productsPageData.rows ?? []);
        setIsLoading(false);
        setErrorMessage("");

        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextRows = await productsPageData.loadRows();

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

  useEffect(() => {
    let isMounted = true;

    const loadCategoryOptions = async () => {
      setIsLoadingCategories(true);
      setCategoryErrorMessage("");

      try {
        const nextOptions = await getProductCategoryOptions();

        if (!isMounted) {
          return;
        }

        setCategoryOptions(nextOptions);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setCategoryOptions([]);
        setCategoryErrorMessage(
          error instanceof Error ? error.message : "Unable to load categories.",
        );
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    };

    loadCategoryOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddVariant = () => {
    setVariants((currentVariants) => [
      ...currentVariants,
      createProductVariant(currentVariants.length + 1),
    ]);
  };

  const handleStatusChange = async (row, checked) => {
    if (row.productId === undefined || row.productId === null) {
      return;
    }

    const nextStatus = checked ? "live" : "hold";

    setRows((currentRows) => setProductStatusDisabled(currentRows, true));
    setIsUpdatingStatus(true);
    setStatusToastMessage("");
    setStatusErrorMessage("");

    try {
      const response = await updateProductStatus(row.productId, nextStatus);

      setRows((currentRows) =>
        updateProductStatusRow(currentRows, row.productId, nextStatus),
      );
      setStatusToastMessage(
        (typeof response === "object" && response !== null && response.msg) ||
          "Status updated successfully.",
      );
    } catch (error) {
      setRows((currentRows) => setProductStatusDisabled(currentRows, false));
      setStatusErrorMessage(
        error instanceof Error ? error.message : "Unable to update status.",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    setIsSubmittingProduct(true);
    setProductFormErrorMessage("");
    setStatusErrorMessage("");

    try {
      const response = await addProduct(new FormData(form));

      form.reset();
      setVariants(createInitialVariants());
      setStatusToastMessage(
        (typeof response === "object" && response !== null && response.msg) ||
          "Product added successfully.",
      );
      await loadProductRows();
    } catch (error) {
      setProductFormErrorMessage(
        error instanceof Error ? error.message : "Unable to submit product.",
      );
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const primaryFields = productsPageData.primaryFields.map((field) => {
    if (field.name !== "category_id") {
      return field;
    }

    return {
      ...field,
      options: categoryOptions,
      placeholderOption: isLoadingCategories
        ? "Loading categories..."
        : "Select Category",
      disabled: isLoadingCategories || categoryOptions.length === 0,
    };
  });

  const handleToolbarAction = (groupId, value) => {
    if (!groupId) {
      return;
    }

    setToolbarState((currentState) => ({
      ...currentState,
      [groupId]: value,
    }));
  };

  return (
    <>
      {statusToastMessage ? (
        <div className="app-toast-container" role="status" aria-live="polite">
          <div className="app-toast app-toast-success">{statusToastMessage}</div>
        </div>
      ) : null}
      <PageHeader
        title={productsPageData.title}
        toolbarGroups={productsPageData.toolbarGroups}
        toolbarState={toolbarState}
        onToolbarAction={handleToolbarAction}
      />
      <TabbedPage
        tabs={productsPageData.tabs}
        renderTabContent={(tab) => {
          if (tab.id === "products-list") {
            const visibleRows = filterProductRows(rows, toolbarState);

            return (
              <>
                {errorMessage ? (
                  <div className="alert alert-danger" role="alert">
                    Failed to load records. {errorMessage}
                  </div>
                ) : null}
                {statusErrorMessage ? (
                  <div className="alert alert-danger" role="alert">
                    Failed to update status. {statusErrorMessage}
                  </div>
                ) : null}
                {isLoading ? (
                  <div className="d-flex align-items-center gap-2 text-secondary small mb-3">
                    <div className="spinner-border spinner-border-sm" role="status" />
                    <span>Loading records...</span>
                  </div>
                ) : null}
                {isUpdatingStatus ? (
                  <div className="d-flex align-items-center gap-2 text-secondary small mb-3">
                    <div className="spinner-border spinner-border-sm" role="status" />
                    <span>Updating status...</span>
                  </div>
                ) : null}
                {!isLoading && !errorMessage && visibleRows.length === 0 ? (
                  <div className="alert alert-light border" role="status">
                    {productsPageData.emptyMessage ?? "No records found."}
                  </div>
                ) : null}
                {visibleRows.length > 0 ? (
                  <DataTable
                    columns={productsPageData.columns}
                    rows={visibleRows}
                    onStatusChange={(rowData, _statusValue, checked) =>
                      handleStatusChange(rowData, checked)
                    }
                  />
                ) : null}
              </>
            );
          }

          return (
            <form onSubmit={handleProductSubmit}>
              {productFormErrorMessage ? (
                <div className="alert alert-danger" role="alert">
                  Failed to submit product. {productFormErrorMessage}
                </div>
              ) : null}
              {categoryErrorMessage ? (
                <div className="alert alert-danger" role="alert">
                  Failed to load categories. {categoryErrorMessage}
                </div>
              ) : null}
              <div className="row g-2">
                <FormFields fields={primaryFields} />

                <FormFields fields={productsPageData.contentFields} />

                {variants.map((variant, index) => (
                  <VariantRow
                    key={variant.id}
                    variant={variant}
                    index={index}
                    isLastVariant={index === variants.length - 1}
                    onAddVariant={handleAddVariant}
                  />
                ))}

                <div className="col-md-3">
                  <div>
                    <label htmlFor="product-main-photo" className="form-label">
                      {productsPageData.mainPhoto.label}
                    </label>
                    <input
                      className="form-control"
                      id="product-main-photo"
                      name="thumbnail_image"
                      type="file"
                      accept="image/*"
                      required
                    />
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
                      name="other_images"
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
                  <label>Tax Details</label>
                </div>

                <FormFields fields={productsPageData.taxFields} />

                <div className="col-md-12">
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Upload Product"
                    disabled={
                      isSubmittingProduct || isLoadingCategories || categoryOptions.length === 0
                    }
                  />
                </div>
                {isSubmittingProduct ? (
                  <div className="col-md-12">
                    <div className="d-flex align-items-center gap-2 text-secondary small">
                      <div className="spinner-border spinner-border-sm" role="status" />
                      <span>Submitting product...</span>
                    </div>
                  </div>
                ) : null}
              </div>
            </form>
          );
        }}
      />
    </>
  );
}

export default ProductsPage;
