function Icon({ symbol, iconClass, className = "" }) {
  if (symbol) {
    return (
      <svg className={`bi ${className}`.trim()} aria-hidden="true">
        <use xlinkHref={`#${symbol}`} />
      </svg>
    );
  }

  if (iconClass) {
    return <i className={`${iconClass} ${className}`.trim()} aria-hidden="true" />;
  }

  return null;
}

export default Icon;
