import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Rating,
  Pagination
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';

// Mock data for demonstration
const mockVenues = [
  {
    id: 1,
    name: 'The Echo Lounge',
    city: 'Atlanta',
    state: 'GA',
    capacity: 650,
    phone: '404-555-1212',
    email: 'bookings@echolounge.com',
    rating: 4.5,
    lastContact: '2025-05-15',
    nextBooking: '2025-07-12',
    venueType: 'club'
  },
  {
    id: 2,
    name: 'Harmony Hall',
    city: 'Nashville',
    state: 'TN',
    capacity: 1200,
    phone: '615-555-3434',
    email: 'events@harmonyhall.com',
    rating: 5,
    lastContact: '2025-06-01',
    nextBooking: null,
    venueType: 'theater'
  },
  {
    id: 3,
    name: 'Rhythm Room',
    city: 'Austin',
    state: 'TX',
    capacity: 450,
    phone: '512-555-7878',
    email: 'booking@rhythmroom.com',
    rating: 3.5,
    lastContact: '2025-04-22',
    nextBooking: '2025-08-05',
    venueType: 'club'
  },
  {
    id: 4,
    name: 'Festival Arena',
    city: 'Los Angeles',
    state: 'CA',
    capacity: 5000,
    phone: '323-555-9090',
    email: 'events@festivalarena.com',
    rating: 4,
    lastContact: '2025-05-30',
    nextBooking: '2025-09-15',
    venueType: 'arena'
  }
];

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const venuesPerPage = 10;

  useEffect(() => {
    // In a real app, this would be an API call
    setVenues(mockVenues);
  }, []);

  // Filter venues based on search term and venue type
  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         venue.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || venue.venueType === filterType;
    
    return matchesSearch && matchesType;
  });

  // Sort venues based on selected sort option
  const sortedVenues = [...filteredVenues].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'capacity':
        return b.capacity - a.capacity;
      case 'lastContact':
        return new Date(b.lastContact) - new Date(a.lastContact);
      default:
        return 0;
    }
  });

  // Paginate venues
  const paginatedVenues = sortedVenues.slice(
    (page - 1) * venuesPerPage,
    page * venuesPerPage
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    setPage(1); // Reset to first page on new filter
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getVenueTypeLabel = (type) => {
    switch (type) {
      case 'club':
        return 'Club';
      case 'theater':
        return 'Theater';
      case 'arena':
        return 'Arena';
      case 'festival':
        return 'Festival';
      default:
        return type;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Venues
        </Typography>
        
        {/* Search and Filter Controls */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search venues by name or city..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="venue-type-label">Venue Type</InputLabel>
              <Select
                labelId="venue-type-label"
                value={filterType}
                label="Venue Type"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="club">Clubs</MenuItem>
                <MenuItem value="theater">Theaters</MenuItem>
                <MenuItem value="arena">Arenas</MenuItem>
                <MenuItem value="festival">Festivals</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="sort-by-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
                startAdornment={<SortIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="name">Name (A-Z)</MenuItem>
                <MenuItem value="rating">Rating (High-Low)</MenuItem>
                <MenuItem value="capacity">Capacity (High-Low)</MenuItem>
                <MenuItem value="lastContact">Last Contact (Recent)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        {/* Results Count */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Showing {paginatedVenues.length} of {filteredVenues.length} venues
        </Typography>
        
        {/* Venue Cards */}
        <Grid container spacing={3}>
          {paginatedVenues.map(venue => (
            <Grid item xs={12} md={6} lg={4} key={venue.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2">
                      {venue.name}
                    </Typography>
                    <Chip 
                      label={getVenueTypeLabel(venue.venueType)} 
                      size="small" 
                      color={venue.venueType === 'arena' ? 'primary' : 'default'}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {venue.city}, {venue.state} • Capacity: {venue.capacity}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {venue.phone}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {venue.email}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Rating value={venue.rating} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      Last Contact: {venue.lastContact}
                    </Typography>
                  </Box>
                  
                  {venue.nextBooking && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="primary">
                        Next Booking: {venue.nextBooking}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">View Details</Button>
                  <Button size="small" color="primary">Contact History</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Pagination */}
        {filteredVenues.length > venuesPerPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={Math.ceil(filteredVenues.length / venuesPerPage)} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default VenueList;