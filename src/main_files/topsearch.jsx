import React from 'react';

function TopSearch({ value, onChange, placeholder = 'Search…', onClear }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:8, width:'100%', maxWidth:420,
      padding:'8px 12px', border:'1px solid #e6e6e8', borderRadius:8, background:'#fff',
      margin:'0 auto'
    }}>
      <span style={{ color:'#6b7280', fontSize:14 }}>Search</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        style={{ flex:1, border:'none', outline:'none', fontSize:14 }}
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={() => onClear ? onClear() : onChange?.('')}
          className="btn ghost"
          style={{ padding:'6px 10px' }}
          aria-label="Clear search"
        >
          Clear
        </button>
      )}
    </div>
  );
}

export default TopSearch;
