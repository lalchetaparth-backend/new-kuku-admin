function Toolbar({ groups, state = {}, onAction }) {
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
      const selectedValue = group.id ? state[group.id] : undefined;

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
              <li key={`${group.id ?? index}-${item.value ?? item.label}`}>
                <button
                  type="button"
                  className={`dropdown-item ${
                    selectedValue === (item.value ?? item.label) ? "active" : ""
                  }`}
                  onClick={() =>
                    onAction?.(group.id, item.value ?? item.label, item)
                  }
                >
                  {item.label}
                </button>
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
