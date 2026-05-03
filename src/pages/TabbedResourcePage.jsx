import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import FormFields from "../components/FormFields";
import PageHeader from "../components/PageHeader";
import TabbedPage from "../components/TabbedPage";
import { tabbedPages } from "../data/tabbedPages";
import useDocumentTitle from "../hooks/useDocumentTitle";

function createInitialTabState(tabs) {
  return tabs.reduce((state, tab) => {
    state[tab.id] = {
      rows: tab.rows ?? [],
      isLoading: Boolean(tab.loadRows),
      errorMessage: "",
      statusMessage: "",
      statusErrorMessage: "",
      isUpdatingStatus: false,
    };

    return state;
  }, {});
}

function createInitialFormState(tabs) {
  return tabs.reduce((state, tab) => {
    state[tab.id] = {
      isSubmitting: false,
      successMessage: "",
      errorMessage: "",
      fieldOptions: {},
      fieldLoading: {},
      fieldErrorMessages: {},
    };

    return state;
  }, {});
}

function createInitialToolbarState(toolbarGroups = []) {
  return toolbarGroups.reduce((state, group) => {
    if (group.type === "dropdown" && group.id) {
      state[group.id] = group.defaultValue ?? "";
    }

    return state;
  }, {});
}

function getStatusToastMessage(tabState) {
  return (
    Object.values(tabState).find((state) => state.statusMessage)?.statusMessage ?? ""
  );
}

function clearStatusToastMessages(tabState) {
  return Object.entries(tabState).reduce((state, [tabId, value]) => {
    state[tabId] = {
      ...value,
      statusMessage: "",
    };

    return state;
  }, {});
}

function getVisibleRows(tab, rows, toolbarState) {
  if (!tab.filterRows) {
    return rows;
  }

  return tab.filterRows(rows, toolbarState);
}

function setStatusSwitchDisabled(rows, disabled) {
  return rows.map((row) => {
    if (row.status?.type !== "statusSwitch") {
      return row;
    }

    return {
      ...row,
      status: {
        ...row.status,
        disabled,
      },
    };
  });
}

function updateStatusRow(rows, targetBlogId, nextStatus) {
  return rows.map((row) => {
    if (row.status?.type !== "statusSwitch") {
      return row;
    }

    const isTargetRow = row.blogId === targetBlogId;

    return {
      ...row,
      status: {
        ...row.status,
        current: isTargetRow ? nextStatus : row.status.current,
        disabled: false,
      },
    };
  });
}

function getFieldsWithOptionLoaders(tab) {
  return (tab.formFields ?? []).filter(
    (field) => typeof field.loadOptions === "function" && field.name,
  );
}

