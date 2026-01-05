
import { User, Donation, Role } from '../types';

const USERS_KEY = 'welfare_users';
const DONATIONS_KEY = 'welfare_donations';

export const dbService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: User) => {
    const users = dbService.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getDonations: (): Donation[] => {
    const data = localStorage.getItem(DONATIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  addDonation: (donation: Donation) => {
    const donations = dbService.getDonations();
    donations.push(donation);
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
  },

  // Helper to seed an admin for testing
  seedAdmin: () => {
    const users = dbService.getUsers();
    if (!users.find(u => u.email === 'admin@welfare.org')) {
      const admin: User = {
        id: 'admin-001',
        fullName: 'System Admin',
        email: 'admin@welfare.org',
        phone: '0000-0000000',
        cnic: '00000-0000000-0',
        occupation: 'job' as any,
        role: Role.ADMIN
      };
      dbService.saveUser(admin);
    }
  }
};
