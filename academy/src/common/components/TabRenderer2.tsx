

export function TabRenderer2({ tabText }:any) {
  if (!tabText) return <p>No tab data available.</p>;

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
        {formatTabWithBreaks(tabText, 5)}
      </pre>
    </div>
  );
}
  const formatTabWithBreaks = (rawText: string, measuresPerLine = 3) => {
    const lines = rawText.split('\n');
    const headerLines = lines.filter(line => line.startsWith('Tempo:') || line.startsWith('Time:'));
    const tabLines = lines.filter(line => !line.startsWith('Tempo:') && !line.startsWith('Time:') && line.trim() !== '');

    if (tabLines.length === 0) return rawText;

    // Isolate the 6 strings + the 1 timing line (7 tracks total)
    const stringTracks = tabLines.map(line => {
      const parts = line.split('|');
      const label = parts[0]; // e.g., "E " or "    "
      // Split the actual musical content by bars, filtering out empty items
      const measures = parts.slice(1).map(m => m.trim()).filter(m => m !== '');
      return { label, measures };
    });

    const totalMeasures = stringTracks[0].measures.length;
    let formattedResult = [...headerLines, ''].join('\n') + '\n';

    // Loop through the total measures chunking them based on measuresPerLine
    for (let i = 0; i < totalMeasures; i += measuresPerLine) {
      stringTracks.forEach(track => {
        const chunk = track.measures.slice(i, i + measuresPerLine);
        if (chunk.length > 0) {
          // Reconstruct the staff block with bounding vertical lines |
          const isTimingLine = track.label.trim() === '';
          const separator = isTimingLine ? '   ' : '|';
          formattedResult += `${track.label}${separator}---${chunk.join('---|---')}---${separator}\n`;
        }
      });
      formattedResult += '\n'; // Add spacing between stacked blocks
    }

    return formattedResult;
  };
