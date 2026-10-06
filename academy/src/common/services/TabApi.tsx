import { AWS_REGION, ACADEMY_VALIDATION_URL,IDENTITY_POOL_ID, USER_POOL_ID } from '../../config';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { encodeTab,decodeTab, type TabDataRequestPayload,type TabDataResponsePayload } from '../components/TabEncoderDecoder';
import { getIdToken} from '../components/useAuth';

const getDocClient = () => {
  const idToken = getIdToken();
  if (!idToken) throw new Error("ID Token not initialized.");

  const client = new DynamoDBClient({
    region: AWS_REGION,
    ...(ACADEMY_VALIDATION_URL && { endpoint: ACADEMY_VALIDATION_URL }), 
    credentials: fromCognitoIdentityPool({
      clientConfig: { 
        region: AWS_REGION, 
        ...(ACADEMY_VALIDATION_URL && { endpoint: ACADEMY_VALIDATION_URL })
      },
      identityPoolId: IDENTITY_POOL_ID,
      logins: {
        [`${ACADEMY_VALIDATION_URL}/${USER_POOL_ID}`]: idToken
      },
    }),
  });

  return DynamoDBDocumentClient.from(client);
};


export const sendTab = async (
    songId: string,
    title: string,
    tempo: number,
    timeBeats: number,
    timeValue: number,
    sliceResolution: number,
    stringLayout: string[],
    //rawTabBlock: string
    stringData: string[]
): Promise<any>  => {
    const encodedData = encodeTab({
    songId,
    title,
    tempo,
    timeBeats,
    timeValue,
    sliceResolution,
    stringLayout,
    //rawTabBlock
    stringData
  });

  const docClient = getDocClient();

  return await docClient.send(
    new PutCommand({
      TableName: "Songs", 
      Item: {
        ...encodedData}
    })
  );
};


export const getTabs = async (

): Promise<TabDataResponsePayload[]>  => {
 

  const docClient = getDocClient();

  const result = await docClient.send(
  new ScanCommand({
    TableName: "Songs"
  })
);

console.log("Raw Scan Results:", JSON.stringify(result.Items, null, 2));
const transformedResults: TabDataResponsePayload[] = (result.Items || []).map((item) => decodeTab(item as TabDataRequestPayload));

console.log("Transformed Scan Results:", JSON.stringify(transformedResults, null, 2));
return transformedResults;
};
