import { useState, useEffect } from 'react';
import { mockDynamoDB } from '../../../common/mocks/mockDynamoDB';
import {TabRenderer}  from '../../../common/components/TabRenderer';
import { getTabs } from '../../../common/services/TabApi';
import type { TabDataResponsePayload } from '@/common/components/TabEncoderDecoder';

export const CourseSupportPage = () => {
  const [song, setSong] = useState<any>(null);
  const [tab, setTab] = useState<TabDataResponsePayload | null>(null);
  const [tabs, setTabs] = useState<TabDataResponsePayload[] | null>(null);
  useEffect(() => {
    const databaseResult = mockDynamoDB["SONG#101"];
    setSong(databaseResult);
  }, []);

  const lookForTabs = async () =>{
    const newTabs:TabDataResponsePayload[] = await getTabs();
    setTabs(newTabs);
    console.log('lookForTabs: '+ newTabs);
  }

  const handleTabSelection= (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTab = tabs?.find((value) => value.SongId === event.target.value);
    console.log("selectedTab " + selectedTab)
    if (selectedTab) {
      setTab(selectedTab);
    }else{
      setTab(null);
    }
  };

  if (!song) return <div>Loading mocked DynamoDB item...</div>;

  return (
    <div className="tab-editor" style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Selecciona el tab de la lista</h1>
           <div >
           <select
            className="tab-editor-input"
            id="tab-title-selector"
             onChange={handleTabSelection}
        >           
           <option value="" >-- Selecciona una opción --</option>
        
        {tabs?.map((tab) => (
          <option key={tab.SongId} value={tab.SongId}>
            {tab.Title}
          </option>
        ))}
        </select>
        </div>

      <TabRenderer tab={tab} />

      <button className="tab-editor-button" onClick={(e) => lookForTabs()} >Buscar Tabs</button>
    </div>
  );
};