function TabbedResourcePage({ pageKey }) {
  const page = tabbedPages[pageKey];
  const [tabState, setTabState] = useState(() => createInitialTabState(page.tabs));
  const [formState, setFormState] = useState(() => createInitialFormState(page.tabs));
  const [activeTabId, setActiveTabId] = useState(page.tabs[0]?.id);
  const [toolbarState, setToolbarState] = useState(() =>
    createInitialToolbarState(page.toolbarGroups),
  );
  const statusToastMessage = getStatusToastMessage(tabState);

  useDocumentTitle(page.documentTitle);

  const loadRowsForTab = async (tab) => {
    if (!tab.loadRows) {
      return;
    }

    setTabState((currentState) => ({
      ...currentState,
        [tab.id]: {
          ...(currentState[tab.id] ?? {}),
          rows: currentState[tab.id]?.rows ?? [],
          isLoading: true,
          errorMessage: "",
      },
    }));

    try {
      const rows = await tab.loadRows();

      setTabState((currentState) => ({
        ...currentState,
        [tab.id]: {
          rows,
          isLoading: false,
          errorMessage: "",
          statusMessage: currentState[tab.id]?.statusMessage ?? "",
          statusErrorMessage: currentState[tab.id]?.statusErrorMessage ?? "",
          isUpdatingStatus: false,
        },
      }));
    } catch (error) {
      setTabState((currentState) => ({
        ...currentState,
        [tab.id]: {
          ...(currentState[tab.id] ?? {}),
          rows: [],
          isLoading: false,
          errorMessage:
            error instanceof Error ? error.message : "Unable to load records.",
          isUpdatingStatus: false,
        },
      }));
    }
  };

  const loadFormOptionsForTab = async (tab) => {
    const fields = getFieldsWithOptionLoaders(tab);

    if (fields.length === 0) {
      return;
    }

    setFormState((currentState) => {
      const currentTabState = currentState[tab.id] ?? {};
      const nextFieldLoading = { ...(currentTabState.fieldLoading ?? {}) };
      const nextFieldErrorMessages = {
        ...(currentTabState.fieldErrorMessages ?? {}),
      };

      fields.forEach((field) => {
        nextFieldLoading[field.name] = true;
        nextFieldErrorMessages[field.name] = "";
      });

      return {
        ...currentState,
        [tab.id]: {
          isSubmitting: currentTabState.isSubmitting ?? false,
          successMessage: currentTabState.successMessage ?? "",
          errorMessage: currentTabState.errorMessage ?? "",
          fieldOptions: currentTabState.fieldOptions ?? {},
          fieldLoading: nextFieldLoading,
          fieldErrorMessages: nextFieldErrorMessages,
        },
      };
    });

    const fieldResults = await Promise.all(
      fields.map(async (field) => {
        try {
          const options = await field.loadOptions();

          return {
            fieldName: field.name,
            options,
            errorMessage: "",
          };
        } catch (error) {
          return {
            fieldName: field.name,
            options: [],
            errorMessage:
              error instanceof Error ? error.message : "Unable to load options.",
          };
        }
      }),
    );

    setFormState((currentState) => {
      const currentTabState = currentState[tab.id] ?? {};
      const nextFieldOptions = { ...(currentTabState.fieldOptions ?? {}) };
      const nextFieldLoading = { ...(currentTabState.fieldLoading ?? {}) };
      const nextFieldErrorMessages = {
        ...(currentTabState.fieldErrorMessages ?? {}),
      };

      fieldResults.forEach(({ fieldName, options, errorMessage }) => {
        nextFieldOptions[fieldName] = options;
        nextFieldLoading[fieldName] = false;
        nextFieldErrorMessages[fieldName] = errorMessage;
      });

      return {
        ...currentState,
        [tab.id]: {
          isSubmitting: currentTabState.isSubmitting ?? false,
          successMessage: currentTabState.successMessage ?? "",
          errorMessage: currentTabState.errorMessage ?? "",
          fieldOptions: nextFieldOptions,
          fieldLoading: nextFieldLoading,
          fieldErrorMessages: nextFieldErrorMessages,
        },
      };
    });
  };

  useEffect(() => {
    setTabState(createInitialTabState(page.tabs));
    setFormState(createInitialFormState(page.tabs));
    setActiveTabId(page.tabs[0]?.id);
    setToolbarState(createInitialToolbarState(page.toolbarGroups));

    page.tabs
      .filter((tab) => tab.loadRows)
      .forEach((tab) => {
        loadRowsForTab(tab);
      });

    page.tabs
      .filter((tab) => getFieldsWithOptionLoaders(tab).length > 0)
      .forEach((tab) => {
        loadFormOptionsForTab(tab);
      });
  }, [page]);

  useEffect(() => {
    if (!statusToastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setTabState((currentState) => clearStatusToastMessages(currentState));
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [statusToastMessage]);

  const handleToolbarAction = (groupId, value) => {
    if (!groupId) {
      return;
    }

    setToolbarState((currentState) => ({
      ...currentState,
      [groupId]: value,
    }));
  };

  const handleFormSubmit = async (tab, event) => {
    event.preventDefault();

    if (!tab.submitForm) {
      return;
    }

    const form = event.currentTarget;

    setFormState((currentState) => ({
      ...currentState,
      [tab.id]: {
        ...(currentState[tab.id] ?? {}),
        isSubmitting: true,
        successMessage: "",
        errorMessage: "",
      },
    }));

    try {
      const response = await tab.submitForm(new FormData(form));

      form.reset();

      setFormState((currentState) => ({
        ...currentState,
        [tab.id]: {
          ...(currentState[tab.id] ?? {}),
          isSubmitting: false,
          successMessage:
            (typeof response === "object" && response !== null && response.msg) ||
            "Saved successfully.",
          errorMessage: "",
        },
      }));

      const tabsToRefresh = page.tabs
        .filter((pageTab) => tab.refreshTabsOnSuccess?.includes(pageTab.id))
        .map((pageTab) => loadRowsForTab(pageTab));

      await Promise.all(tabsToRefresh);

      if (tab.redirectTabOnSuccess) {
        setActiveTabId(tab.redirectTabOnSuccess);
      }
    } catch (error) {
      setFormState((currentState) => ({
        ...currentState,
        [tab.id]: {
          ...(currentState[tab.id] ?? {}),
          isSubmitting: false,
          successMessage: "",
          errorMessage:
            error instanceof Error ? error.message : "Unable to submit form.",
        },
      }));
    }
  };

  const handleStatusChange = async (tab, row, checked) => {
    if (!tab.updateStatus || row.blogId === undefined || row.blogId === null) {
      return;
    }

    const activeStatusValue = tab.activeStatusValue ?? "active";
    const inactiveStatusValue = tab.inactiveStatusValue ?? "inactive";
    const nextStatus = checked ? activeStatusValue : inactiveStatusValue;

    setTabState((currentState) => ({
      ...currentState,
      [tab.id]: {
        ...(currentState[tab.id] ?? {}),
        rows: setStatusSwitchDisabled(currentState[tab.id]?.rows ?? [], true),
        isUpdatingStatus: true,
        statusMessage: "",
        statusErrorMessage: "",
      },
    }));

    try {
      const response = await tab.updateStatus(row.blogId, nextStatus);

      setTabState((currentState) => ({
        ...currentState,
        [tab.id]: {
          ...(currentState[tab.id] ?? {}),
          rows: updateStatusRow(currentState[tab.id]?.rows ?? [], row.blogId, nextStatus),
          isUpdatingStatus: false,
          statusMessage:
            (typeof response === "object" && response !== null && response.msg) ||
            "Status updated successfully.",
          statusErrorMessage: "",
        },
      }));
    } catch (error) {
      setTabState((currentState) => ({
        ...currentState,
        [tab.id]: {
          ...(currentState[tab.id] ?? {}),
          rows: setStatusSwitchDisabled(currentState[tab.id]?.rows ?? [], false),
          isUpdatingStatus: false,
          statusMessage: "",
          statusErrorMessage:
            error instanceof Error ? error.message : "Unable to update status.",
        },
      }));

      await loadRowsForTab(tab);
    }
  };

  return (
    <>
      {statusToastMessage ? (
        <div className="app-toast-container" role="status" aria-live="polite">
          <div className="app-toast app-toast-success">{statusToastMessage}</div>
        </div>
      ) : null}
      <PageHeader
        title={page.title}
        toolbarGroups={page.toolbarGroups}
        toolbarState={toolbarState}
        onToolbarAction={handleToolbarAction}
      />
      <TabbedPage
        tabs={page.tabs}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
        renderTabContent={(tab) => {
          if (tab.columns) {
            const state = tabState[tab.id] ?? {
              rows: tab.rows ?? [],
              isLoading: false,
              errorMessage: "",
            };
            const visibleRows = getVisibleRows(tab, state.rows ?? [], toolbarState);

            return (
              <>
                {state.errorMessage ? (
                  <div className="alert alert-danger" role="alert">
                    Failed to load records. {state.errorMessage}
                  </div>
                ) : null}
                {state.statusErrorMessage ? (
                  <div className="alert alert-danger" role="alert">
                    Failed to update status. {state.statusErrorMessage}
                  </div>
                ) : null}
                {state.isLoading ? (
                  <div className="d-flex align-items-center gap-2 text-secondary small mb-3">
                    <div className="spinner-border spinner-border-sm" role="status" />
                    <span>Loading records...</span>
                  </div>
                ) : null}
                {state.isUpdatingStatus ? (
                  <div className="d-flex align-items-center gap-2 text-secondary small mb-3">
                    <div className="spinner-border spinner-border-sm" role="status" />
                    <span>Updating status...</span>
                  </div>
                ) : null}
                {!state.isLoading &&
                !state.errorMessage &&
                visibleRows.length === 0 ? (
                  <div className="alert alert-light border" role="status">
                    {tab.emptyMessage ?? "No records found."}
                  </div>
                ) : null}
                {visibleRows.length > 0 ? (
                  <DataTable
                    columns={tab.columns}
                    rows={visibleRows}
                    onStatusChange={(rowData, _statusValue, checked) =>
                      handleStatusChange(tab, rowData, checked)
                    }
                  />
                ) : null}
              </>
            );
          }

          const tabFormState = formState[tab.id] ?? {
            isSubmitting: false,
            successMessage: "",
            errorMessage: "",
            fieldOptions: {},
            fieldLoading: {},
            fieldErrorMessages: {},
          };
          const resolvedFields = (tab.formFields ?? []).map((field) => {
            if (typeof field.loadOptions !== "function" || !field.name) {
              return field;
            }

            const loadedOptions = tabFormState.fieldOptions[field.name] ?? field.options ?? [];
            const isFieldLoading = Boolean(tabFormState.fieldLoading[field.name]);

            return {
              ...field,
              options: loadedOptions,
              placeholderOption: isFieldLoading
                ? (field.loadingPlaceholderOption ?? "Loading options...")
                : field.placeholderOption,
              disabled:
                Boolean(field.disabled) ||
                isFieldLoading ||
                (field.disableWhenEmptyOptions === true && loadedOptions.length === 0),
            };
          });
          const formFieldErrors = Object.values(
            tabFormState.fieldErrorMessages ?? {},
          ).filter(Boolean);

          return (
            <form onSubmit={(event) => handleFormSubmit(tab, event)}>
              {tabFormState.successMessage ? (
                <div className="alert alert-success" role="status">
                  {tabFormState.successMessage}
                </div>
              ) : null}
              {tabFormState.errorMessage ? (
                <div className="alert alert-danger" role="alert">
                  Failed to submit form. {tabFormState.errorMessage}
                </div>
              ) : null}
              {formFieldErrors.length > 0 ? (
                <div className="alert alert-danger" role="alert">
                  Failed to load form options. {formFieldErrors.join(" ")}
                </div>
              ) : null}
              <div className="row g-2">
                <FormFields fields={resolvedFields} />
                {tabFormState.isSubmitting ? (
                  <div className="col-md-12">
                    <div className="d-flex align-items-center gap-2 text-secondary small">
                      <div className="spinner-border spinner-border-sm" role="status" />
                      <span>Submitting...</span>
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

export default TabbedResourcePage;
