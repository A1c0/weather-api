import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import {marshall} from '@aws-sdk/util-dynamodb';
import {APIGatewayProxyResultV2} from 'aws-lambda';
import ky from 'ky';

async function pushItemInCache(hour: string, data: any) {
  const client = new DynamoDBClient({});

  const item = {
    hour: {S: hour},
    data: {S: JSON.stringify(data)},
  };

  const params = {
    TableName: 'weather-cache',
    Item: marshall(item),
  };

  try {
    const command = new PutItemCommand(params);
    const response = await client.send(command);
    console.log('Item pushed successfully:', response);
  } catch (error) {
    console.error('Error to push item in dynamo db', error);
    throw error;
  }
}

async function getItemInCache(hour: string): Promise<any | undefined> {
  try {
    const params = {
      TableName: 'weather-cache',
      Key: {
        PK: hour,
      },
    };

    const client = new DynamoDBClient({});
    const result = await client.send(new GetItemCommand(params));

    if (result.Item) {
      console.log('Retrieved item:', JSON.stringify(result.Item, null, 2));
      return result.Item;
    } else {
      console.log('No item found with the given primary key.');
      return undefined;
    }
  } catch (error) {
    console.error('Error retrieving item:', error);
    throw error;
  }
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const currentHour = Math.floor(Date.now() / 36e6).toString();

  console.log('Get data for hour %s', currentHour);

  const item = await getItemInCache(currentHour);
  if (item) {
    console.log("Found cache, don't need to fetch on api.open-meteo.com");
    return {
      statusCode: 200,
      body: item.data,
    };
  }
  console.log('No cache Found, Fetch data on api.open-meteo.com');

  const data = await ky(
    'https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m',
  ).json();

  console.log('Add data on cache');
  await pushItemInCache(currentHour, data);

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
