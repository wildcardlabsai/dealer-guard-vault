export interface CoverItem {
  name: string;
  category: string;
  explanation: string;
  note?: string;
  keywords: string[];
}

export interface CoverFAQ {
  question: string;
  answer: string;
}

export interface CoverTemplate {
  id: string;
  dealerId: string;
  name: string;
  levelName: string;
  description: string;
  brochureIntro: string;
  certificateSummary: string;
  claimInstructions: string;
  coveredItems: CoverItem[];
  excludedItems: CoverItem[];
  conditionalItems: CoverItem[];
  faqs: CoverFAQ[];
  termsDocUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const coverCategories = [
  "Engine", "Gearbox", "Electrical", "Cooling System", "Fuel System",
  "Suspension", "Steering", "Braking", "Other"
];

export const demoCoverTemplates: CoverTemplate[] = [
  {
    id: "ct-1",
    dealerId: "d-1",
    name: "Basic Cover",
    levelName: "Basic",
    description: "Essential engine and gearbox protection for peace of mind.",
    brochureIntro: "Our Basic cover gives you essential protection on the key mechanical components of your vehicle. Designed for drivers who want straightforward cover without the complexity.",
    certificateSummary: "This warranty provides basic mechanical cover for your vehicle's engine and gearbox components.",
    claimInstructions: "Log into your customer portal to start a new claim. Upload photos and any diagnostic reports. Please do not authorise repairs before contacting your dealership.",
    coveredItems: [
      { name: "Engine internal components", category: "Engine", explanation: "Pistons, con rods, crankshaft, valves, camshaft, oil pump and cylinder head gasket.", keywords: ["engine", "pistons", "crankshaft", "valves", "camshaft", "oil pump", "head gasket", "cylinder"] },
      { name: "Gearbox internals", category: "Gearbox", explanation: "All internal gears, bearings, selectors and shafts within the gearbox housing.", keywords: ["gearbox", "transmission", "gears", "bearings", "selectors"] },
      { name: "Differential", category: "Gearbox", explanation: "Crown wheel, pinion, bearings and internal components.", keywords: ["differential", "diff", "crown wheel", "pinion"] },
    ],
    excludedItems: [
      { name: "Clutch and friction plate", category: "Gearbox", explanation: "Clutches are treated as wear and tear items unless explicitly stated otherwise.", keywords: ["clutch", "friction plate", "clutch plate"] },
      { name: "Brake pads and discs", category: "Braking", explanation: "Brake pads and discs are considered service consumables.", keywords: ["brake pads", "brake discs", "brakes"] },
      { name: "Electrical systems", category: "Electrical", explanation: "Electrical components are not included in basic cover.", keywords: ["electrical", "wiring", "ECU", "sensors", "alternator", "starter motor"] },
      { name: "Cooling system", category: "Cooling System", explanation: "Radiator, water pump and thermostat are not included.", keywords: ["radiator", "water pump", "thermostat", "cooling", "coolant"] },
      { name: "Service items and fluids", category: "Other", explanation: "Oil, filters, spark plugs, wiper blades, bulbs and routine maintenance items.", keywords: ["oil", "filter", "spark plugs", "wipers", "bulbs", "service"] },
      { name: "Wear and tear items", category: "Other", explanation: "Items that deteriorate through normal use over time.", keywords: ["wear", "tear", "wear and tear"] },
      { name: "Cosmetic and bodywork", category: "Other", explanation: "Paint, trim, upholstery, glass and bodywork damage.", keywords: ["paint", "bodywork", "cosmetic", "trim", "upholstery", "glass"] },
      { name: "Modifications", category: "Other", explanation: "Any non-standard modifications or aftermarket parts.", keywords: ["modifications", "modified", "aftermarket", "tuning"] },
    ],
    conditionalItems: [
      { name: "Diagnostics", category: "Other", explanation: "Diagnostic charges may be covered subject to prior approval from your dealership.", keywords: ["diagnostics", "diagnostic", "fault code", "scan"], note: "Subject to dealer approval" },
    ],
    faqs: [
      { question: "Is the clutch covered?", answer: "No. Under basic cover, the clutch is treated as a wear and tear item and is not covered." },
      { question: "Are diagnostics covered?", answer: "Diagnostics may be covered subject to prior approval from your dealership. Always check before authorising." },
      { question: "Can I take my vehicle to any garage?", answer: "You should contact your dealership before taking your vehicle to any garage. Unauthorised repairs may not be covered." },
      { question: "What should I do before authorising repairs?", answer: "Always contact your dealership first. Do not authorise any repairs until you have received confirmation from your warranty provider." },
    ],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "ct-2",
    dealerId: "d-1",
    name: "Standard Cover",
    levelName: "Standard",
    description: "Comprehensive mechanical and electrical protection for most drivers.",
    brochureIntro: "Our Standard cover provides comprehensive protection covering your engine, gearbox, electrical systems, cooling and fuel systems. The most popular choice for used car buyers wanting reliable cover.",
    certificateSummary: "This warranty provides comprehensive mechanical and electrical cover for your vehicle.",
    claimInstructions: "Log into your customer portal to start a new claim. Upload photos and any diagnostic reports. Please do not authorise repairs before contacting your dealership.",
    coveredItems: [
      { name: "Engine internal components", category: "Engine", explanation: "Pistons, con rods, crankshaft, valves, camshaft, oil pump, cylinder head gasket, timing chain and tensioners.", keywords: ["engine", "pistons", "crankshaft", "valves", "camshaft", "oil pump", "head gasket", "timing chain", "cylinder"] },
      { name: "Turbocharger / supercharger", category: "Engine", explanation: "Turbo unit, wastegate, boost control valve and supercharger components where factory fitted.", keywords: ["turbo", "turbocharger", "supercharger", "boost", "wastegate"] },
      { name: "Gearbox and transmission", category: "Gearbox", explanation: "All internal gears, bearings, selectors, shafts, torque converter and valve body.", keywords: ["gearbox", "transmission", "gears", "bearings", "torque converter"] },
      { name: "Differential", category: "Gearbox", explanation: "Crown wheel, pinion, bearings and internal components.", keywords: ["differential", "diff"] },
      { name: "Electrical systems", category: "Electrical", explanation: "Alternator, starter motor, window motors, central locking motors and wiper motors.", keywords: ["electrical", "alternator", "starter motor", "window motor", "central locking", "wiper motor"] },
      { name: "Cooling system", category: "Cooling System", explanation: "Water pump, thermostat and radiator.", keywords: ["cooling", "water pump", "thermostat", "radiator", "coolant"] },
      { name: "Fuel system", category: "Fuel System", explanation: "Fuel pump, fuel injectors and fuel pressure regulator.", keywords: ["fuel pump", "injectors", "fuel pressure", "fuel system"] },
      { name: "Steering components", category: "Steering", explanation: "Power steering pump, steering rack and column.", keywords: ["steering", "power steering", "steering rack", "steering column"] },
    ],
    excludedItems: [
      { name: "Clutch and friction plate", category: "Gearbox", explanation: "Clutches are treated as wear and tear unless explicitly stated otherwise.", keywords: ["clutch", "friction plate"] },
      { name: "Brake pads and discs", category: "Braking", explanation: "Brake pads and discs are considered service consumables.", keywords: ["brake pads", "brake discs", "brakes"] },
      { name: "Suspension components", category: "Suspension", explanation: "Shock absorbers, springs, bushes and anti-roll bar links.", keywords: ["suspension", "shock absorbers", "springs", "bushes", "anti-roll bar"] },
      { name: "Service items and fluids", category: "Other", explanation: "Oil, filters, spark plugs, wiper blades, bulbs and routine maintenance items.", keywords: ["oil", "filter", "spark plugs", "service"] },
      { name: "Wear and tear items", category: "Other", explanation: "Items that deteriorate through normal use over time.", keywords: ["wear", "tear"] },
      { name: "Cosmetic and bodywork", category: "Other", explanation: "Paint, trim, upholstery, glass and bodywork damage.", keywords: ["paint", "bodywork", "cosmetic"] },
      { name: "Modifications", category: "Other", explanation: "Any non-standard modifications or aftermarket parts.", keywords: ["modifications", "modified", "aftermarket"] },
    ],
    conditionalItems: [
      { name: "Diagnostics", category: "Other", explanation: "Diagnostic charges may be covered subject to prior approval from your dealership.", keywords: ["diagnostics", "diagnostic"], note: "Subject to dealer approval" },
      { name: "Labour rate cap", category: "Other", explanation: "Labour charges are capped at the dealer's agreed rate. Excess labour costs are the customer's responsibility.", keywords: ["labour", "labor", "rate"], note: "Capped at agreed rate" },
      { name: "Consequential damage", category: "Other", explanation: "Damage caused as a result of a covered component failure may be covered subject to policy terms.", keywords: ["consequential", "secondary damage"], note: "Subject to policy terms" },
    ],
    faqs: [
      { question: "Is the clutch covered?", answer: "No. The clutch is treated as a wear and tear item and is not covered under standard warranty." },
      { question: "Is the timing chain covered?", answer: "Yes. The timing chain and tensioners are covered under standard warranty." },
      { question: "Are diagnostics covered?", answer: "Diagnostics may be covered subject to prior approval. Always contact your dealership before authorising diagnostics." },
      { question: "Are wear and tear items covered?", answer: "No. Items that deteriorate through normal use, such as brake pads, clutch plates, and wiper blades, are not covered." },
      { question: "Can I take my vehicle to any garage?", answer: "You should contact your dealership before taking your vehicle to any garage. Unauthorised repairs may not be covered." },
      { question: "What should I do before authorising repairs?", answer: "Always contact your dealership first. Do not authorise any repairs until you have received confirmation." },
    ],
    createdAt: "2024-01-15",
    updatedAt: "2024-03-10",
  },
  {
    id: "ct-3",
    dealerId: "d-1",
    name: "Premium Cover",
    levelName: "Premium",
    description: "Our most comprehensive warranty with maximum protection and peace of mind.",
    brochureIntro: "Our Premium cover offers our highest level of protection. Covering virtually all mechanical and electrical components, this warranty gives you maximum peace of mind. Ideal for newer vehicles or drivers who want the most complete cover available.",
    certificateSummary: "This warranty provides our most comprehensive level of cover across all major mechanical and electrical systems.",
    claimInstructions: "Log into your customer portal to start a new claim. Upload photos and any diagnostic reports. For urgent issues, you can also call your dedicated warranty line. Please do not authorise repairs before contacting your dealership.",
    coveredItems: [
      { name: "Engine internal components", category: "Engine", explanation: "Full engine internals including pistons, con rods, crankshaft, valves, camshaft, oil pump, cylinder head gasket, timing chain, tensioners and pulleys.", keywords: ["engine", "pistons", "crankshaft", "valves", "camshaft", "oil pump", "head gasket", "timing chain", "pulleys"] },
      { name: "Turbocharger / supercharger", category: "Engine", explanation: "Complete turbo assembly including wastegate, boost control valve, actuator and intercooler.", keywords: ["turbo", "turbocharger", "supercharger", "boost", "wastegate", "intercooler"] },
      { name: "Gearbox and transmission", category: "Gearbox", explanation: "All internal components, torque converter, valve body, mechatronic unit and transfer case.", keywords: ["gearbox", "transmission", "torque converter", "mechatronic", "transfer case"] },
      { name: "Differential and driveshafts", category: "Gearbox", explanation: "Crown wheel, pinion, bearings, CV joints and propshaft.", keywords: ["differential", "diff", "driveshaft", "CV joint", "propshaft"] },
      { name: "Electrical systems", category: "Electrical", explanation: "Alternator, starter motor, ECU, window motors, central locking, wiper motors, sensors and actuators.", keywords: ["electrical", "alternator", "starter motor", "ECU", "sensors", "actuators", "window motor"] },
      { name: "Cooling system", category: "Cooling System", explanation: "Water pump, thermostat, radiator, expansion tank, cooling fans and heater matrix.", keywords: ["cooling", "water pump", "thermostat", "radiator", "heater matrix", "cooling fan"] },
      { name: "Fuel system", category: "Fuel System", explanation: "Fuel pump, injectors, fuel pressure regulator, fuel rail and throttle body.", keywords: ["fuel pump", "injectors", "fuel pressure", "throttle body", "fuel rail"] },
      { name: "Suspension", category: "Suspension", explanation: "Shock absorbers, springs, top mounts, drop links and control arms.", keywords: ["suspension", "shock absorbers", "springs", "top mounts", "drop links", "control arms"] },
      { name: "Steering components", category: "Steering", explanation: "Power steering pump, steering rack, column, track rod ends and steering angle sensor.", keywords: ["steering", "power steering", "steering rack", "track rod"] },
      { name: "Braking system components", category: "Braking", explanation: "Brake callipers, brake master cylinder, ABS pump and wheel speed sensors.", keywords: ["brake callipers", "master cylinder", "ABS", "wheel speed sensor"] },
      { name: "Air conditioning", category: "Other", explanation: "AC compressor, condenser and evaporator.", keywords: ["air conditioning", "AC", "compressor", "condenser", "aircon"] },
    ],
    excludedItems: [
      { name: "Clutch friction plate", category: "Gearbox", explanation: "The clutch friction plate is treated as a wear item. However, the clutch release bearing and slave cylinder are covered.", keywords: ["clutch", "friction plate"], note: "Release bearing IS covered" },
      { name: "Brake pads and discs", category: "Braking", explanation: "Brake pads and discs are considered consumable service items.", keywords: ["brake pads", "brake discs"] },
      { name: "Service items and fluids", category: "Other", explanation: "Oil, filters, spark plugs, wiper blades, bulbs and routine maintenance items.", keywords: ["oil", "filter", "spark plugs", "service"] },
      { name: "Cosmetic and bodywork", category: "Other", explanation: "Paint, trim, upholstery, glass and bodywork damage.", keywords: ["paint", "bodywork", "cosmetic"] },
      { name: "Modifications", category: "Other", explanation: "Any non-standard modifications or aftermarket parts.", keywords: ["modifications", "modified", "aftermarket"] },
    ],
    conditionalItems: [
      { name: "Diagnostics", category: "Other", explanation: "Diagnostic charges are covered up to £150 per claim subject to a valid covered fault being found.", keywords: ["diagnostics", "diagnostic"], note: "Up to £150 per claim" },
      { name: "Labour rate cap", category: "Other", explanation: "Labour charges are capped at the dealer's agreed rate.", keywords: ["labour", "labor", "rate"], note: "Capped at agreed rate" },
      { name: "Consequential damage", category: "Other", explanation: "Damage caused as a result of a covered component failure is covered up to the warranty value.", keywords: ["consequential", "secondary damage"], note: "Up to warranty value" },
      { name: "Timing chain", category: "Engine", explanation: "Timing chain claims may depend on evidence of correct maintenance history.", keywords: ["timing chain", "timing belt"], note: "Subject to service history" },
    ],
    faqs: [
      { question: "Is the clutch covered?", answer: "The clutch friction plate is not covered as it's a wear item. However, the clutch release bearing and slave cylinder ARE covered under premium warranty." },
      { question: "Is the timing chain covered?", answer: "Yes, the timing chain is covered. However, claims may require evidence of correct maintenance history." },
      { question: "Are diagnostics covered?", answer: "Yes, diagnostics are covered up to £150 per claim when a valid covered fault is found." },
      { question: "Are wear and tear items covered?", answer: "No. Items that deteriorate through normal use are not covered. This includes brake pads, wiper blades, and similar consumables." },
      { question: "Can I take my vehicle to any garage?", answer: "You should contact your dealership before taking your vehicle to any garage. Unauthorised repairs may not be covered." },
      { question: "What should I do before authorising repairs?", answer: "Always contact your dealership first. Do not authorise any repairs until you have received confirmation." },
      { question: "Is air conditioning covered?", answer: "Yes. The AC compressor, condenser and evaporator are all covered under premium warranty." },
    ],
    createdAt: "2024-01-15",
    updatedAt: "2024-06-01",
  },
  {
    id: "ct-4",
    dealerId: "d-2",
    name: "Standard Cover",
    levelName: "Standard",
    description: "Comprehensive mechanical protection for City Autos customers.",
    brochureIntro: "City Autos Standard cover provides solid mechanical and electrical protection for your vehicle.",
    certificateSummary: "This warranty provides standard mechanical and electrical cover.",
    claimInstructions: "Log into your customer portal to start a new claim, or contact City Autos directly.",
    coveredItems: [
      { name: "Engine internals", category: "Engine", explanation: "All major engine internal components.", keywords: ["engine", "pistons", "crankshaft", "valves"] },
      { name: "Gearbox", category: "Gearbox", explanation: "All internal gearbox components.", keywords: ["gearbox", "transmission"] },
      { name: "Electrical", category: "Electrical", explanation: "Alternator, starter motor and window motors.", keywords: ["electrical", "alternator", "starter motor"] },
      { name: "Cooling system", category: "Cooling System", explanation: "Water pump, thermostat and radiator.", keywords: ["cooling", "water pump", "radiator"] },
    ],
    excludedItems: [
      { name: "Clutch", category: "Gearbox", explanation: "Wear and tear item.", keywords: ["clutch"] },
      { name: "Brake consumables", category: "Braking", explanation: "Pads and discs.", keywords: ["brake pads", "brake discs", "brakes"] },
      { name: "Service items", category: "Other", explanation: "Oil, filters and routine maintenance.", keywords: ["service", "oil", "filter"] },
      { name: "Bodywork", category: "Other", explanation: "Cosmetic damage.", keywords: ["bodywork", "paint", "cosmetic"] },
    ],
    conditionalItems: [
      { name: "Diagnostics", category: "Other", explanation: "Subject to approval.", keywords: ["diagnostics"], note: "Subject to approval" },
    ],
    faqs: [
      { question: "Is the clutch covered?", answer: "No, the clutch is treated as a wear and tear item." },
      { question: "What should I do before authorising repairs?", answer: "Always contact City Autos before authorising any work." },
    ],
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01",
  },
];

// Mapping: warranty ID -> cover template ID
export const warrantyTemplateMap: Record<string, string> = {
  "w-1": "ct-2", // John Smith BMW -> Standard
  "w-2": "ct-3", // Emma Wilson Audi -> Premium
  "w-3": "ct-4", // David Brown Mercedes -> Standard (City Autos)
  "w-4": "ct-1", // Sarah Jones VW -> Basic
  "w-5": "ct-4", // Michael Taylor Ford -> Standard (City Autos)
  "w-6": "ct-3", // John Smith Toyota -> Premium
};
