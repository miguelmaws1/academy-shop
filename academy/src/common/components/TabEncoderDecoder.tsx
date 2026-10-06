import * as pako from 'pako';

export interface TabDataRequestPayload {
    SongId: string;
    Title: string;
    Tempo: number;
    TimeBeats: number;
    TimeValue: number;
    SliceResolution: number;
    InstrumentLayout: string[];
    SingleTimelineBlock: string; // The ultra-dense Base64 string for DynamoDB
}

export interface TabDataResponsePayload {
    SongId: string;
    Title: string;
    Tempo: number;
    TimeBeats: number;
    TimeValue: number;
    SliceResolution: number;
    InstrumentLayout: string[];
    TimelineBlock: string[];// The ultra-dense Base64 string for DynamoDB
}

// export function fake (rawTabBlock: string, stringLayout: string[], sliceResolution: number):string[] {
//    //const lines = rawTabBlock.toUpperCase().replace(/\|---/g,'|').trim().split('\n');
//     const lines = rawTabBlock.toUpperCase().trim().split('\n');

//     // Strict Guard: Index and tracking names must align perfectly
//     if (lines.length < stringLayout.length) {
//         throw new Error(`Información no coincide: Se esperaba ${stringLayout.length} ${stringLayout.length==1?'línea':'líneas'}, pero se ${lines.length==1?'recibió':'recibieron'} ${lines.length}.`);
//     }

//     const stringData: string[] = Array(stringLayout.length).fill('');

//     let stringLineIndex = 0; //keeps track of actual string text lines

//     //Validate each text line and after that put them on 
//     //the string array data if applicable
//     for(let i = 0; i < lines.length;i++){
//         if (lines[i].match(/^\s*$/)) {
//             continue; 
//         }
//         let stringIndex = stringLineIndex % stringLayout.length;
//         stringLineIndex++;
//         const expectedStringName = stringLayout[stringIndex].toUpperCase();
//         // Alignment check: Ensure line matches your layout profile tuning name
//         const match = lines[i].trim().match(/^([A-G](?:B|#)?)\s*\|/);

//         if (!match || match[1] !== expectedStringName) {
//             throw new Error(`Error de alineación en la línea ${i + 1}: Se esperaba la cuerda de "${expectedStringName}"`);
//         }

//         const noStringName = lines[i].trim().replace(match[1], '').replaceAll('|---','|');
//         let measureIndex = 0;
//         console.log('noStringName ' + noStringName);
//         noStringName.split("|").forEach(
//             measure => {
//                measure = measure.replace(/\d{2}/g, '-');
//                measure = measure.replace(/,|\||\s/g, '');
//                console.log('measure ' + measure);
//                if(measure.length != 0 && measure.length != sliceResolution){
//                   throw new Error(`El compas ${measureIndex} tiene una resolucción de ${measure.length} en lugar de ${sliceResolution}`);       
//                }
//                measureIndex++;
//             }
//         );

//         stringData[stringIndex] += noStringName;
//     }
    
//     return stringData;

// }

/**
 * ENCODER: Takes the raw human text layout, processes it horizontally, 
 * maps notes to 0-31 byte states, compresses it once, and wraps it as Base64 text.
 */
