const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Venue extends Model {
    static associate(models) {
      // Define associations here
      Venue.hasMany(models.VenueContact, {
        foreignKey: 'venue_id',
        as: 'contacts'
      });
      
      Venue.hasMany(models.Booking, {
        foreignKey: 'venue_id',
        as: 'bookings'
      });
      
      Venue.hasMany(models.Communication, {
        foreignKey: 'venue_id',
        as: 'communications'
      });
      
      Venue.hasMany(models.VenueRating, {
        foreignKey: 'venue_id',
        as: 'ratings'
      });
      
      Venue.hasMany(models.Document, {
        foreignKey: 'venue_id',
        as: 'documents'
      });
      
      Venue.hasMany(models.Reminder, {
        foreignKey: 'venue_id',
        as: 'reminders'
      });
    }
  }

  Venue.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'USA'
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    technical_specs: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    load_in_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    venue_type: {
      type: DataTypes.ENUM('club', 'theater', 'arena', 'festival', 'bar', 'outdoor', 'other'),
      allowNull: false,
      defaultValue: 'other'
    },
    average_rating: {
      type: DataTypes.VIRTUAL,
      get() {
        if (!this.ratings || this.ratings.length === 0) return null;
        
        const sum = this.ratings.reduce((total, rating) => total + rating.rating, 0);
        return (sum / this.ratings.length).toFixed(1);
      },
      set() {
        throw new Error('Do not try to set the `average_rating` value!');
      }
    },
    last_contacted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    next_booking_date: {
      type: DataTypes.VIRTUAL,
      get() {
        if (!this.bookings || this.bookings.length === 0) return null;
        
        const futureBookings = this.bookings
          .filter(booking => new Date(booking.event_date) > new Date())
          .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
          
        return futureBookings.length > 0 ? futureBookings[0].event_date : null;
      },
      set() {
        throw new Error('Do not try to set the `next_booking_date` value!');
      }
    },
    location_coordinates: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Venue',
    tableName: 'venues',
    underscored: true,
    timestamps: true,
    hooks: {
      beforeUpdate: (venue) => {
        venue.updated_at = new Date();
      }
    }
  });

  return Venue;
};