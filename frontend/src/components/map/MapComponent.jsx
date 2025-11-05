'use client'

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Home, Bed, Bath, Maximize2, Filter, Loader2, Map as MapIcon, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import DataService from '@/lib/DataService';

// Dynamic import for Leaflet components (avoid SSR issues)
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);
const MarkerClusterGroup = dynamic(
    () => import('react-leaflet-cluster'),
    { ssr: false }
);

export default function MapComponent() {
    // Component States
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'

    // Filter states
    const [propertyType, setPropertyType] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [minBedrooms, setMinBedrooms] = useState('all');

    // Map configuration
    const defaultCenter = [37.7749, -122.4194]; // San Francisco
    const defaultZoom = 12;

    // Setup Component - Fetch properties
    useEffect(() => {
        fetchProperties();
    }, []);

    // Apply filters whenever filter states or properties change
    useEffect(() => {
        applyFilters();
    }, [properties, propertyType, priceRange, minBedrooms]);

    // Fix Leaflet icon issue in Next.js
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const L = require('leaflet');
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
        }
    }, []);

    // Handlers
    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await DataService.GetPropertyListings();
            setProperties(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load properties. Please try again.');
            console.error('Error fetching properties:', err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...properties];

        // Filter by property type
        if (propertyType !== 'all') {
            filtered = filtered.filter(p => p.type === propertyType);
        }

        // Filter by price range
        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number);
            filtered = filtered.filter(p => {
                if (max) {
                    return p.price >= min && p.price <= max;
                }
                return p.price >= min;
            });
        }

        // Filter by minimum bedrooms
        if (minBedrooms !== 'all') {
            filtered = filtered.filter(p => p.bedrooms >= Number(minBedrooms));
        }

        setFilteredProperties(filtered);
    };

    const handleResetFilters = () => {
        setPropertyType('all');
        setPriceRange('all');
        setMinBedrooms('all');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Create custom icon for markers based on property type
    const createCustomIcon = useMemo(() => {
        if (typeof window === 'undefined') return null;
        const L = require('leaflet');

        return (price) => {
            const priceLabel = formatPrice(price).replace('$', '').replace(',', '');
            return L.divIcon({
                className: 'custom-marker',
                html: `<div class="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-semibold shadow-lg border-2 border-white">$${priceLabel}</div>`,
                iconSize: [80, 32],
                iconAnchor: [40, 16],
            });
        };
    }, []);

    // UI View
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading properties...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="text-destructive text-center">
                    <p className="text-lg font-semibold">{error}</p>
                    <Button onClick={fetchProperties} className="mt-4">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters Bar */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-primary" />
                            <CardTitle>Filter Properties</CardTitle>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleResetFilters}>
                            Reset Filters
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Property Type Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Property Type</label>
                            <Select value={propertyType} onValueChange={setPropertyType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="house">House</SelectItem>
                                    <SelectItem value="apartment">Apartment</SelectItem>
                                    <SelectItem value="condo">Condo</SelectItem>
                                    <SelectItem value="townhouse">Townhouse</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Price Range Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price Range</label>
                            <Select value={priceRange} onValueChange={setPriceRange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Prices" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Prices</SelectItem>
                                    <SelectItem value="0-500000">Under $500K</SelectItem>
                                    <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
                                    <SelectItem value="1000000-2000000">$1M - $2M</SelectItem>
                                    <SelectItem value="2000000-999999999">$2M+</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Bedrooms Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Min. Bedrooms</label>
                            <Select value={minBedrooms} onValueChange={setMinBedrooms}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Any" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any</SelectItem>
                                    <SelectItem value="1">1+</SelectItem>
                                    <SelectItem value="2">2+</SelectItem>
                                    <SelectItem value="3">3+</SelectItem>
                                    <SelectItem value="4">4+</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Summary and View Toggle */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-semibold text-foreground">{filteredProperties.length}</span> of{' '}
                        <span className="font-semibold text-foreground">{properties.length}</span> properties
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={viewMode === 'map' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('map')}
                    >
                        <MapIcon className="w-4 h-4 mr-2" />
                        Map View
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="w-4 h-4 mr-2" />
                        List View
                    </Button>
                </div>
            </div>

            {/* Map View */}
            {viewMode === 'map' && (
                <div className="rounded-lg overflow-hidden border border-border shadow-lg" style={{ height: '600px' }}>
                    <MapContainer
                        center={defaultCenter}
                        zoom={defaultZoom}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MarkerClusterGroup>
                            {filteredProperties.map((property) => (
                                <Marker
                                    key={property.id}
                                    position={[property.location.lat, property.location.lng]}
                                    icon={createCustomIcon(property.price)}
                                >
                                    <Popup>
                                        <div className="p-2 min-w-[250px]">
                                            <img
                                                src={property.imageUrl}
                                                alt={property.title}
                                                className="w-full h-32 object-cover rounded-md mb-2"
                                            />
                                            <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                                            <p className="text-primary font-bold text-xl mb-2">
                                                {formatPrice(property.price)}
                                            </p>
                                            <div className="flex gap-3 text-sm text-gray-600 mb-2">
                                                <span className="flex items-center gap-1">
                                                    <Bed className="w-4 h-4" />
                                                    {property.bedrooms}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Bath className="w-4 h-4" />
                                                    {property.bathrooms}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Maximize2 className="w-4 h-4" />
                                                    {property.sqft.toLocaleString()} sqft
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-2">{property.location.address}</p>
                                            <Badge variant="secondary" className="capitalize">
                                                {property.type}
                                            </Badge>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MarkerClusterGroup>
                    </MapContainer>
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                        <Card
                            key={property.id}
                            className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                        >
                            <img
                                src={property.imageUrl}
                                alt={property.title}
                                className="w-full h-48 object-cover"
                            />
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                                    <Badge variant="secondary" className="capitalize">
                                        {property.type}
                                    </Badge>
                                </div>
                                <p className="text-primary font-bold text-2xl mb-3">
                                    {formatPrice(property.price)}
                                </p>
                                <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                                    <span className="flex items-center gap-1">
                                        <Bed className="w-4 h-4" />
                                        {property.bedrooms} beds
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Bath className="w-4 h-4" />
                                        {property.bathrooms} baths
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Maximize2 className="w-4 h-4" />
                                        {property.sqft.toLocaleString()} sqft
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                    {property.description}
                                </p>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span className="line-clamp-1">{property.location.address}, {property.location.city}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* No Results */}
            {filteredProperties.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Home className="w-16 h-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Try adjusting your filters to see more results
                        </p>
                        <Button onClick={handleResetFilters}>Reset Filters</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
