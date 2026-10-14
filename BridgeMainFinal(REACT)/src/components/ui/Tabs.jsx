/**
 * Accessible tabs, split in two so the layout stays identical to the original
 * markup (the tab buttons live in the page header, the panels further down).
 *
 *   const [tab, setTab] = useState('find');
 *   <TabList tabs={[{ id:'find', label:'Find a Ride' }, ...]} active={tab} onChange={setTab} idPrefix="tab" />
 *   <TabPanel active={tab === 'find'}> ... </TabPanel>
 *
 * Inactive panels stay mounted (just hidden) so filters / typed text survive
 * switching tabs.
 */
export function TabList({ tabs, active, onChange, className = 'carpool-tabs', idPrefix = 'tab' }) {
  return (
    <div className={className} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          id={`${idPrefix}-${tab.id}`}
          aria-selected={active === tab.id}
          className={`tab-btn${active === tab.id ? ' active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function TabPanel({ active, children, id }) {
  return (
    <div id={id} role="tabpanel" className="tab-content" style={active ? undefined : { display: 'none' }}>
      {children}
    </div>
  );
}
