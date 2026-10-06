import { sendTab } from "../../common/services/TabApi";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const TabPage = () => {
    const [tabText, setTabText] = useState("E |-------------------|\nB |-------------------|\nG |-------------------|\nD |-------------------|\nA |-------------------|\nE |---1---2---3---4---|");
    const [tempo, setTempo] = useState<number>(60);
    const [title, setTitle] = useState('');
    const [timeBeats, setTimeBeats] = useState('4');
    const [timeValue, setTimeValue] = useState('4');
    const [sliceResolution, setSliceResolution] = useState('16');
    const [instrumentLayout, setInstrumentLayout] = useState('E-B-G-D-A-E');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const clearMessages = () => {
      setError('');
      setSuccess('');
    }

    const setValidTempo = () => {
        const validTempo = Math.max(40, Math.min(tempo, 240));
        setTempo(validTempo);
    }
    const handleInstrumentLayout= (e: React.ChangeEvent<HTMLInputElement>): void => {
        const rawValue: string = e.target.value;
        const filteredValue: string = rawValue.replace(/[^a-gA-G\-]/g, '');
        setInstrumentLayout(filteredValue);
    };

    const handleTabText= (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        const rawValue: string = e.target.value;
        
        // Replace any character NOT in your allowed list with an empty string
        const filteredValue: string = rawValue.replace(/[^0-9a-gA-GqQ#|,\n\s-]/g, '');

        setTabText(filteredValue);
    };

    function transformTabText (stringLayout: string[], sliceResolution: number):string[] {
      //const lines = rawTabBlock.toUpperCase().replace(/\|---/g,'|').trim().split('\n');
      const lines = tabText.toUpperCase().trim().split('\n');

      // Strict Guard: Index and tracking names must align perfectly
      if (lines.length < stringLayout.length) {
        throw new Error(`Información no coincide: Se esperaba ${stringLayout.length} ${stringLayout.length==1?'línea':'líneas'}, pero se ${lines.length==1?'recibió':'recibieron'} ${lines.length}.`);
      }

      const stringData: string[] = Array(stringLayout.length).fill('');

      let stringLineIndex = 0; //keeps track of actual string text lines

      //Validate each text line and after that put them on 
      //the string array data if applicable
      for(let i = 0; i < lines.length;i++){
        if (lines[i].match(/^\s*$/)) {
            continue; 
        }
        let stringIndex = stringLineIndex % stringLayout.length;
        stringLineIndex++;
        const expectedStringName = stringLayout[stringIndex].toUpperCase();
        // Alignment check: Ensure line matches your layout profile tuning name
        const match = lines[i].trim().match(/^([A-G](?:B|#)?)\s*\|/);

        if (!match || match[1] !== expectedStringName) {
            throw new Error(`Error de alineación en la línea ${i + 1}: Se esperaba la cuerda de ${expectedStringName}`);
        }

        const noStringName = lines[i].trim().replace(match[1], '').replaceAll('|---','|');
        let measureIndex = 0;
        console.log('noStringName ' + noStringName);
        noStringName.split("|").forEach(
            measure => {
              measure = measure.replace(/\d{2}/g, '-');
              measure = measure.replace(/,|\||\s/g, '');
              console.log('measure ' + measure);
              if(measure.length != 0 && measure.length != sliceResolution){
                  throw new Error(`El compas ${measureIndex} tiene una resolucción de ${measure.length} en lugar de ${sliceResolution}`);       
                }
              measureIndex++;
            }
        );

        stringData[stringIndex] += noStringName;
      }

      return stringData;

    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => { 
    e.preventDefault(); 
    clearMessages();  

    if (!title.trim() || !tabText.trim()) {
      setError("El título es obligatorio");
      return;
    } 

    try {
      const layout = instrumentLayout.split('-');
      const resolution = Number(sliceResolution);
      const stringData = transformTabText(layout,resolution);
      if (error) {
        return;
      } 
      const result = await sendTab(
          uuidv4(),
          title, 
          tempo,
          Number(timeBeats),
          Number(timeValue),
          //Number(sliceResolution),
          resolution,
          //instrumentLayout.split('-'),
          layout,
          //tabText,
          stringData
      );

      if (result?.$metadata?.httpStatusCode !== 200) { 
        setError("No se pudo enviar el tab");
        console.log(result);
      } else {
        setSuccess('Se envio el tab');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error inesperado!!");
      }
      console.log(error);
    }
    
  };

   return (
    <div className="tab-editor">
      <form className="tab-editor" onSubmit={handleSubmit}>
        <h2 className="login-admin-title">Ingresa la información del tab</h2>
       
        {/* Display Status Messages */}
        {error && <div className="login-admin-error">{error}</div>}
        {success && <div className="login-admin-success">{success}</div>}
        <div >
          <label htmlFor="tab-title-text">Ingresa el título</label>
          <br/>
          <input
            className="tab-editor-input"
            id="tab-title-text"
            placeholder="Título"
            value={title}
            onChange={(e) => { 
              clearMessages(); 
              setTitle(e.target.value);
            }}
          />
        </div>
        <div >
          <label htmlFor="tempo-text">Ingresa el tiempo (40 bpm a 240 bpm)</label>
          <br/>
          <input
            className="tab-editor-small-input"
            style={{ width: '78px' }}
            id="tempo-text"
            placeholder="60"
            type="number" 
            min ={40}
            max ={240}
            value={tempo}
            onChange={(e) => {
                clearMessages(); 
                const val = e.target.value;                       
                setTempo(val === '' ? 0 : Number(val));
            }}
            onBlur={setValidTempo} 
          />
        </div>

        <div >
          <label htmlFor="time-beats-text">Ingresa la cantidad de tiempos</label>
          <br/>
           <select
            className="tab-editor-small-input"
            id="time-beats-text"
            value={timeBeats}
            onChange={(e) => {
              clearMessages();
              setTimeBeats(e.target.value);
            }}
        >           
            {timeValue === '4' && [
            <option value="2">2</option>,
            <option value="3">3</option>,
            <option value="4">4</option>
          ]}

          {timeValue === '8' && [
            <option value="3">3</option>,
            <option value="6">6</option>
          ]}
        </select>
        </div>

        <div >
          <label htmlFor="time-value-text">Ingresa el valor del tiempo</label>
          <br/>
           <select
            className="tab-editor-small-input"
            id="time-value-text"
            value={timeValue}
            onChange={(e) => {
              clearMessages();
              setTimeValue(e.target.value);
            }}
        >
            <option value="4">4</option>
            <option value="8">8</option>
        </select>
        </div>
        <div >
          <label htmlFor="tab-resolution-text">Ingresa la resolución </label>
          <br/>
          <select
            className="tab-editor-small-input"
            id="tab-resolution-text"
            value={sliceResolution}
            onChange={(e) => {
              clearMessages();
              setSliceResolution(e.target.value);
            }}
        >
            
            {timeValue === '4' && [
            <option value="4">4</option>,
            <option value="8">8</option>,
            <option value="16">16</option>,
            <option value="32">32</option>,
            <option value="64">64</option>
          ]}

          {timeValue === '8' && [
            <option value="8">8</option>,
            <option value="16">16</option>,
            <option value="32">32</option>,
            <option value="64">64</option>,
            <option value="128">128</option>
          ]}
        </select>
        </div>

         <div >
          <label htmlFor="instrument-layout-text">Ingresa las cuerdas de tu instrumento</label>
          <br/>
          <input
            className="tab-editor-small-input"
            style={{ width: '150px' }}
            id="instrument-layout-text"
            placeholder="E-B-G-D-A-E"
            value={instrumentLayout}
            onChange={(e) => {
              clearMessages();
              handleInstrumentLayout(e);
            }}
          />
        </div>

        <div >
          <label htmlFor="tab-text">Ingresa el tab</label>
          <br/>
          <textarea
            className="tab-editor-big-input"
            rows={15} 
            cols={100} 
            id="tab-text"
            placeholder="TAB"
            value={tabText}
            onChange={(e) => {
              clearMessages();
              handleTabText(e);
            }}
            style={{ overflow: 'auto', whiteSpace: 'pre' }}
          />
        </div>
        <button className="tab-editor-button" type="submit" >Enviar</button>
     

      </form>
    </div>
   )
}
