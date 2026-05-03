import { useEffect, useState } from "react";

function TabbedPage({ tabs, activeTabId, onTabChange, renderTabContent }) {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id);
  const resolvedActiveTab = activeTabId ?? internalActiveTab;

  useEffect(() => {
    if (activeTabId !== undefined) {
      return;
    }

    setInternalActiveTab(tabs[0]?.id);
  }, [activeTabId, tabs]);

  const handleTabChange = (tabId) => {
    if (activeTabId === undefined) {
      setInternalActiveTab(tabId);
    }

    onTabChange?.(tabId);
  };

  return (
    <>
      <ul className="nav nav-pills mb-3" role="tablist">
        {tabs.map((tab) => (
          <li className="nav-item" role="presentation" key={tab.id}>
            <button
              className={`nav-link rounded-pill ${resolvedActiveTab === tab.id ? "active" : ""}`}
              type="button"
              role="tab"
              aria-selected={resolvedActiveTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content mb-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-pane fade ${resolvedActiveTab === tab.id ? "show active" : ""}`}
            role="tabpanel"
            tabIndex={0}
          >
            {renderTabContent(tab)}
          </div>
        ))}
      </div>
    </>
  );
}

export default TabbedPage;
