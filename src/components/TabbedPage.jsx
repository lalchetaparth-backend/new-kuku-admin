import { useState } from "react";

function TabbedPage({ tabs, renderTabContent }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  return (
    <>
      <ul className="nav nav-pills mb-3" role="tablist">
        {tabs.map((tab) => (
          <li className="nav-item" role="presentation" key={tab.id}>
            <button
              className={`nav-link rounded-pill ${activeTab === tab.id ? "active" : ""}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
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
            className={`tab-pane fade ${activeTab === tab.id ? "show active" : ""}`}
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
