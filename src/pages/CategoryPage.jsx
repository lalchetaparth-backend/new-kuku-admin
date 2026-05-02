import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatusSwitch from "../components/StatusSwitch";
import { categoryPageData } from "../data/categoryData";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  addCategory,
  getCategories,
  normalizeCategoryStatus,
  updateCategoryStatus,
} from "../services/categories";

function getCategoryProducts(category) {
  return Array.isArray(category?.products) ? category.products : [];
}

function createInitialToolbarState(toolbarGroups = []) {
  return toolbarGroups.reduce((state, group) => {
    if (group.type === "dropdown" && group.id) {
      state[group.id] = group.defaultValue ?? "";
    }

    return state;
  }, {});
}

function filterCategories(categories, filters) {
  const selectedStatus = filters.categoryStatus ?? "all";

  if (selectedStatus === "all") {
    return categories;
  }

  return categories.filter(
    (category) => normalizeCategoryStatus(category.category_status) === selectedStatus,
  );
}

function CategoryPage() {
  useDocumentTitle(categoryPageData.documentTitle);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusToastMessage, setStatusToastMessage] = useState("");
  const [statusErrorMessage, setStatusErrorMessage] = useState("");
  const [toolbarState, setToolbarState] = useState(() =>
    createInitialToolbarState(categoryPageData.toolbarGroups),
  );

  const fetchCategories = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getCategories();
      if (response.result === 1) {
        setCategories(Array.isArray(response.data) ? response.data : []);
      } else {
        setError(response.msg || "Failed to fetch categories");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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

  const handleStatusChange = async (row, checked) => {
    if (!row.category_id) return;

    const nextStatus = checked ? "Active" : "Inactive";

    setIsUpdatingStatus(true);
    setStatusToastMessage("");
    setStatusErrorMessage("");

    try {
      const response = await updateCategoryStatus(row.category_id, nextStatus);

      setCategories((current) =>
        current.map(cat =>
          cat.category_id === row.category_id
            ? { ...cat, category_status: nextStatus }
            : cat
        )
      );

      setStatusToastMessage(
        (typeof response === "object" && response !== null && response.msg) ||
        "Status updated successfully."
      );
    } catch (err) {
      setStatusErrorMessage(
        err instanceof Error ? err.message : "Unable to update status."
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!categoryName) {
      alert("Please enter a category name.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("category_name", categoryName);
      formData.append("category_status", "Active");
      if (categoryImage) {
        formData.append("category_image", categoryImage);
      }

      const response = await addCategory(formData);

      if (response.result === 1) {
        alert(response.msg || "Category Added Successfully !!");
        setCategoryName("");
        setCategoryImage(null);
        event.target.reset();
        fetchCategories();
      } else {
        alert(response.msg || "Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert(error.message || "An error occurred while adding the category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToolbarAction = (groupId, value) => {
    if (!groupId) {
      return;
    }

    setToolbarState((currentState) => ({
      ...currentState,
      [groupId]: value,
    }));
  };

  const visibleCategories = filterCategories(categories, toolbarState);
  const totalProducts = visibleCategories.reduce(
    (count, category) => count + getCategoryProducts(category).length,
    0,
  );

  return (
    <>
      {statusToastMessage ? (
        <div className="app-toast-container" role="status" aria-live="polite">
          <div className="app-toast app-toast-success">{statusToastMessage}</div>
        </div>
      ) : null}
      <div className="category-page">
        <PageHeader
          title={categoryPageData.title}
          toolbarGroups={categoryPageData.toolbarGroups}
          toolbarState={toolbarState}
          onToolbarAction={handleToolbarAction}
        />

        <div className="category-form-section border-bottom">
          <h5 className="category-section-title">Add Category</h5>
          <form onSubmit={handleSubmit} className="category-form">
            <div className="row g-2 align-items-start">
              <div className="col-xl-3 col-lg-4 col-md-5">
                <input
                  type="text"
                  className="form-control category-input"
                  placeholder="Category name"
                  aria-label="Category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="col-xl-3 col-lg-4 col-md-5">
                <input
                  type="file"
                  className="form-control category-file-input"
                  aria-label="Choose category image"
                  accept="image/*"
                  onChange={(e) => setCategoryImage(e.target.files[0])}
                  disabled={isSubmitting}
                />
              </div>
              <div className="col-xl-auto col-lg-auto col-md-2">
                <button
                  type="submit"
                  className="btn btn-dark category-submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Category"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="table-responsive small category-table-wrap">
          {statusErrorMessage ? (
            <div className="alert alert-danger m-3" role="alert">
              Failed to update status. {statusErrorMessage}
            </div>
          ) : null}
          {isUpdatingStatus ? (
            <div className="d-flex align-items-center gap-2 text-secondary small mb-3 p-3">
              <div className="spinner-border spinner-border-sm" role="status" />
              <span>Updating status...</span>
            </div>
          ) : null}
          {isLoading ? (
            <div className="d-flex align-items-center gap-2 text-secondary small mb-3 p-3">
              <div className="spinner-border spinner-border-sm" role="status" />
              <span>Loading categories...</span>
            </div>
          ) : error ? (
            <div className="alert alert-danger m-3" role="alert">
              {error}
            </div>
          ) : visibleCategories.length === 0 ? (
            <div className="alert alert-light border m-3" role="status">
              No categories found.
            </div>
          ) : (
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
                  <th scope="col">Product ({totalProducts})</th>
                  <th scope="col" className="category-status-column">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleCategories.map((row) => {
                  const products = getCategoryProducts(row);

                  return (
                    <tr key={row.category_id}>
                      <td className="category-id-cell">
                        <span className="category-id-badge">{row.category_id}</span>
                      </td>
                      <td className="category-image-cell">
                        <div className="category-image-frame">
                          <img
                            src={row.category_image || categoryPageData.imageSrc}
                            alt={row.category_name}
                            className="category-logo"
                          />
                        </div>
                      </td>
                      <td className="category-name-cell">
                        <div className="category-name-block">
                          <span className="category-name">{row.category_name}</span>
                          <span className="category-meta">
                            {products.length} product{products.length === 1 ? "" : "s"}
                          </span>
                        </div>
                      </td>
                      <td className="category-products-cell">
                        <div className="category-product-list">
                          {products.length > 0 ? (
                            products.map((product) => (
                              <span className="category-product-pill" key={`${row.category_id}-${product.product_id}`}>
                                {product.product_name}
                              </span>
                            ))
                          ) : (
                            <span className="category-empty-pill">No products</span>
                          )}
                        </div>
                      </td>
                      <td className="category-status-cell">
                        <div className="category-status-wrap">
                          <StatusSwitch
                            current={normalizeCategoryStatus(row.category_status)}
                            options={[
                              { value: "active", label: "Active", badgeClass: "text-bg-success" },
                              { value: "inactive", label: "Inactive", badgeClass: "text-bg-warning" }
                            ]}
                            activeValue="active"
                            showCurrentOnly={true}
                            interactive={true}
                            disabled={isUpdatingStatus}
                            onChange={(checked) => handleStatusChange(row, checked)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default CategoryPage;
