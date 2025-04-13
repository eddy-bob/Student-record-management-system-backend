import { NestFactory } from '@nestjs/core';
import { SeederModule } from '../seeder/seeder.module';
import { OperatorSeeder } from '../seeder/seeders/operator.seeder';
import { CourseSeeder } from '../seeder/seeders/course.seeder';
import { config } from 'dotenv';

async function seed() {
  // Load environment variables
  config();

  const app = await NestFactory.createApplicationContext(SeederModule);

  try {
    // Get all seeders
    const operatorSeeder = app.get(OperatorSeeder);
    const courseSeeder = app.get(CourseSeeder);

    // Run seeders
    console.log('Starting seeding process...');

    console.log('\nSeeding operator...');
    await operatorSeeder.seed();

    console.log('\nSeeding courses...');
    await courseSeeder.seed();

    console.log('\nSeeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

seed();
