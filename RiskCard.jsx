const RISK_LABELS = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
};

function RiskCard({ title, riskLevel = 'low', value, description, footer }) {
  const normalizedLevel = ['low', 'medium', 'high'].includes(riskLevel)
    ? riskLevel
    : 'low';

  return (
    <article className="risk-card" aria-label={title}>
      <div className="risk-card__header">
        <h3 className="risk-card__title">{title}</h3>
        <span className={`risk-card__badge risk-card__badge--${normalizedLevel}`}>
          {RISK_LABELS[normalizedLevel]}
        </span>
      </div>

      {value !== undefined && value !== null && (
        <div className={`risk-card__value risk-card__value--${normalizedLevel}`}>
          {value}
        </div>
      )}

      {description && <p className="risk-card__description">{description}</p>}

      {footer && (
        <div className="risk-card__footer">
          <p className="risk-card__footer-text">{footer}</p>
        </div>
      )}
    </article>
  );
}

export default RiskCard;
