import { dashboardPageData } from "../data/dashboardData";
import useDocumentTitle from "../hooks/useDocumentTitle";
import PageHeader from "../components/PageHeader";

function DashboardPage() {
  useDocumentTitle(dashboardPageData.documentTitle);

  return (
    <>
      <PageHeader title={dashboardPageData.title} />
      <div className="row">
        {dashboardPageData.stats.map((stat) => (
          <div className="col-md-3" key={stat.title}>
            <div className={`${stat.bgClass} px-3 py-2 rounded-4 text-white`}>
              <div className="row">
                <div className="col-md-2">
                  <i className={stat.iconClass} />
                </div>
                <div className="col-md-8">
                  <h6>{stat.title}</h6>
                  <h3>{stat.value}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default DashboardPage;
