/** The logo's three colours, laid flat across the full width. */
export default function BrandBar() {
  return (
    <div className="flex h-1" aria-hidden="true">
      <i className="flex-5 bg-brand-blue" style={{ flex: 5 }} />
      <i className="bg-brand-amber" style={{ flex: 2 }} />
      <i className="bg-brand-red" style={{ flex: 3 }} />
    </div>
  )
}
