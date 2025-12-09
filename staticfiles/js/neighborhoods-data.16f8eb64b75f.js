// Comprehensive Dublin Neighborhood Boundaries
// Covers all major areas visible in your map

const dublinNeighborhoods = {
    "type": "FeatureCollection",
    "features": [
        // CITY CENTER
        {
            "type": "Feature",
            "properties": {
                "name": "Temple Bar",
                "area_code": "D02",
                "color": "#e74c3c",
                "description": "Cultural quarter & nightlife"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-6.2670, 53.3450],
                    [-6.2620, 53.3450],
                    [-6.2620, 53.3475],
                    [-6.2670, 53.3475],
                    [-6.2670, 53.3450]
                ]]
            }
        },
        
        // SOUTH DUBLIN
        {
            "type": "Feature",
            "properties": {
                "name": "Ballsbridge",
                "area_code": "D04",
                "color": "#3498db",
                "description": "Leafy suburb near Aviva Stadium"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-6.2350, 53.3200],
                    [-6.2200, 53.3200],
                    [-6.2200, 53.3320],
                    [-6.2350, 53.3320],
                    [-6.2350, 53.3200]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Donnybrook",
                "area_code": "D04",
                "color": "#f39c12",
                "description": "Upscale village area"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-6.2400, 53.3180],
                    [-6.2250, 53.3180],
                    [-6.2250, 53.3280],
                    [-6.2400, 53.3280],
                    [-6.2400, 53.3180]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Ranelagh",
                "area_code": "D06",
                "color": "#9b59b6",
                "description": "Trendy village with cafes"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-6.2550, 53.3200],
                    [-6.2400, 53.3200],
                    [-6.2400, 53.3300],
                    [-6.2550, 53.3300],
                    [-6.2550, 53.3200]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Rathmines",
                "area_code": "D06",
                "color": "#2ecc71",
                "description": "Student area & shopping"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-6.2700, 53.3200],
                    [-6.2550, 53.3200],
                    [-6.2550, 53.3300],
                    [-6.2700, 53.3300],
                    [-6.2700, 53.3200]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Portobello",
                "area_code": "D08",
                "color": "#e67e22",
                "description": "Canal-side neighborhood"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-6.2750, 53.3300],
                    [-6.2600, 53.3300],
                    [-6.2600, 53.3400],
                    [-6.2750, 53.3400],
                    [-6.2750, 53.3300]
                ]]
            }
        },
        
        {
            "type": "Feature",
            "properties": {
                "name": "Blackrock",
                "area_code": "Blackrock",
                "color": "#34495e",
                "description": "Seaside town & shopping"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-6.1900, 53.3000],
                    [-6.1700, 53.3000],
                    [-6.1700, 53.3100],
                    [-6.1900, 53.3100],
                    [-6.1900, 53.3000]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Monkstown",
                "area_code": "Monkstown",
                "color": "#16a085",
                "description": "Affluent coastal suburb"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-6.1700, 53.2900],
                    [-6.1500, 53.2900],
                    [-6.1500, 53.3000],
                    [-6.1700, 53.3000],
                    [-6.1700, 53.2900]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Dun Laoghaire",
                "area_code": "Dun Laoghaire",
                "color": "#2980b9",
                "description": "Ferry port & pier"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-6.1500, 53.2850],
                    [-6.1250, 53.2850],
                    [-6.1250, 53.3000],
                    [-6.1500, 53.3000],
                    [-6.1500, 53.2850]
                ]]
            }
        },
        
        {
            "type": "Feature",
            "properties": {
                "name": "Dundrum",
                "area_code": "D14",
                "color": "#f1c40f",
                "description": "Shopping center hub"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-6.2650, 53.2900],
                    [-6.2450, 53.2900],
                    [-6.2450, 53.3050],
                    [-6.2650, 53.3050],
                    [-6.2650, 53.2900]
                ]]
            }
        },
        
        
        
        // NORTH DUBLIN
        {
            "type": "Feature",
            "properties": {
                "name": "Stoneybatter",
                "area_code": "D07",
                "color": "#1abc9c",
                "description": "Hip neighborhood"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-6.2850, 53.3500],
                    [-6.2700, 53.3500],
                    [-6.2700, 53.3600],
                    [-6.2850, 53.3600],
                    [-6.2850, 53.3500]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Phibsborough",
                "area_code": "D07",
                "color": "#e67e22",
                "description": "Multicultural area"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-6.2800, 53.3550],
                    [-6.2650, 53.3550],
                    [-6.2650, 53.3650],
                    [-6.2800, 53.3650],
                    [-6.2800, 53.3550]
                ]]
            }
        }
    ]
};