import CheckboxGroup from "./CheckboxGroup";
import DatePicker from "./DatePicker";
import Button from "../../components/ui/Button";
import styles from "./FiltersPanel.module.css";

function getFormatsForVenues(venues, venuesSlugs) {
  if (venuesSlugs.length === 0) return null;
  const chosen = venues.filter((venue) => venuesSlugs.includes(venue.slug));
  return new Set(
    chosen.flatMap((venue) => venue.formats.map((format) => format.slug)),
  );
}
function splitBandLabel(label) {
  const match = label.match(/^(.+?)\s*\((.+)\)$/);
  return match ? { label: match[1], hint: match[2] } : { label };
}
function FiltersPanel({
  options,
  filters,
  dates,
  activeCount,
  onChange,
  onClear,
}) {
  const allowedFormats = getFormatsForVenues(options.venues, filters.venues);
  const visibleFormats = allowedFormats
    ? options.formats.filter((format) => allowedFormats.has(format.slug))
    : options.formats;

  function handleVenuesChange(venues) {
    const allowed = getFormatsForVenues(options.venues, venues);
    const formats = allowed
      ? filters.formats.filter((slug) => allowed.has(slug))
      : filters.formats;
    onChange({ venues, formats }); //one url update - one history entry
  }
  return (
    <aside className={styles.panel}>
      <h2 className={styles.heading}>Filters</h2>

      <div className={styles.section}>
        <CheckboxGroup
          title="Venue"
          options={options.venues.map((v) => ({
            value: v.slug,
            label: v.name,
            hint: v.city,
          }))}
          selected={filters.venues}
          onChange={handleVenuesChange}
        />
      </div>
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Date</p>
        <DatePicker
          size="small"
          dates={dates}
          value={filters.date}
          onChange={(date) => onChange({ date })}
        />
      </div>
      <div className={styles.section}>
        <CheckboxGroup
          title="Format"
          options={visibleFormats.map((f) => ({
            value: f.slug,
            label: f.name,
          }))}
          selected={filters.formats}
          onChange={(formats) => onChange({ formats })}
        />
      </div>
      <div className={styles.action}>
        <CheckboxGroup
          title="Language"
          options={options.language.map((l) => ({
            value: l.slug,
            label: l.name,
          }))}
          selected={filters.languages}
          onChange={(languages) => onChange({ languages })}
        />
      </div>
      <div className={styles.section}>
        <CheckboxGroup
          title="Time of day"
          options={options.timeBands.map((b) => ({
            value: b.id,
            ...splitBandLabel(b.label),
          }))}
          selected={filters.bands}
          onChange={(bands) => onChange({ bands })}
        />
      </div>
      <div className={`${styles.section} ${styles.footer}`}>
        {activeCount > 0 && (
          <Button variant="outline" fullWidth onClick={onClear}>
            Clear filters
          </Button>
        )}
        <p className={styles.count}>
          {activeCount} {activeCount === 1 ? "filter" : "filters"} active
        </p>
      </div>
    </aside>
  );
}

export default FiltersPanel;
