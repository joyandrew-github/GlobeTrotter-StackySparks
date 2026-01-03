const prisma = require('../config/prisma');

const cities = [
  {
    name: 'Paris',
    country: 'France',
    costIndex: 4,
    popularity: 100,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    description: 'The City of Light, known for its art, fashion, and iconic landmarks',
    avgDailyCost: 150,
    bestTime: 'Apr-Jun, Sep-Oct',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Montmartre']
  },
  {
    name: 'London',
    country: 'United Kingdom',
    costIndex: 5,
    popularity: 98,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0c5c17?w=800',
    description: 'A vibrant global city blending history, culture, and modern innovation',
    avgDailyCost: 180,
    bestTime: 'May-Sep',
    highlights: ['Big Ben', 'London Eye', 'Buckingham Palace', 'British Museum']
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    costIndex: 2,
    popularity: 95,
    image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800',
    description: 'Exotic street food, golden temples, and bustling markets',
    avgDailyCost: 50,
    bestTime: 'Nov-Feb',
    highlights: ['Grand Palace', 'Wat Arun', 'Chatuchak Market', 'Floating Markets']
  },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    costIndex: 4,
    popularity: 92,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    description: 'Luxury skyscrapers, desert adventures, and world-class shopping',
    avgDailyCost: 160,
    bestTime: 'Nov-Mar',
    highlights: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Desert Safari']
  },
  {
    name: 'Istanbul',
    country: 'Turkey',
    costIndex: 2,
    popularity: 90,
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b2387?w=800',
    description: 'Where East meets West – history, culture, and stunning architecture',
    avgDailyCost: 60,
    bestTime: 'Apr-May, Sep-Oct',
    highlights: ['Hagia Sophia', 'Blue Mosque', 'Topkapi Palace', 'Bosphorus Cruise']
  },
  {
    name: 'Rome',
    country: 'Italy',
    costIndex: 4,
    popularity: 93,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    description: 'The Eternal City with ancient ruins and incredible Italian cuisine',
    avgDailyCost: 130,
    bestTime: 'Apr-Jun, Sep-Oct',
    highlights: ['Colosseum', 'Vatican City', 'Pantheon', 'Trevi Fountain']
  },
  {
    name: 'New York',
    country: 'United States',
    costIndex: 5,
    popularity: 94,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    description: 'The city that never sleeps – skyscrapers, culture, and endless energy',
    avgDailyCost: 200,
    bestTime: 'Sep-Nov, Apr-Jun',
    highlights: ['Statue of Liberty', 'Central Park', 'Times Square', 'Empire State Building']
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    costIndex: 4,
    popularity: 96,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    description: 'Futuristic metropolis with ancient temples and incredible food',
    avgDailyCost: 140,
    bestTime: 'Mar-May, Oct-Nov',
    highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Skytree', 'Akihabara']
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    costIndex: 3,
    popularity: 91,
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    description: 'Gaudi’s masterpiece city with beaches, art, and vibrant nightlife',
    avgDailyCost: 120,
    bestTime: 'May-Jun, Sep-Oct',
    highlights: ['Sagrada Familia', 'Park Güell', 'La Rambla', 'Gothic Quarter']
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    costIndex: 4,
    popularity: 89,
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f2e0b2282?w=800',
    description: 'Ultra-modern city-state with gardens, food, and futuristic architecture',
    avgDailyCost: 150,
    bestTime: 'Feb-Apr',
    highlights: ['Marina Bay Sands', 'Gardens by the Bay', 'Sentosa', 'Chinatown']
  }
  // Add more cities as needed...
];

async function main() {
  console.log('Starting city seeding...');

  for (const cityData of cities) {
    const existing = await prisma.city.findFirst({
      where: {
        name: cityData.name,
        country: cityData.country
      }
    });

    if (!existing) {
      await prisma.city.create({
        data: cityData
      });
      console.log(`Added: ${cityData.name}, ${cityData.country}`);
    } else {
      console.log(`Already exists: ${cityData.name}, ${cityData.country}`);
    }
  }

  console.log('City seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });