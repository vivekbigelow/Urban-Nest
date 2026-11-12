type FormSectionProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
};

export default function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="form-section">
      {(title || description) && (
        <header className="form-section-header">
          {title && (
            <div className="flex items-center gap-2">
              <h2 className="form-section-title">{title}</h2>
            </div>
          )}

          {description && (
            <p className="form-section-description">{description}</p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
