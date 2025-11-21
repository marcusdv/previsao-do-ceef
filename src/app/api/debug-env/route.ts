export async function GET() {
  return Response.json({
    accuweather: {
      exists: !!process.env.ACCUWEATHER_API_KEY,
      length: process.env.ACCUWEATHER_API_KEY?.length,
      first5: process.env.ACCUWEATHER_API_KEY?.substring(0, 5)
    },
    openweather: {
      exists: !!process.env.OPENWEATHER_API_KEY,
      length: process.env.OPENWEATHER_API_KEY?.length,
      first5: process.env.OPENWEATHER_API_KEY?.substring(0, 5)
    }
  });
}