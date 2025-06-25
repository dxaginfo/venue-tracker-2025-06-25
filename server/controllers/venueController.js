const { Venue, VenueContact, VenueRating, Booking, Communication, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get all venues with pagination, filtering, and sorting
exports.getAllVenues = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'name',
      sortOrder = 'asc',
      venueType,
      minCapacity,
      maxCapacity,
      city,
      state,
      country
    } = req.query;
    
    // Build filter conditions
    const whereConditions = {};
    
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { city: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (venueType) {
      whereConditions.venue_type = venueType;
    }
    
    if (minCapacity) {
      whereConditions.capacity = {
        ...whereConditions.capacity,
        [Op.gte]: parseInt(minCapacity)
      };
    }
    
    if (maxCapacity) {
      whereConditions.capacity = {
        ...whereConditions.capacity,
        [Op.lte]: parseInt(maxCapacity)
      };
    }
    
    if (city) {
      whereConditions.city = { [Op.iLike]: `%${city}%` };
    }
    
    if (state) {
      whereConditions.state = { [Op.iLike]: `%${state}%` };
    }
    
    if (country) {
      whereConditions.country = { [Op.iLike]: `%${country}%` };
    }
    
    // Build sort options
    let order = [];
    if (sortBy && sortOrder) {
      order.push([sortBy, sortOrder.toUpperCase()]);
    }
    
    // Calculate pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Query venues with count
    const { count, rows: venues } = await Venue.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: VenueContact,
          as: 'contacts',
          required: false,
          limit: 1
        },
        {
          model: VenueRating,
          as: 'ratings',
          required: false,
          attributes: ['rating']
        },
        {
          model: Booking,
          as: 'bookings',
          required: false,
          where: {
            event_date: { [Op.gte]: new Date() }
          },
          order: [['event_date', 'ASC']],
          limit: 1
        }
      ],
      order,
      limit: parseInt(limit),
      offset,
      distinct: true
    });
    
    // Calculate metadata for pagination
    const totalPages = Math.ceil(count / parseInt(limit));
    
    return res.status(200).json({
      success: true,
      data: {
        venues,
        pagination: {
          total: count,
          totalPages,
          currentPage: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting venues:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get venues',
      error: error.message
    });
  }
};

// Get a single venue by ID with related data
exports.getVenueById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const venue = await Venue.findByPk(id, {
      include: [
        {
          model: VenueContact,
          as: 'contacts'
        },
        {
          model: VenueRating,
          as: 'ratings'
        },
        {
          model: Booking,
          as: 'bookings',
          order: [['event_date', 'DESC']],
          limit: 10
        },
        {
          model: Communication,
          as: 'communications',
          order: [['date', 'DESC']],
          limit: 10
        }
      ]
    });
    
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: venue
    });
  } catch (error) {
    console.error('Error getting venue:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get venue',
      error: error.message
    });
  }
};

// Create a new venue
exports.createVenue = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      name,
      address,
      city,
      state,
      country,
      postal_code,
      capacity,
      website,
      phone,
      email,
      technical_specs,
      load_in_notes,
      venue_type,
      contacts = []
    } = req.body;
    
    // Create venue
    const venue = await Venue.create({
      name,
      address,
      city,
      state,
      country,
      postal_code,
      capacity,
      website,
      phone,
      email,
      technical_specs,
      load_in_notes,
      venue_type
    }, { transaction });
    
    // Create contacts if provided
    if (contacts && contacts.length > 0) {
      const contactsWithVenueId = contacts.map(contact => ({
        ...contact,
        venue_id: venue.id
      }));
      
      await VenueContact.bulkCreate(contactsWithVenueId, { transaction });
    }
    
    await transaction.commit();
    
    // Fetch the venue with contacts to return in response
    const createdVenue = await Venue.findByPk(venue.id, {
      include: [
        {
          model: VenueContact,
          as: 'contacts'
        }
      ]
    });
    
    return res.status(201).json({
      success: true,
      message: 'Venue created successfully',
      data: createdVenue
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating venue:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create venue',
      error: error.message
    });
  }
};

// Update a venue
exports.updateVenue = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    const venue = await Venue.findByPk(id);
    
    if (!venue) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }
    
    const {
      name,
      address,
      city,
      state,
      country,
      postal_code,
      capacity,
      website,
      phone,
      email,
      technical_specs,
      load_in_notes,
      venue_type
    } = req.body;
    
    // Update venue
    await venue.update({
      name,
      address,
      city,
      state,
      country,
      postal_code,
      capacity,
      website,
      phone,
      email,
      technical_specs,
      load_in_notes,
      venue_type
    }, { transaction });
    
    await transaction.commit();
    
    // Fetch updated venue
    const updatedVenue = await Venue.findByPk(id, {
      include: [
        {
          model: VenueContact,
          as: 'contacts'
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Venue updated successfully',
      data: updatedVenue
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating venue:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update venue',
      error: error.message
    });
  }
};

// Delete a venue
exports.deleteVenue = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    const venue = await Venue.findByPk(id);
    
    if (!venue) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }
    
    // Check if venue can be deleted (no related bookings or only past bookings)
    const bookingsCount = await Booking.count({
      where: {
        venue_id: id,
        event_date: { [Op.gt]: new Date() }
      }
    });
    
    if (bookingsCount > 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot delete venue with upcoming bookings'
      });
    }
    
    // Delete venue
    await venue.destroy({ transaction });
    
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Venue deleted successfully'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting venue:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete venue',
      error: error.message
    });
  }
};

// Get venue statistics
exports.getVenueStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    
    const venue = await Venue.findByPk(id);
    
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }
    
    // Get booking statistics
    const bookingsCount = await Booking.count({
      where: { venue_id: id }
    });
    
    const completedBookingsCount = await Booking.count({
      where: { 
        venue_id: id,
        status: 'completed'
      }
    });
    
    const upcomingBookingsCount = await Booking.count({
      where: {
        venue_id: id,
        event_date: { [Op.gt]: new Date() }
      }
    });
    
    // Get average rating
    const ratingStats = await VenueRating.findAll({
      where: { venue_id: id },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'average_rating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_ratings']
      ],
      raw: true
    });
    
    // Get communication statistics
    const communicationCount = await Communication.count({
      where: { venue_id: id }
    });
    
    // Get last communication date
    const lastCommunication = await Communication.findOne({
      where: { venue_id: id },
      order: [['date', 'DESC']],
      attributes: ['date'],
      raw: true
    });
    
    return res.status(200).json({
      success: true,
      data: {
        bookings: {
          total: bookingsCount,
          completed: completedBookingsCount,
          upcoming: upcomingBookingsCount
        },
        rating: {
          average: ratingStats[0].average_rating ? parseFloat(ratingStats[0].average_rating).toFixed(1) : 0,
          count: parseInt(ratingStats[0].total_ratings) || 0
        },
        communications: {
          total: communicationCount,
          lastContact: lastCommunication ? lastCommunication.date : null
        }
      }
    });
  } catch (error) {
    console.error('Error getting venue statistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get venue statistics',
      error: error.message
    });
  }
};