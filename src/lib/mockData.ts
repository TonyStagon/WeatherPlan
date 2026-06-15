export type WeatherCondition = 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'windy' | 'foggy';

export type HourlyForecast = { time: string; temp: number; condition: WeatherCondition };

export type DailyForecast = {
  day: string; date: string; high: number; low: number;
  condition: WeatherCondition; description: string;
  precipitation: number; humidity: number; windSpeed: number; uvIndex: number;
};

export type WeatherReport = {
  destination: string; country: string; currentTemp: number; feelsLike: number;
  high: number; low: number; condition: WeatherCondition; description: string;
  humidity: number; windSpeed: number; windDirection: string; visibility: number;
  uvIndex: number; airQuality: string; hourly: HourlyForecast[]; weekly: DailyForecast[];
  backgroundImage: string;
};

export type Hotel = {
  name: string; stars: number; pricePerNight: number; rating: number;
  reviews: number; image: string; amenities: string[]; neighborhood: string;
};

export type Attraction = {
  name: string; type: string; description: string; bestTime: string; image: string; rating: number;
};

export type OutfitSuggestion = { occasion: string; items: string[]; tip: string };

export type DestinationData = {
  weather: WeatherReport; hotels: Hotel[]; attractions: Attraction[]; outfits: OutfitSuggestion[];
};

const conditionDescriptions: Record<WeatherCondition, string[]> = {
  sunny: ['Clear skies and bright sunshine all day', 'Brilliant sunshine — perfect for sightseeing'],
  partly_cloudy: ['Mix of sun and clouds throughout the day', 'Mostly pleasant with some passing clouds'],
  cloudy: ['Overcast but dry conditions', 'Heavy cloud cover — no rain expected'],
  rainy: ['Light to moderate rainfall expected', 'Showers likely — pack an umbrella'],
  stormy: ['Thunderstorms likely — stay safe indoors', 'Severe weather advisory in effect'],
  snowy: ['Light snowfall expected — dress warm!', 'Heavy snowfall — winter gear essential'],
  windy: ['Gusty winds throughout the day', 'Strong winds — secure loose items'],
  foggy: ['Dense fog — low visibility conditions', 'Misty and foggy, especially in the morning'],
};

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

