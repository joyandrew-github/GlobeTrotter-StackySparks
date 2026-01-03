const prisma = require('../config/prisma');

const searchCities = async ({ query, limit = 10 }) => {
  return await prisma.city.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { country: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { popularity: 'desc' },
    take: Number(limit)
  });
};

const getPopularCities = async (limit = 8) => {
  return await prisma.city.findMany({
    orderBy: { popularity: 'desc' },
    take: Number(limit)
  });
};

const getSavedCities = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { savedCities: true }
  });
  return user?.savedCities || [];
};

const saveCity = async (userId, cityId) => {
  const city = await prisma.city.findUnique({ where: { id: cityId } });
  if (!city) throw new Error('City not found');

  await prisma.user.update({
    where: { id: userId },
    data: { savedCities: { connect: { id: cityId } } }
  });
};

const unsaveCity = async (userId, cityId) => {
  await prisma.user.update({
    where: { id: userId },
    data: { savedCities: { disconnect: { id: cityId } } }
  });
};

module.exports = {
  searchCities,
  getPopularCities,
  getSavedCities,
  saveCity,
  unsaveCity
};