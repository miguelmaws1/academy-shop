import type { TabDataResponsePayload } from "./TabEncoderDecoder";


// export function TabRenderer({ lines, stringLayout }: { lines?: string[]; stringLayout?: string[] }) {



//   if (!lines || !stringLayout) return <p>No tab data available.</p>;
export function TabRenderer({ tab }: { tab?: TabDataResponsePayload  | null }) {
  
  // 1. Guard check: Make sure we have tab data and lines to render
  if (!tab?.TimelineBlock || !tab?.InstrumentLayout) {
    return <p>No tab data available.</p>;
  }

  // 2. Extract arrays cleanly for your inner logic
  const lines = tab.TimelineBlock;
  const stringLayout = tab.InstrumentLayout || [];
  return (
    <div style={{
      background: '#1e1e1e',
      color: '#a9ffb4',
      padding: '1.5rem',
      borderRadius: '8px',
      overflowX: 'auto',
      boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
    }}>
      <pre style={{
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '1.1rem',
        lineHeight: '1.5',
        margin: 0,
        whiteSpace: 'pre'
      }}>
        <h1>Título: {tab.Title}</h1>
        <h1>Tiempo: {tab.Tempo}</h1>
        <h1>Tipo de compás: {tab.TimeBeats}/{tab.TimeValue}</h1>
        <br></br>
        {formatTabWithBreaks(lines, stringLayout,tab.SliceResolution)}
      </pre>
    </div>
  );
}
  const formatTabWithBreaks2 = (lines: string[],  stringLayout: string[], sliceResolution: number, measuresPerLine = 3) => {
    //const headerLines = lines.filter(line => line.startsWith('Tempo:') || line.startsWith('Time:'));
   // const tabLines = lines.filter(line => !line.startsWith('Tempo:') && !line.startsWith('Time:') && line.trim() !== '');

    console.log("lines ",lines);

    if (lines.length === 0 || stringLayout.length === 0) return "";

    // Isolate the 6 strings + the 1 timing line (7 tracks total)
    // const stringTracks = tabLines.map(line => {
    //   const parts = line.split('|');
    //   const label = parts[0]; // e.g., "E " or "    "
    //   // Split the actual musical content by bars, filtering out empty items
    //   const measures = parts.slice(1).map(m => m.trim()).filter(m => m !== '');
    //   return { label, measures };
    // });
    let stringIndex = 0;
    const stringTracks = stringLayout.map(label => {
      let measures: string[] = [];
     
      let i = 0;
      const targetLine = lines[stringIndex];

      while (i < targetLine.length) {
        measures.push(targetLine.slice(i, i + sliceResolution));
        i += sliceResolution;
      }
      stringIndex++;
      return { label, measures };
    });

    const totalMeasures = stringTracks[0].measures.length;
   //const totalMeasures = stringTracks[0] ? Math.max(0, stringTracks[0].split('|').length - 2) : 0;

    //let formattedResult = [...headerLines, ''].join('\n') + '\n';
    let formattedResult = '';
    // Loop through the total measures chunking them based on measuresPerLine
    for (let i = 0; i < totalMeasures; i += measuresPerLine) {
      stringTracks.forEach(track => {
        const chunk = track.measures.slice(i, i + measuresPerLine);
        if (chunk.length > 0) {
          // Reconstruct the staff block with bounding vertical lines |
          const isTimingLine = track.label.trim() === '';
          const separator = isTimingLine ? '   ' : '|';
          formattedResult += `${track.label} ${separator}---${chunk.join('|')}---${separator}\n`;
        }
      });
      formattedResult += '\n'; // Add spacing between stacked blocks
    }

    return formattedResult;
  };


  const formatTabWithBreaks = (lines: string[],  stringLayout: string[], sliceResolution: number, measuresPerLine = 3) => {
   console.log("lines ",lines);

    if (lines.length === 0 || stringLayout.length === 0) return "";

    let stringIndex = 0;
    // const stringTracks = stringLayout.map(label => {
    let stringTracks: any[]  = stringLayout.map(label => {
     
      const targetLine = lines[stringIndex];
   
     const tokens = targetLine.match(/(\d+,?|-)/g) || [];

      stringIndex++;
      return { label, tokens };
     // return { label, measures};
    });

     console.log("stringTracks ",stringTracks);

  const totalTokens = stringTracks[0].tokens.length
   //Visually Align measures
   for (let i = 0; i < totalTokens; i ++) { 
        // Find Max length
        let max = 0;
        for(let j=0; j < stringLayout.length; j++){
            max = Math.max(max,stringTracks[j].tokens[i].length);
        }
        console.log(" max " +  max);
        if(max > 1){
          for(let j=0; j < stringLayout.length; j++){
            stringTracks[j].tokens[i] = stringTracks[j].tokens[i].padEnd(max, ' ');
            
          }
        }
        
   }
   stringTracks = stringTracks.map(({ label, tokens })=> {
      const measures = Array.from(
        { length: Math.ceil(tokens.length / sliceResolution) },
        (_, i) => tokens.slice(i * sliceResolution, (i + 1) * sliceResolution).join('')
      );

      return { label, measures};
    });

   const totalMeasures = stringTracks[0].measures.length;
   //const totalMeasures = stringTracks[0] ? Math.max(0, stringTracks[0].split('|').length - 2) : 0;

    //let formattedResult = [...headerLines, ''].join('\n') + '\n';
    let formattedResult = '';
    // Loop through the total measures chunking them based on measuresPerLine
    for (let i = 0; i < totalMeasures; i += measuresPerLine) {
      stringTracks.forEach(track => {
        const chunk = track.measures.slice(i, i + measuresPerLine);
        if (chunk.length > 0) {
          // Reconstruct the staff block with bounding vertical lines |
          formattedResult += `${track.label} |---${chunk.join('|---')}|\n`;
        }
      });
      formattedResult += '\n'; // Add spacing between stacked blocks
    }

    return formattedResult;
  };
