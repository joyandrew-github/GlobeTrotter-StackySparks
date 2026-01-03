const cityService = require('../service/cityService');

const searchCities = async (req, res) => {
  const { q, limit } = req.query;

  try {
    const cities = await cityService.searchCities({ query: q || '', limit });
    res.status(200).json({
      success: true,
      data: cities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPopularCities = async (req, res) => {
  const { limit } = req.query;

  try {
    const cities = await cityService.getPopularCities(limit);
    res.status(200).json({
      success: true,
      data: cities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMySavedCities = async (req, res) => {
  const userId = req.user.id;

  try {
    const cities = await cityService.getSavedCities(userId);
    res.status(200).json({
      success: true,
      data: cities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const saveCity = async (req, res) => {
  const userId = req.user.id;
  const { cityId } = req.params;

  try {
    await cityService.saveCity(userId, cityId);
    res.status(200).json({
      success: true,
      message: 'City saved successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const unsaveCity = async (req, res) => {
  const userId = req.user.id;
  const { cityId } = req.params;

  try {
    await cityService.unsaveCity(userId, cityId);
    res.status(200).json({
      success: true,
      message: 'City removed from saved'
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  searchCities,
  getPopularCities,
  getMySavedCities,
  saveCity,
  unsaveCity
};