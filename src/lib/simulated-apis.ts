// Simulated DVLA vehicle lookup
const vehicleDatabase: Record<string, { make: string; model: string; colour: string; year: number; fuelType: string; engineSize: string; taxStatus: string; motExpiry: string }> = {
  "AB12CDE": { make: "BMW", model: "320d M Sport", colour: "Black", year: 2021, fuelType: "Diesel", engineSize: "1995cc", taxStatus: "Taxed", motExpiry: "2025-08-15" },
  "CD34FGH": { make: "Audi", model: "A4 S Line", colour: "White", year: 2020, fuelType: "Petrol", engineSize: "1984cc", taxStatus: "Taxed", motExpiry: "2025-03-22" },
  "EF56IJK": { make: "Mercedes-Benz", model: "C200 AMG Line", colour: "Silver", year: 2022, fuelType: "Petrol", engineSize: "1496cc", taxStatus: "Taxed", motExpiry: "2025-11-01" },
  "GH78LMN": { make: "Volkswagen", model: "Golf R", colour: "Blue", year: 2021, fuelType: "Petrol", engineSize: "1984cc", taxStatus: "Taxed", motExpiry: "2025-06-30" },
  "IJ90OPQ": { make: "Ford", model: "Focus ST", colour: "Red", year: 2019, fuelType: "Petrol", engineSize: "2261cc", taxStatus: "Taxed", motExpiry: "2025-01-18" },
  "KL12RST": { make: "Toyota", model: "Yaris Hybrid", colour: "Grey", year: 2023, fuelType: "Hybrid", engineSize: "1490cc", taxStatus: "Taxed", motExpiry: "2026-02-28" },
  "MN34UVW": { make: "Range Rover", model: "Sport HSE", colour: "Green", year: 2022, fuelType: "Diesel", engineSize: "2996cc", taxStatus: "Taxed", motExpiry: "2025-09-10" },
  "OP56XYZ": { make: "Nissan", model: "Qashqai Tekna", colour: "Black", year: 2020, fuelType: "Petrol", engineSize: "1332cc", taxStatus: "Taxed", motExpiry: "2025-04-05" },
};

export interface DVLAVehicle {
  make: string;
  model: string;
  colour: string;
  year: number;
  fuelType: string;
  engineSize: string;
  taxStatus: string;
  motExpiry: string;
  registration: string;
}

export async function lookupVehicle(registration: string): Promise<DVLAVehicle | null> {
  await new Promise(r => setTimeout(r, 800));
  const reg = registration.replace(/\s/g, "").toUpperCase();
  const data = vehicleDatabase[reg];
  if (!data) {
    // Generate random vehicle for any reg
    const makes = ["Ford", "Vauxhall", "Peugeot", "Kia", "Hyundai", "Honda", "Mazda"];
    const models = ["Focus", "Corsa", "208", "Sportage", "Tucson", "Civic", "CX-5"];
    const colours = ["Black", "White", "Silver", "Blue", "Red", "Grey"];
    const i = Math.floor(Math.random() * makes.length);
    return {
      make: makes[i],
      model: models[i],
      colour: colours[Math.floor(Math.random() * colours.length)],
      year: 2018 + Math.floor(Math.random() * 6),
      fuelType: Math.random() > 0.5 ? "Petrol" : "Diesel",
      engineSize: `${1000 + Math.floor(Math.random() * 2000)}cc`,
      taxStatus: "Taxed",
      motExpiry: "2025-12-31",
      registration: reg,
    };
  }
  return { ...data, registration: reg };
}

// Simulated Address Lookup
const postcodeDatabase: Record<string, { line1: string; line2: string; city: string; county: string; postcode: string }[]> = {
  "SW1A1AA": [
    { line1: "Buckingham Palace", line2: "", city: "London", county: "Greater London", postcode: "SW1A 1AA" },
  ],
  "B11QT": [
    { line1: "1 Colmore Row", line2: "", city: "Birmingham", county: "West Midlands", postcode: "B1 1QT" },
    { line1: "2 Colmore Row", line2: "Suite 4", city: "Birmingham", county: "West Midlands", postcode: "B1 1QT" },
    { line1: "3 Colmore Row", line2: "", city: "Birmingham", county: "West Midlands", postcode: "B1 1QT" },
  ],
  "M11AA": [
    { line1: "1 Piccadilly", line2: "", city: "Manchester", county: "Greater Manchester", postcode: "M1 1AA" },
    { line1: "15 Portland Street", line2: "", city: "Manchester", county: "Greater Manchester", postcode: "M1 1AA" },
  ],
  "LS11UR": [
    { line1: "1 City Square", line2: "", city: "Leeds", county: "West Yorkshire", postcode: "LS1 1UR" },
    { line1: "10 Park Row", line2: "", city: "Leeds", county: "West Yorkshire", postcode: "LS1 1UR" },
  ],
};

export interface Address {
  line1: string;
  line2: string;
  city: string;
  county: string;
  postcode: string;
}

export async function lookupPostcode(postcode: string): Promise<Address[]> {
  await new Promise(r => setTimeout(r, 600));
  const clean = postcode.replace(/\s/g, "").toUpperCase();
  const results = postcodeDatabase[clean];
  if (results) return results;
  // Generate fake addresses for any postcode
  return [
    { line1: `${Math.floor(Math.random() * 100) + 1} High Street`, line2: "", city: "Anytown", county: "Countyshire", postcode: postcode.toUpperCase() },
    { line1: `${Math.floor(Math.random() * 100) + 1} Station Road`, line2: "Flat B", city: "Anytown", county: "Countyshire", postcode: postcode.toUpperCase() },
  ];
}
