import { seedAdminData } from './src/services/seedAdminData';

// Replace alert with console.log
const originalAlert = global.alert;
(global as any).alert = console.log;

seedAdminData().then(() => {
  console.log("Seeding complete. Exiting...");
  process.exit(0);
}).catch((e) => {
  console.error("Failed", e);
  process.exit(1);
});
