import Toolbar from "./Toolbar";

function PageHeader({
  title,
  toolbarGroups = [],
  toolbarState = {},
  onToolbarAction,
}) {
  return (
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 className="h2">{title}</h1>
      {toolbarGroups.length > 0 ? (
        <div className="btn-toolbar mb-2 mb-md-0">
          <Toolbar
            groups={toolbarGroups}
            state={toolbarState}
            onAction={onToolbarAction}
          />
        </div>
      ) : null}
    </div>
  );
}

export default PageHeader;