const destDefaults: Record<string, Partial<WeatherReport>> = {
  paris: { currentTemp: 18, high: 22, low: 13, condition: 'partly_cloudy', country: 'France', windDirection: 'SW', backgroundImage: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg' },
  london: { currentTemp: 14, high: 17, low: 10, condition: 'cloudy', country: 'UK', windDirection: 'W', backgroundImage: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg' },
  tokyo: { currentTemp: 24, high: 28, low: 19, condition: 'sunny', country: 'Japan', windDirection: 'E', backgroundImage: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg' },
  'new york': { currentTemp: 20, high: 25, low: 15, condition: 'partly_cloudy', country: 'USA', windDirection: 'NW', backgroundImage: 'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg' },
  bali: { currentTemp: 30, high: 33, low: 26, condition: 'sunny', country: 'Indonesia', windDirection: 'SE', backgroundImage: 'https://images.pexels.com/photos/1544947/pexels-photo-1544947.jpeg' },
  sydney: { currentTemp: 22, high: 26, low: 17, condition: 'sunny', country: 'Australia', windDirection: 'NE', backgroundImage: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg' },
  rome: { currentTemp: 26, high: 31, low: 19, condition: 'sunny', country: 'Italy', windDirection: 'S', backgroundImage: 'https://images.pexels.com/photos/753639/pexels-photo-753639.jpeg' },
  miami: { currentTemp: 29, high: 33, low: 24, condition: 'partly_cloudy', country: 'USA', windDirection: 'SE', backgroundImage: 'https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg' },
  dubai: { currentTemp: 38, high: 42, low: 30, condition: 'sunny', country: 'UAE', windDirection: 'N', backgroundImage: 'https://images.pexels.com/photos/1458457/pexels-photo-1458457.jpeg' },
  barcelona: { currentTemp: 25, high: 29, low: 18, condition: 'sunny', country: 'Spain', windDirection: 'SW', backgroundImage: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg' },
  amsterdam: { currentTemp: 15, high: 19, low: 11, condition: 'rainy', country: 'Netherlands', windDirection: 'W', backgroundImage: 'https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg' },
  cancun: { currentTemp: 31, high: 34, low: 25, condition: 'sunny', country: 'Mexico', windDirection: 'E', backgroundImage: 'https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg' },
};

function makeHourly(baseTemp: number, condition: WeatherCondition): HourlyForecast[] {
  return ['06 AM','09 AM','12 PM','03 PM','06 PM','09 PM'].map((time, i) => ({
    time, temp: baseTemp + [-4,-2,2,3,1,-3][i],
    condition: i === 3 ? condition : (Math.random() > 0.4 ? condition : 'partly_cloudy'),
  }));
}

function makeWeekly(high: number, low: number, condition: WeatherCondition): DailyForecast[] {
  const today = new Date();
  const conds: WeatherCondition[] = [condition,'partly_cloudy',condition,'sunny','cloudy',condition,'partly_cloudy'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() + i);
    const c = conds[i];
    return {
      day: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()],
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      high: high + Math.floor(Math.random()*5-2), low: low + Math.floor(Math.random()*4-2),
      condition: c, description: rand(conditionDescriptions[c]),
      precipitation: (c==='rainy'||c==='stormy') ? Math.floor(Math.random()*70+20) : Math.floor(Math.random()*20),
      humidity: Math.floor(Math.random()*30+50), windSpeed: Math.floor(Math.random()*20+5),
      uvIndex: c==='sunny' ? Math.floor(Math.random()*4+6) : Math.floor(Math.random()*4+2),
    };
  });
}

function makeOutfits(condition: WeatherCondition, temp: number): OutfitSuggestion[] {
  const hot = temp >= 28, cold = temp <= 15, wet = condition==='rainy'||condition==='stormy';
  if (hot) return [
    { occasion:'Daytime Sightseeing', items:['Lightweight linen shirt','Breathable shorts','Sunhat','Sandals or sneakers','Sunglasses','SPF 50+ sunscreen'], tip:'UV index is high — reapply sunscreen every 2 hours and seek shade from noon to 3 PM.' },
    { occasion:'Beach & Poolside', items:['Swimsuit','Kaftan cover-up','Flip flops','Waterproof bag','Reef-safe sunscreen'], tip:'Stay hydrated and avoid direct sun during peak hours.' },
    { occasion:'Evening Dining', items:['Light summer dress or chinos','Open-toe sandals','Light shawl for AC','Small clutch or bag'], tip:'Many restaurants are heavily air-conditioned — a light wrap is essential.' },
  ];
  if (cold || condition==='snowy') return [
    { occasion:'Cold Weather Exploring', items:['Thermal base layer','Wool sweater or fleece','Heavy coat or parka','Warm waterproof boots','Gloves, scarf, beanie'], tip:'Layer up — it\'s easier to remove a layer than to be cold all day.' },
    { occasion:'Museums & Cafes', items:['Turtleneck or warm blouse','Lined trousers or jeans','Ankle boots','Light cardigan'], tip:'Indoor heating can be strong — easy-to-remove layers work best.' },
    { occasion:'Winter Evening Out', items:['Smart wool blazer','Dress pants or skirt with tights','Knee-high boots','Warm overcoat'], tip:'Check venue dress codes — some nicer restaurants require smart attire.' },
  ];
  if (wet) return [
    { occasion:'Rainy Day Sightseeing', items:['Waterproof jacket or raincoat','Quick-dry trousers','Waterproof ankle boots','Compact umbrella','Waterproof bag cover'], tip:'Avoid cotton on rainy days — it stays wet and cold. Opt for synthetics or wool.' },
    { occasion:'Indoor Museum Day', items:['Cozy sweater','Comfortable jeans','Waterproof sneakers or boots','Small day bag'], tip:'Rainy days are perfect for museums and galleries — book timed entry in advance.' },
    { occasion:'Casual Evening', items:['Smart casual trousers','Button-down shirt','Leather shoes (waterproofed)','Light jacket'], tip:'Book indoor restaurants ahead — everyone heads inside when it rains.' },
  ];
  return [
    { occasion:'Daytime Exploring', items:['Comfortable t-shirt or blouse','Jeans or casual trousers','Well-worn walking shoes','Light cardigan','Sunglasses'], tip:'Perfect weather for long walks — wear well-broken-in shoes to avoid blisters.' },
    { occasion:'Cultural Sites', items:['Smart casual shirt','Chinos or midi skirt','Comfortable loafers','Light jacket','Small backpack'], tip:'Some religious sites require covered shoulders and knees — keep a scarf handy.' },
    { occasion:'Evening Out', items:['Smart dress or dress shirt with trousers','Heels or smart flats','Small clutch or evening bag','Light blazer or wrap'], tip:'Evenings can cool down noticeably — a light blazer elevates any outfit.' },
  ];
}

const hotelData: Record<string, Hotel[]> = {
  paris: [
    { name:'Le Marais Boutique Hotel', stars:5, pricePerNight:380, rating:4.9, reviews:1243, image:'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg', amenities:['Spa','Rooftop Bar','Michelin Restaurant','Concierge'], neighborhood:'Le Marais' },
    { name:'Hotel des Arts Montmartre', stars:4, pricePerNight:195, rating:4.7, reviews:892, image:'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg', amenities:['Breakfast Included','City Views','Bar','Free WiFi'], neighborhood:'Montmartre' },
    { name:'Seine River Suites', stars:4, pricePerNight:240, rating:4.8, reviews:654, image:'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg', amenities:['River Views','Spa','Gym','Restaurant'], neighborhood:'Île Saint-Louis' },
  ],
  tokyo: [
    { name:'Shinjuku Grand Tower', stars:5, pricePerNight:320, rating:4.9, reviews:2103, image:'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg', amenities:['Sky Bar','Onsen','Multiple Restaurants','Concierge'], neighborhood:'Shinjuku' },
    { name:'Akihabara Tech Inn', stars:3, pricePerNight:110, rating:4.5, reviews:1567, image:'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg', amenities:['Free WiFi','Capsule Option','Subway Access','24hr Convenience'], neighborhood:'Akihabara' },
    { name:'Shibuya Crossing View', stars:4, pricePerNight:210, rating:4.7, reviews:890, image:'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg', amenities:['Crossing Views','Bar','Gym','Breakfast'], neighborhood:'Shibuya' },
  ],
  bali: [
    { name:'Ubud Jungle Villa', stars:5, pricePerNight:290, rating:5.0, reviews:743, image:'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg', amenities:['Private Pool','Jungle Views','Yoga Studio','Spa'], neighborhood:'Ubud' },
    { name:'Seminyak Beach Resort', stars:4, pricePerNight:180, rating:4.8, reviews:1203, image:'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg', amenities:['Beachfront','Infinity Pool','Surf Lessons','Bar'], neighborhood:'Seminyak' },
    { name:'Kuta Surf Hostel', stars:3, pricePerNight:75, rating:4.4, reviews:2341, image:'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg', amenities:['Surf Board Rental','Pool','Free Breakfast','Social Events'], neighborhood:'Kuta' },
  ],
};

const defaultHotels: Hotel[] = [
  { name:'Grand City Hotel', stars:5, pricePerNight:280, rating:4.8, reviews:1102, image:'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg', amenities:['Spa','Pool','Restaurant','Concierge','Gym'], neighborhood:'City Center' },
  { name:'Boutique Heritage Inn', stars:4, pricePerNight:165, rating:4.6, reviews:734, image:'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg', amenities:['Breakfast Included','Free WiFi','Bar','Terrace'], neighborhood:'Old Town' },
  { name:'Modern Studio Suites', stars:3, pricePerNight:95, rating:4.3, reviews:2156, image:'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg', amenities:['Kitchenette','Gym','Free WiFi','Laundry'], neighborhood:'Arts District' },
];

const attractionData: Record<string, Attraction[]> = {
  paris: [
    { name:'Eiffel Tower', type:'Landmark', description:'The iconic iron lattice tower on the Champ de Mars — breathtaking at sunset when it sparkles every hour.', bestTime:'Evening', image:'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg', rating:4.9 },
    { name:'Louvre Museum', type:'Museum', description:'World\'s largest art museum with thousands of works including the Mona Lisa and Venus de Milo.', bestTime:'Morning', image:'https://images.pexels.com/photos/2675266/pexels-photo-2675266.jpeg', rating:4.8 },
    { name:'Montmartre District', type:'Neighborhood', description:'Charming hilltop neighborhood with artists, cozy cafes, and the beautiful Sacré-Cœur basilica.', bestTime:'Afternoon', image:'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg', rating:4.7 },
  ],
  tokyo: [
    { name:'Senso-ji Temple', type:'Cultural Site', description:'Tokyo\'s oldest temple in Asakusa — arrive at dawn to see monks and avoid the crowds.', bestTime:'Early Morning', image:'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg', rating:4.8 },
    { name:'Shibuya Crossing', type:'Landmark', description:'The world\'s busiest pedestrian crossing — best experienced from the Starbucks or Mag\'s Park above.', bestTime:'Evening', image:'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg', rating:4.7 },
    { name:'Tsukiji Outer Market', type:'Food Market', description:'Sample the freshest sushi, sashimi, and Japanese street food at this legendary fish market.', bestTime:'Morning', image:'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg', rating:4.9 },
  ],
  bali: [
    { name:'Tegallalang Rice Terraces', type:'Nature', description:'UNESCO-listed rice terraces carved into volcanic hillsides — golden at sunrise with no crowds.', bestTime:'Sunrise', image:'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg', rating:4.8 },
    { name:'Uluwatu Temple', type:'Cultural Site', description:'Clifftop sea temple with stunning ocean views and nightly Kecak fire dance performances.', bestTime:'Sunset', image:'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg', rating:4.9 },
    { name:'Seminyak Beach', type:'Beach', description:'Upscale beach strip with luxury beach clubs, surf breaks, and spectacular pink-and-gold sunsets.', bestTime:'Late Afternoon', image:'https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg', rating:4.7 },
  ],
};

const defaultAttractions: Attraction[] = [
  { name:'Historic Old Town', type:'Neighborhood', description:'Wander cobblestone streets lined with centuries of architecture, local artisan shops, and hidden courtyards.', bestTime:'Morning', image:'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg', rating:4.7 },
  { name:'Central Food Market', type:'Food Market', description:'Taste local specialties, fresh produce, and artisan products at the vibrant covered market hall.', bestTime:'Morning', image:'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg', rating:4.6 },
  { name:'City Panorama Viewpoint', type:'Landmark', description:'Breathtaking 360° views of the entire city skyline — absolutely magical at golden hour.', bestTime:'Sunset', image:'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg', rating:4.8 },
];

export function generateWeatherReport(destination: string): WeatherReport {
  const key = destination.toLowerCase().trim();
  const d = destDefaults[key] ?? {};
  const condition: WeatherCondition = (d.condition as WeatherCondition) ?? 'partly_cloudy';
  const currentTemp = d.currentTemp ?? Math.floor(Math.random()*20+15);
  const high = d.high ?? currentTemp + Math.floor(Math.random()*5+2);
  const low = d.low ?? currentTemp - Math.floor(Math.random()*6+3);
  return {
    destination: destination.split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' '),
    country: d.country ?? '', currentTemp, feelsLike: currentTemp-Math.floor(Math.random()*3+1),
    high, low, condition, description: rand(conditionDescriptions[condition]),
    humidity: Math.floor(Math.random()*30+45), windSpeed: Math.floor(Math.random()*20+5),
    windDirection: d.windDirection ?? 'N',
    visibility: condition==='foggy' ? Math.floor(Math.random()*3+1) : Math.floor(Math.random()*5+8),
    uvIndex: condition==='sunny' ? Math.floor(Math.random()*4+6) : Math.floor(Math.random()*4+2),
    airQuality: ['Good','Good','Moderate','Good','Satisfactory'][Math.floor(Math.random()*5)],
    hourly: makeHourly(currentTemp, condition),
    weekly: makeWeekly(high, low, condition),
    backgroundImage: d.backgroundImage ?? 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg',
  };
}

export function getDestinationData(destination: string): DestinationData {
  const key = destination.toLowerCase().trim();
  const weather = generateWeatherReport(destination);
  return {
    weather,
    hotels: hotelData[key] ?? defaultHotels,
    attractions: attractionData[key] ?? defaultAttractions,
    outfits: makeOutfits(weather.condition, weather.currentTemp),
  };
}

export const currentLocationWeather: WeatherReport = {
  destination: 'Your Location', country: '', currentTemp: 22, feelsLike: 20,
  high: 25, low: 16, condition: 'partly_cloudy',
  description: 'Mix of sun and clouds with a refreshing light breeze',
  humidity: 58, windSpeed: 12, windDirection: 'SW', visibility: 12, uvIndex: 5, airQuality: 'Good',
  hourly: [
    { time:'06 AM', temp:16, condition:'cloudy' }, { time:'09 AM', temp:19, condition:'partly_cloudy' },
    { time:'12 PM', temp:23, condition:'sunny' }, { time:'03 PM', temp:25, condition:'partly_cloudy' },
    { time:'06 PM', temp:22, condition:'partly_cloudy' }, { time:'09 PM', temp:18, condition:'cloudy' },
  ],
  weekly: makeWeekly(25, 16, 'partly_cloudy'),
  backgroundImage: 'https://images.pexels.com/photos/531756/pexels-photo-531756.jpeg',
};

export const popularDestinations = [
  { name:'Bali', country:'Indonesia', image:'https://images.pexels.com/photos/1544947/pexels-photo-1544947.jpeg', temp:30, condition:'sunny' as WeatherCondition },
  { name:'Paris', country:'France', image:'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg', temp:18, condition:'partly_cloudy' as WeatherCondition },
  { name:'Tokyo', country:'Japan', image:'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg', temp:24, condition:'sunny' as WeatherCondition },
  { name:'New York', country:'USA', image:'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg', temp:20, condition:'partly_cloudy' as WeatherCondition },
  { name:'Rome', country:'Italy', image:'https://images.pexels.com/photos/753639/pexels-photo-753639.jpeg', temp:26, condition:'sunny' as WeatherCondition },
  { name:'Sydney', country:'Australia', image:'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg', temp:22, condition:'sunny' as WeatherCondition },
];

export const WEATHER_ICONS: Record<WeatherCondition, string> = {
  sunny:'☀️', partly_cloudy:'⛅', cloudy:'☁️', rainy:'🌧️', stormy:'⛈️', snowy:'🌨️', windy:'💨', foggy:'🌫️',
};

export const WEATHER_BG: Record<WeatherCondition, string> = {
  sunny:'from-amber-500/20 to-orange-600/20', partly_cloudy:'from-sky-500/20 to-blue-600/20',
  cloudy:'from-slate-500/20 to-gray-600/20', rainy:'from-blue-600/20 to-indigo-700/20',
  stormy:'from-gray-700/20 to-slate-800/20', snowy:'from-sky-300/20 to-blue-400/20',
  windy:'from-teal-500/20 to-cyan-600/20', foggy:'from-gray-400/20 to-slate-500/20',
};