export function encodeTab(params: {
    songId: string;
    title: string;
    tempo: number;
    timeBeats: number;
    timeValue: number;
    sliceResolution: number;
    stringLayout: string[]; // e.g., ["E", "B", "G", "D", "A", "E"]
//     rawTabBlock: string;
    stringData: string[];
}): TabDataRequestPayload {
   // const { songId, title, tempo, timeBeats, timeValue, sliceResolution, stringLayout, rawTabBlock } = params;
    const { songId, title, tempo, timeBeats, timeValue, sliceResolution, stringLayout, stringData } = params;
     
    //const stringData = fake(rawTabBlock, stringLayout, sliceResolution);
    // Determine horizontal timeline length based on the first line
    const firstLineTokens = stringData[0].replace(/^[A-G](B|#)?\s*\|/, '').match(/(\d+|-)/g) || [];
    const totalSlices = firstLineTokens.length;
    const totalBytesNeeded = stringLayout.length * totalSlices;

    // Allocate flat, raw 8-bit memory buffer
    const giantMergedBuffer = new Uint8Array(totalBytesNeeded);
    let insertIndex = 0;

    // Process strings horizontally by synchronized index mapping
    for (let i = 0; i < stringLayout.length; i++) {      
        const rawLine = stringData[i];
        console.log("rawLine " + rawLine)
        
        const cleanText = rawLine.replace(/^[A-G](B|#)?\s*|/, '');
        console.log("cleanText " + cleanText)

        const tokens = cleanText.match(/(\d+|-)/g) || [];
        console.log("tokens " + tokens);
        tokens.forEach(token => {
            if (token === '-') {
                giantMergedBuffer[insertIndex] = 0;  // 0 represents absolute silence
            } else {
                const fret = parseInt(token, 10);
                if (fret === 0) {
                    giantMergedBuffer[insertIndex] = 31; // 31 represents an open string
                } else {
                    giantMergedBuffer[insertIndex] = fret; // Direct fret number byte value (e.g. 12 -> 12)
                }
            }
            insertIndex++;
        });
    }

    // Compress numbers directly via native GZIP and encode to safe text string
    const compressedBytes = pako.gzip(giantMergedBuffer);
    
    let binaryString = '';
    for (let i = 0; i < compressedBytes.length; i++) {
        binaryString += String.fromCharCode(compressedBytes[i]);
    }

    return {
        SongId: songId,
        Title: title,
        Tempo: tempo,
        TimeBeats: timeBeats,
        TimeValue: timeValue,
        SliceResolution: sliceResolution,
        InstrumentLayout: stringLayout, 
        SingleTimelineBlock: btoa(binaryString)
    };
}

/**
 * DECODER: The exact mathematical opposite of the encoder. 
 * Unpacks the Base64 string out of the database, runs decompression, 
 * and maps the 0-31 byte states right back into flat text strings.
 */
export function decodeTab(payload: TabDataRequestPayload): TabDataResponsePayload {
    const { SingleTimelineBlock, InstrumentLayout, ...rest } = payload;

    // 1. Unpack Base64 text back into raw compressed binary bytes
    
    const binaryString = atob(SingleTimelineBlock);
    const rawCompressedBytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        rawCompressedBytes[i] = binaryString.charCodeAt(i);
    }

    // 2. Unzip GZIP straight back into our raw 0-31 numbers memory buffer
    const pureTimelineBuffer = pako.ungzip(rawCompressedBytes);

    // 3. Slice the flat array back into equal track segment lengths
    const numStrings = InstrumentLayout.length;
    const bytesPerStringTrack = pureTimelineBuffer.length / numStrings;
    const readableTextRows: string[] = [];

    for (let i = 0; i < numStrings; i++) {
        const start = i * bytesPerStringTrack;
        let textRow = "";

        // 4. Exact Reversal: Reconstruct the flat text track strings
        for (let tick = 0; tick < bytesPerStringTrack; tick++) {
            const byteValue = pureTimelineBuffer[start + tick];

            if (tick > 0) {
                const prevByteValue = pureTimelineBuffer[start + tick - 1];
                // If both are numbers, inject the comma before adding the new number string
                if (prevByteValue !== 0 && byteValue !== 0) {
                    textRow += ',';
                }
            }

            if (byteValue === 0) {
                textRow += '-';  // 0 maps directly back to a dash '-'
            } else if (byteValue === 31) {
                textRow += '0';  // 31 maps directly back to an open string '0'
            } else {
                textRow += byteValue.toString(); // 12 maps directly back to the text characters "12"
            }
            
        }
        
        readableTextRows.push(textRow);
    }

    return {
    ...rest,
    InstrumentLayout,
    TimelineBlock: readableTextRows
  };// Returns: ["---12--9---", "-----------", "-----------"]
}
