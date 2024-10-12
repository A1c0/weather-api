import {APIGatewayProxyResultV2} from 'aws-lambda';
import ky from 'ky';

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const weatherData = await ky(
    'https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m',
  ).json();

  return {
    statusCode: 200,
    body: JSON.stringify(weatherData),
  };
}
