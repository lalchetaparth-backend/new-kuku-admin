function Toolbar({ groups }) {
  return groups.map((group, index) => {
    if (group.type === "buttons") {
      return (
        <div className={group.className} key={`toolbar-group-${index}`}>
          {group.items.map((item) => (
            <button
              type="button"
              className={item.buttonClass}
              key={item.label}
              onClick={(event) => event.preventDefault()}
            >
              {item.iconClass ? <i className={item.iconClass} /> : null}
              {item.iconClass ? " " : null}
              {item.label}
            </button>
          ))}
        </div>
      );
    }

    if (group.type === "dropdown") {
      return (
        <div className={group.className} key={`toolbar-group-${index}`}>
          <button
            type="button"
            className={group.buttonClass}
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {group.iconClass ? <i className={group.iconClass} /> : null}
            {group.iconClass ? " " : null}
            {group.label}
          </button>
          <ul className="dropdown-menu">
            {group.items.map((item) => (
              <li key={item.label}>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={(event) => event.preventDefault()}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return null;
  });
}

export default Toolbar;
