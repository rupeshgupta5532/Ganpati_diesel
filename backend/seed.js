const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ganpati-diesel';

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  const db = mongoose.connection.db;

  console.log('Clearing old data...');
  await Promise.all([
    db.collection('users').deleteMany({}),
    db.collection('admins').deleteMany({}),
    db.collection('services').deleteMany({}),
    db.collection('products').deleteMany({}),
    db.collection('projects').deleteMany({}),
    db.collection('bookings').deleteMany({}),
    db.collection('enquiries').deleteMany({}),
    db.collection('reviews').deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash('SecurePassword123!', 10);

  console.log('Seeding Users & Admins...');
  const { insertedIds: userIds } = await db.collection('users').insertMany([
    {
      name: 'Ram Bahadur',
      email: 'ram@example.com',
      phone: '9801234567',
      passwordHash,
      role: 'USER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Sita Sharma',
      email: 'sita@example.com',
      phone: '9812345678',
      passwordHash,
      role: 'USER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);

  await db.collection('admins').insertOne({
    name: 'Super Admin',
    email: 'admin@ganpatidiesel.com',
    passwordHash,
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const ramId = userIds[0];

  console.log('Seeding Services...');
  const { insertedIds: serviceIds } = await db.collection('services').insertMany([
    {
      name: 'High Pressure Pump Repair',
      slug: 'high-pressure-pump-repair',
      shortDescription: 'Expert repair for high-pressure diesel pumps.',
      description: 'Complete teardown, cleaning, replacing seals and elements, and recalibrating on our high-precision test bench.',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=800',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'CRDI Injector Calibration',
      slug: 'crdi-injector-calibration',
      shortDescription: 'Precise common rail injector testing and repair.',
      description: 'Using advanced computerized test benches to measure delivery and return volumes of CRDI injectors.',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);

  console.log('Seeding Products...');
  await db.collection('products').insertMany([
    {
      name: 'Bosch Injector Nozzle',
      slug: 'bosch-injector-nozzle',
      partNumber: 'BOSCH-INJ-101',
      category: 'Injectors',
      description: 'Genuine OEM replacement nozzle for standard diesel injectors.',
      price: 4500,
      availability: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Delphi Fuel Pump Repair Kit',
      slug: 'delphi-pump-repair-kit',
      partNumber: 'DEL-PRK-55',
      category: 'Repair Kits',
      description: 'Complete seal and gasket set for Delphi rotary pumps.',
      price: 8500,
      availability: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);

  console.log('Seeding Projects...');
  await db.collection('projects').insertMany([
    {
      title: 'Complete Overhaul of Tata 2518 Pump',
      slug: 'tata-2518-pump-overhaul',
      vehicle: 'Tata 2518 Truck',
      serviceType: 'Pump Repair',
      problem: 'Engine stalling under heavy load.',
      solution: 'Replaced worn out rotor head and recalibrated delivery valves.',
      isFeatured: true,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Mahindra Scorpio CRDI Restoration',
      slug: 'mahindra-scorpio-crdi',
      vehicle: 'Mahindra Scorpio',
      serviceType: 'CRDI Repair',
      problem: 'Black smoke and rough idling.',
      solution: 'Ultrasonic cleaning and recalibration of all 4 injectors.',
      isFeatured: true,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);

  console.log('Seeding Bookings & Reviews...');
  const { insertedIds: bookingIds } = await db.collection('bookings').insertMany([
    {
      userId: ramId,
      customerName: 'Ram Bahadur',
      phone: '9801234567',
      email: 'ram@example.com',
      vehicleType: 'Tractor',
      vehicleModel: 'Mahindra 575',
      serviceId: serviceIds[0],
      problemDescription: 'Pump is leaking diesel continuously.',
      preferredDate: new Date(Date.now() + 86400000).toISOString(),
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: ramId,
      customerName: 'Ram Bahadur',
      phone: '9801234567',
      vehicleType: 'Truck',
      vehicleModel: 'Eicher Pro',
      problemDescription: 'Injector replacement needed.',
      preferredDate: new Date(Date.now() - 86400000 * 5).toISOString(),
      status: 'COMPLETED',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);

  await db.collection('reviews').insertOne({
    userId: ramId,
    bookingId: bookingIds[1],
    rating: 5,
    comment: 'Exceptional service! The mechanics found the issue quickly and my truck runs like new.',
    status: 'APPROVED',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('Seeding Enquiries...');
  await db.collection('enquiries').insertOne({
    name: 'Hari Thapa',
    phone: '9845000000',
    subject: 'Bulk Injector Cleaning Cost',
    message: 'I manage a fleet of 5 buses. What is your rate for bulk injector ultrasonic cleaning?',
    status: 'NEW',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('Seeding complete! You can now test the application.');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
