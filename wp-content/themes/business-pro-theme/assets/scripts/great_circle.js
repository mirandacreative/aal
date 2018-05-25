// calculations in nautical miles and knots

// radius of Earth
RE = 3440.07; // nm
knots_to_miles = 1.0/0.868976;
degrees_to_radians = Math.PI/180.0;

function great_circle_distance( lat1, long1, lat2, long2) {
    // # Convert latitude and longitude to 
    // # spherical coordinates in radians.
    // # phi = 90 - latitude
    phi1 = (90.0 - lat1)*degrees_to_radians;
    phi2 = (90.0 - lat2)*degrees_to_radians;
    
    // # phi = 90 - latitude
    theta1 = long1*degrees_to_radians;
    theta2 = long2*degrees_to_radians;

    // # Compute spherical distance from spherical coordinates.
    // 
    // # For two locations in spherical coordinates 
    // # (1, theta, phi) and (1, theta, phi)
    // # cosine( arc length ) = 
    // #    sin phi sin phi' cos(theta-theta') + cos phi cos phi'
    // # distance = rho * arc length
    cos = (Math.sin(phi1)*Math.sin(phi2)*Math.cos(theta1 - theta2) + 
           Math.cos(phi1)*Math.cos(phi2));
    arc = Math.acos( cos );
    
    gc_distance = arc * RE;
    return gc_distance;
};