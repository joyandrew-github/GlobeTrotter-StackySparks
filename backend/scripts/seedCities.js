const prisma = require('../config/prisma');

const cities = [
  { name: 'Paris', country: 'France', costIndex: 85, popularity: 100 },
  { name: 'London', country: 'United Kingdom', costIndex: 90, popularity: 98 },
  { name: 'Bangkok', country: 'Thailand', costIndex: 45, popularity: 95 },
  { name: 'Dubai', country: 'United Arab Emirates', costIndex: 70, popularity: 92 },
  { name: 'Istanbul', country: 'Turkey', costIndex: 40, popularity: 90 },
  { name: 'Rome', country: 'Italy', costIndex: 80, popularity: 88 },
  { name: 'New York', country: 'United States', costIndex: 100, popularity: 87 },
  { name: 'Tokyo', country: 'Japan', costIndex: 75, popularity: 85 },
  { name: 'Singapore', country: 'Singapore', costIndex: 85, popularity: 84 },
  { name: 'Hong Kong', country: 'Hong Kong', costIndex: 80, popularity: 83 },
  { name: 'Barcelona', country: 'Spain', costIndex: 70, popularity: 82 },
  { name: 'Amsterdam', country: 'Netherlands', costIndex: 80, popularity: 81 },
  { name: 'Madrid', country: 'Spain', costIndex: 65, popularity: 80 },
  { name: 'Prague', country: 'Czech Republic', costIndex: 50, popularity: 78 },
  { name: 'Antalya', country: 'Turkey', costIndex: 35, popularity: 77 },
  { name: 'Seoul', country: 'South Korea', costIndex: 70, popularity: 76 },
  { name: 'Kuala Lumpur', country: 'Malaysia', costIndex: 40, popularity: 75 },
  { name: 'Lisbon', country: 'Portugal', costIndex: 55, popularity: 74 },
  { name: 'Vienna', country: 'Austria', costIndex: 80, popularity: 73 },
  { name: 'Sydney', country: 'Australia', costIndex: 90, popularity: 72 },
  { name: 'Berlin', country: 'Germany', costIndex: 70, popularity: 71 },
  { name: 'Las Vegas', country: 'United States', costIndex: 75, popularity: 70 },
  { name: 'Los Angeles', country: 'United States', costIndex: 85, popularity: 69 },
  { name: 'Miami', country: 'United States', costIndex: 80, popularity: 68 },
  { name: 'Shanghai', country: 'China', costIndex: 55, popularity: 67 }
];

async function main() {
  console.log('Starting city seeding...');

  for (const city of cities) {
    const existing = await prisma.city.findFirst({
      where: { name: city.name, country: city.country }
    });

    if (!existing) {
      await prisma.city.create({ data: city });
      console.log(`Added: ${city.name}, ${city.country}`);
    } else {
      console.log(`Already exists: ${city.name}, ${city.country}`);
    }
  }

  console.log('City seeding completed!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error during seeding:', e);
  prisma.$disconnect();
  process.exit(1);
});