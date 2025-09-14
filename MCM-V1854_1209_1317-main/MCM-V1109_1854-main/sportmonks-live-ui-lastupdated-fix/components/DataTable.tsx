export default function DataTable({rows,hidden}:Props){
  const [sortCol,setSortCol] = useState<string|null>(null);
  const [sortDir,setSortDir] = useState<'asc'|'desc'>('asc');

  if(!rows.length) return <div>No fixtures in play.</div>;

  // Build all columns
  let cols = Object.keys(rows[0]).filter(c => c === 'Period' || !hidden[c]);

  // Force WPI placement (after Speed\nAcum, before Blocked Value\nHome)
  const idx = cols.indexOf("Speed\nAcum");
  if (idx !== -1) {
    // remove existing if present
    cols = cols.filter(c => c !== "WPI\nHome" && c !== "WPI\nAway");
    // insert after Speed\nAcum
    cols.splice(idx + 1, 0, "WPI\nHome", "WPI\nAway");
  }

  const columns = cols;

  function handleSort(col:string){
    if(sortCol===col){
      setSortDir(sortDir==='asc'?'desc':'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  }

  const sortedRows=[...rows].sort((a,b)=>{
    if(!sortCol) return 0;
    const valA=a[sortCol]; const valB=b[sortCol];

    if(sortCol==='Time'){
      const tA=parseInt(String(valA).replace(/'/g,''))||0;
      const tB=parseInt(String(valB).replace(/'/g,''))||0;
      return sortDir==='asc'?tA-tB:tB-tA;
    }

    const numA=parseFloat(valA)||0;
    const numB=parseFloat(valB)||0;
    return sortDir==='asc'?numA-numB:numB-numA;
  });

  return(
    <div style={{overflow:'auto',maxHeight:'80vh'}}>
      <table style={{borderCollapse:'collapse',width:'100%'}}>
        <thead>
          <tr>
            {columns.map(c=>(
              <th
                key={c}
                onClick={()=>handleSort(c)}
                style={{
                  position:'sticky',
                  top:0,
                  background:'#12172a',
                  color
