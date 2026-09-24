import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting FloodRoute AI Database Seed ---');

  // Clean existing records if any
  try {
    await prisma.aIAnalysis.deleteMany();
    await prisma.floodImage.deleteMany();
    await prisma.floodReport.deleteMany();
    await prisma.roadCondition.deleteMany();
    await prisma.disasterAlert.deleteMany();
    await prisma.weatherAlert.deleteMany();
    await prisma.weatherRecord.deleteMany();
    await prisma.emergencyResource.deleteMany();
    await prisma.savedLocation.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.routeResult.deleteMany();
    await prisma.routeRequest.deleteMany();
    await prisma.user.deleteMany();
  } catch (err) {
    console.log('Cleanup notice:', err);
  }

  // 1. Seed Users
  const adminPasswordHash = await bcrypt.hash('ChangeMe123!', 10);
  const userPasswordHash = await bcrypt.hash('Citizen123!', 10);

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@floodroute.ai',
      name: 'Dr. Aravind Swamy (Chief Operations Officer)',
      passwordHash: adminPasswordHash,
      role: 'SUPER_ADMIN',
      phone: '+91-9876543210',
      isActive: true,
      lastActive: new Date(),
    },
  });

  const analyst = await prisma.user.create({
    data: {
      email: 'analyst@floodroute.ai',
      name: 'Priya Sharma (Disaster Risk Analyst)',
      passwordHash: adminPasswordHash,
      role: 'ANALYST',
      phone: '+91-9876543211',
      isActive: true,
      lastActive: new Date(),
    },
  });

  const citizen = await prisma.user.create({
    data: {
      email: 'citizen@floodroute.ai',
      name: 'Rohan Verma',
      passwordHash: userPasswordHash,
      role: 'CITIZEN',
      phone: '+91-9876543212',
      isActive: true,
      lastActive: new Date(),
    },
  });

  console.log('Seeded users: admin@floodroute.ai, analyst@floodroute.ai, citizen@floodroute.ai');

  // 2. Saved Locations for Citizen
  await prisma.savedLocation.createMany({
    data: [
      {
        userId: citizen.id,
        name: 'Home',
        locationName: 'Velachery Bypass Road, Chennai',
        latitude: 12.9780,
        longitude: 80.2207,
        notes: 'Ground floor residence near lake canal',
      },
      {
        userId: citizen.id,
        name: 'Office (OMR)',
        locationName: 'Tidel Park, Tharamani, Chennai',
        latitude: 12.9892,
        longitude: 80.2483,
        notes: 'Tech park campus, IT expressway',
      },
      {
        userId: citizen.id,
        name: 'Parents Home',
        locationName: 'Koramangala 4th Block, Bengaluru',
        latitude: 12.9352,
        longitude: 77.6245,
        notes: 'Low-lying junction',
      },
    ],
  });

  // 3. Official & Platform Disaster Alerts (Marked DEMO DATA)
  await prisma.disasterAlert.createMany({
    data: [
      {
        title: 'NDMA Inundation Red Alert: Adyar River Catchment Zone',
        description: '[DEMO DATA] Continuous heavy discharge from Chembarambakkam reservoir. Flash flooding alert for low-lying settlements along Adyar river corridor.',
        severity: 'CRITICAL',
        source: 'NDMA_SACHET',
        sourceLabel: 'NDMA / SACHET Disaster Management Authority',
        locationName: 'Saidapet & Adyar Basin, Chennai',
        state: 'Tamil Nadu',
        district: 'Chennai',
        latitude: 13.0213,
        longitude: 80.2231,
        radiusKm: 12.0,
        startTime: new Date(Date.now() - 3600000 * 3),
        expiryTime: new Date(Date.now() + 3600000 * 24),
        isActive: true,
        isOfficial: true,
        isDemo: true,
      },
      {
        title: 'IMD Orange Warning: Extremely Heavy Rainfall in Mumbai Metropolitan Region',
        description: '[DEMO DATA] Intense convective cloud cluster over coastal Maharashtra. Rainfall rates exceeding 45 mm/hr expected during high tide window.',
        severity: 'WARNING',
        source: 'IMD',
        sourceLabel: 'India Meteorological Department (IMD)',
        locationName: 'Mumbai Suburbs & Thane District',
        state: 'Maharashtra',
        district: 'Mumbai Suburban',
        latitude: 19.0760,
        longitude: 72.8777,
        radiusKm: 25.0,
        startTime: new Date(Date.now() - 3600000 * 5),
        expiryTime: new Date(Date.now() + 3600000 * 18),
        isActive: true,
        isOfficial: true,
        isDemo: true,
      },
      {
        title: 'CWC Flash Flood Advisory: Brahmaputra River at Danger Mark',
        description: '[DEMO DATA] River Brahmaputra flowing 0.85m above danger level at Guwahati water gauging station. Embankment monitoring activated.',
        severity: 'CRITICAL',
        source: 'CWC',
        sourceLabel: 'Central Water Commission (CWC)',
        locationName: 'Guwahati Ghats & Kamrup Metro',
        state: 'Assam',
        district: 'Kamrup Metropolitan',
        latitude: 26.1850,
        longitude: 91.7450,
        radiusKm: 30.0,
        startTime: new Date(Date.now() - 3600000 * 8),
        expiryTime: new Date(Date.now() + 3600000 * 48),
        isActive: true,
        isOfficial: true,
        isDemo: true,
      },
      {
        title: 'FloodRoute AI Emergency Routing Platform Alert: Silk Board Underpass Flooding',
        description: '[DEMO DATA] Verified severe waterlogging with stalled commercial buses. Traffic police diverting all airport-bound transit via Koramangala inner ring road.',
        severity: 'DANGER',
        source: 'PLATFORM_FLOODROUTE',
        sourceLabel: 'FloodRoute AI Verified Platform Advisory',
        locationName: 'Central Silk Board Junction, Bengaluru',
        state: 'Karnataka',
        district: 'Bengaluru Urban',
        latitude: 12.9177,
        longitude: 77.6238,
        radiusKm: 6.0,
        startTime: new Date(Date.now() - 3600000 * 2),
        expiryTime: new Date(Date.now() + 3600000 * 12),
        isActive: true,
        isOfficial: false,
        isDemo: true,
      },
      {
        title: 'IMD Heavy Rainfall & Urban Stormwater Warning: Musi River Basin',
        description: '[DEMO DATA] High inflow recorded at Himayat Sagar and Osman Sagar gates. Low-lying areas of Moosarambagh bridge placed on evacuation alert.',
        severity: 'WARNING',
        source: 'IMD',
        sourceLabel: 'IMD Hyderabad Regional Centre',
        locationName: 'Moosarambagh, Hyderabad',
        state: 'Telangana',
        district: 'Hyderabad',
        latitude: 17.3753,
        longitude: 78.5098,
        radiusKm: 10.0,
        startTime: new Date(Date.now() - 3600000 * 4),
        expiryTime: new Date(Date.now() + 3600000 * 16),
        isActive: true,
        isOfficial: true,
        isDemo: true,
      }
    ],
  });

  // 4. Road Conditions (Official & Field)
  await prisma.roadCondition.createMany({
    data: [
      {
        roadName: 'Velachery 100 Feet Main Road',
        locationName: 'Velachery, Chennai',
        condition: 'FLOODED',
        severity: 'CRITICAL',
        reason: '[DEMO DATA] 2.5 feet standing water near Phoenix Mall junction due to canal breach. Only heavy emergency trucks passable.',
        latitude: 12.9815,
        longitude: 80.2180,
        source: 'Greater Chennai Traffic Police',
        isOfficial: true,
        isDemo: true,
      },
      {
        roadName: 'LBS Marg (Kurla West)',
        locationName: 'Kurla, Mumbai',
        condition: 'FLOODED',
        severity: 'HIGH',
        reason: '[DEMO DATA] Mithi river backflow into low-lying roadway. Traffic diverted to Eastern Express Highway.',
        latitude: 19.0688,
        longitude: 72.8790,
        source: 'Brihanmumbai Municipal Corporation (BMC)',
        isOfficial: true,
        isDemo: true,
      },
      {
        roadName: 'Outer Ring Road (Bellandur EcoSpace)',
        locationName: 'Bellandur, Bengaluru',
        condition: 'CAUTION',
        severity: 'MEDIUM',
        reason: '[DEMO DATA] Slow moving traffic due to 8 inches waterlogging on service lanes. Main flyover clear.',
        latitude: 12.9260,
        longitude: 77.6840,
        source: 'Bengaluru Traffic Command',
        isOfficial: true,
        isDemo: true,
      },
      {
        roadName: 'Moosarambagh Cause-way Bridge',
        locationName: 'Moosarambagh, Hyderabad',
        condition: 'BLOCKED',
        severity: 'CRITICAL',
        reason: '[DEMO DATA] Floodwaters overflowing bridge rail. Barricaded by Hyderabad City Police.',
        latitude: 17.3760,
        longitude: 78.5085,
        source: 'Hyderabad City Traffic Police',
        isOfficial: true,
        isDemo: true,
      },
      {
        roadName: 'EM Bypass (Ruby Hospital Junction)',
        locationName: 'Kolkata',
        condition: 'CAUTION',
        severity: 'MEDIUM',
        reason: '[DEMO DATA] Surface water accumulation following persistent thunderstorm. Moderate slow-down.',
        latitude: 22.5134,
        longitude: 88.3995,
        source: 'Kolkata Traffic Police',
        isOfficial: true,
        isDemo: true,
      },
      {
        roadName: 'NH-16 Krishna River Bund Road',
        locationName: 'Prakasam Barrage, Vijayawada',
        condition: 'CAUTION',
        severity: 'LOW',
        reason: '[DEMO DATA] High water discharge at Prakasam Barrage. Bund road monitored, normal speeds.',
        latitude: 16.5074,
        longitude: 80.6050,
        source: 'Andhra Pradesh Disaster Management',
        isOfficial: true,
        isDemo: true,
      },
    ],
  });

  // 5. Flood Reports with AI Vision Analysis
  const report1 = await prisma.floodReport.create({
    data: {
      reportCode: 'FR-2026-000182',
      userId: citizen.id,
      hazardType: 'FLOODED_ROAD',
      severity: 'HIGH',
      waterLevel: 'DIFFICULT_CARS',
      latitude: 12.9805,
      longitude: 80.2195,
      locationName: 'Velachery 100 Feet Road, Chennai',
      district: 'Chennai',
      state: 'Tamil Nadu',
      description: '[DEMO DATA] Water depth is over 1.5 feet near the metro pillar. Sedans and hatchbacks are stalling. Two auto-rickshaws broke down in the middle lane.',
      status: 'VERIFIED',
      verifiedAt: new Date(Date.now() - 3600000 * 2),
      verifiedBy: analyst.id,
      upvotes: 24,
      isDemo: true,
      imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    },
  });

  await prisma.aIAnalysis.create({
    data: {
      reportId: report1.id,
      floodDetected: true,
      estimatedSeverity: 'HIGH',
      roadVisibility: 'PARTIALLY_SUBMERGED',
      vehicleAccessibility: 'DIFFICULT',
      confidence: 89,
      waterCoveragePercent: 44.8,
      dominantColor: 'Turbid / Muddy Brown',
      explanation: 'Extensive murky brown water identified across 44.8% of road surface. Lane markers obscured, substantial vehicle stalling hazard identified.',
    },
  });

  const report2 = await prisma.floodReport.create({
    data: {
      reportCode: 'FR-2026-000183',
      userId: citizen.id,
      hazardType: 'WATERLOGGING',
      severity: 'MEDIUM',
      waterLevel: 'DIFFICULT_SMALL',
      latitude: 19.0695,
      longitude: 72.8805,
      locationName: 'Kurla Station Road, Mumbai',
      district: 'Mumbai Suburban',
      state: 'Maharashtra',
      description: '[DEMO DATA] Waterlogging around station subways and bus terminus. Two-wheelers struggling, buses proceeding slowly.',
      status: 'VERIFIED',
      verifiedAt: new Date(Date.now() - 3600000 * 1),
      verifiedBy: analyst.id,
      upvotes: 18,
      isDemo: true,
      imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
    },
  });

  await prisma.aIAnalysis.create({
    data: {
      reportId: report2.id,
      floodDetected: true,
      estimatedSeverity: 'MEDIUM',
      roadVisibility: 'PARTIALLY_SUBMERGED',
      vehicleAccessibility: 'DIFFICULT',
      confidence: 84,
      waterCoveragePercent: 26.3,
      dominantColor: 'Reflective Surface Water',
      explanation: 'Standing stormwater observed on right-side carriageway. Pedestrian walkway flooded; motor vehicles passable with caution.',
    },
  });

  const report3 = await prisma.floodReport.create({
    data: {
      reportCode: 'FR-2026-000184',
      userId: null,
      hazardType: 'ROAD_BLOCKED',
      severity: 'CRITICAL',
      waterLevel: 'IMPASSABLE',
      latitude: 12.9180,
      longitude: 77.6240,
      locationName: 'Silk Board Underpass, Bengaluru',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      description: '[DEMO DATA] Complete submergence in underpass dip. Water level estimated around 4 feet. Fire service deployed for de-watering.',
      status: 'PENDING',
      upvotes: 7,
      isDemo: true,
    },
  });

  await prisma.aIAnalysis.create({
    data: {
      reportId: report3.id,
      floodDetected: true,
      estimatedSeverity: 'CRITICAL',
      roadVisibility: 'COMPLETELY_SUBMERGED',
      vehicleAccessibility: 'IMPASSABLE',
      confidence: 93,
      waterCoveragePercent: 78.4,
      dominantColor: 'Turbid / Muddy Brown',
      explanation: 'Deep standing water spanning nearly whole corridor. Total loss of asphalt traction, zero vehicular clearance.',
    },
  });

  const report4 = await prisma.floodReport.create({
    data: {
      reportCode: 'FR-2026-000185',
      userId: null,
      hazardType: 'FALLEN_TREE',
      severity: 'MEDIUM',
      waterLevel: 'PASSABLE',
      latitude: 17.4320,
      longitude: 78.4070,
      locationName: 'Jubilee Hills Road No. 36, Hyderabad',
      district: 'Hyderabad',
      state: 'Telangana',
      description: '[DEMO DATA] Large banyan branch snapped during storm, blocking left lane. GHMC disaster response team en route.',
      status: 'UNDER_REVIEW',
      upvotes: 4,
      isDemo: true,
    },
  });

  await prisma.aIAnalysis.create({
    data: {
      reportId: report4.id,
      floodDetected: false,
      estimatedSeverity: 'MEDIUM',
      roadVisibility: 'CLEAR',
      vehicleAccessibility: 'PASSABLE',
      confidence: 88,
      waterCoveragePercent: 4.2,
      dominantColor: 'Dry / Normal Asphalt',
      explanation: 'Vegetation debris and structural obstruction detected. Road surface not submerged; detour needed around left lane.',
    },
  });

  // 6. Emergency Resources (Hospitals, Police, Fire, Shelters across sample cities)
  await prisma.emergencyResource.createMany({
    data: [
      // Chennai
      {
        name: 'Government Multi Super Speciality Hospital, Omandurar',
        category: 'HOSPITAL',
        address: 'Anna Salai, Triplicane, Chennai, Tamil Nadu 600002',
        city: 'Chennai',
        state: 'Tamil Nadu',
        phone: '044-25305000',
        latitude: 13.0694,
        longitude: 80.2742,
        isOpen: true,
        notes: '24/7 Trauma and Flood Emergency Ward active',
        isDemo: true,
      },
      {
        name: 'Velachery Police Station (J-7)',
        category: 'POLICE_STATION',
        address: 'Velachery Bypass Rd, Dandeeswaram, Chennai, Tamil Nadu 600042',
        city: 'Chennai',
        state: 'Tamil Nadu',
        phone: '044-22442434',
        latitude: 12.9810,
        longitude: 80.2220,
        isOpen: true,
        notes: 'Equipped with SDRF rescue boats and emergency shelter helpline',
        isDemo: true,
      },
      {
        name: 'Tamil Nadu Fire & Rescue Station, Guindy',
        category: 'FIRE_STATION',
        address: 'GST Road, Guindy Industrial Estate, Chennai 600032',
        city: 'Chennai',
        state: 'Tamil Nadu',
        phone: '101',
        latitude: 13.0067,
        longitude: 80.2025,
        isOpen: true,
        notes: 'High-capacity de-watering pumps and rubber inflatable rafts',
        isDemo: true,
      },
      {
        name: 'Chennai Corporation Community Flood Relief Shelter',
        category: 'SHELTER',
        address: 'Velachery Main Rd, Dhandeeswaram Nagar, Chennai 600042',
        city: 'Chennai',
        state: 'Tamil Nadu',
        phone: '044-25619206',
        latitude: 12.9772,
        longitude: 80.2215,
        isOpen: true,
        notes: 'Capacity: 450 persons. Clean drinking water, food packets, medical kits available',
        isDemo: true,
      },
      // Mumbai
      {
        name: 'KEM Hospital (King Edward Memorial)',
        category: 'HOSPITAL',
        address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012',
        city: 'Mumbai',
        state: 'Maharashtra',
        phone: '022-24107000',
        latitude: 19.0028,
        longitude: 72.8427,
        isOpen: true,
        notes: 'Apex disaster hospital with elevated power backup',
        isDemo: true,
      },
      {
        name: 'Kurla Police Station',
        category: 'POLICE_STATION',
        address: 'SG Barve Marg, Kurla West, Mumbai 400070',
        city: 'Mumbai',
        state: 'Maharashtra',
        phone: '022-26500332',
        latitude: 19.0664,
        longitude: 72.8833,
        isOpen: true,
        notes: 'NDRF liaison outpost',
        isDemo: true,
      },
      {
        name: 'BMC Disaster Control Room & Municipal Shelter',
        category: 'RELIEF_CENTER',
        address: 'Kurla Municipal School Hall, Pipe Road, Kurla West 400070',
        city: 'Mumbai',
        state: 'Maharashtra',
        phone: '1916',
        latitude: 19.0701,
        longitude: 72.8795,
        isOpen: true,
        notes: 'Dry ration, dry clothing and emergency beds for displaced families',
        isDemo: true,
      },
      // Bengaluru
      {
        name: 'St. John’s Medical College Hospital',
        category: 'HOSPITAL',
        address: 'Sarjapur Main Rd, John Nagar, Koramangala, Bengaluru 560034',
        city: 'Bengaluru',
        state: 'Karnataka',
        phone: '080-22065000',
        latitude: 12.9304,
        longitude: 77.6200,
        isOpen: true,
        notes: 'Comprehensive 24/7 emergency response units',
        isDemo: true,
      },
      {
        name: 'Madiwala Police Station',
        category: 'POLICE_STATION',
        address: 'Hosur Road, Madiwala, Bengaluru 560068',
        city: 'Bengaluru',
        state: 'Karnataka',
        phone: '080-22942555',
        latitude: 12.9220,
        longitude: 77.6180,
        isOpen: true,
        notes: 'Flood relief coordination center for Silk Board area',
        isDemo: true,
      },
      // Hyderabad
      {
        name: 'Osmania General Hospital',
        category: 'HOSPITAL',
        address: 'Afzal Gunj, Hyderabad, Telangana 500012',
        city: 'Hyderabad',
        state: 'Telangana',
        phone: '040-24600121',
        latitude: 17.3789,
        longitude: 78.4735,
        isOpen: true,
        notes: 'Disaster management medical emergency center',
        isDemo: true,
      },
      // Guwahati
      {
        name: 'Guwahati Medical College & Hospital (GMCH)',
        category: 'HOSPITAL',
        address: 'Narakasur Hilltop, Bhangagarh, Guwahati, Assam 781032',
        city: 'Guwahati',
        state: 'Assam',
        phone: '0361-2529457',
        latitude: 26.1558,
        longitude: 91.7700,
        isOpen: true,
        notes: 'State nodal disaster triage facility',
        isDemo: true,
      },
    ],
  });

  // 7. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: citizen.id,
        title: 'Flood Alert Near Saved Location: Velachery',
        message: 'A critical flood report (FR-2026-000182) was verified 450m from your saved home location.',
        type: 'ALERT',
        linkUrl: '/live-map?lat=12.9805&lng=80.2195',
      },
      {
        userId: citizen.id,
        title: 'Road Blockage Advisory',
        message: 'Silk Board underpass has been barricaded due to severe inundation. Divert to outer ring road.',
        type: 'ROAD_UPDATE',
        linkUrl: '/route-planner',
      },
    ],
  });

  // 8. Seed Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        adminId: analyst.id,
        action: 'REPORT_APPROVED',
        entity: 'FloodReport',
        entityId: report1.id,
        details: 'Verified against traffic camera telemetry and corroborating reports.',
        ipAddress: '192.168.1.104',
      },
      {
        adminId: superAdmin.id,
        action: 'ALERT_CREATED',
        entity: 'DisasterAlert',
        entityId: 'alert-001',
        details: 'Issued official platform alert for Chembarambakkam discharge.',
        ipAddress: '192.168.1.101',
      },
    ],
  });

  console.log('--- Database Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
