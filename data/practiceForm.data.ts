import path from 'path';

export const practiceFormData = {
  firstName: 'Daniel',
  lastName: 'Nava',
  userEmail: 'd-nava.test@omni.pro',
  gender: 'Male',
  userNumber: '3000427777',

  dateOfBirth: {
    monthValue: '2',   // March
    yearText: '2000',
    day: 6,
  },

  subjects: [
    { type: 'Computer', option: 'Computer Science' },
    { type: 'Arts', option: 'Arts' },
  ],

  currentAddress: 'Sector 12, Karnal, Haryana, 132001',

  state: 'Haryana',
  city: 'Karnal',
} as const;

/**
 * Breadcrumb: Sprint 3 | TODO:
 * Future optimisation: map these lists dynamically (UI/API) and compare against a controlled dataset.
 */
export const statesAndCities = [
  { state: 'NCR', cities: ['Delhi', 'Gurgaon', 'Noida'] },
  { state: 'Uttar Pradesh', cities: ['Agra', 'Lucknow', 'Merrut'] },
  { state: 'Haryana', cities: ['Karnal', 'Panipat'] },
  { state: 'Rajasthan', cities: ['Jaipur', 'Jaiselmer'] },
] as const;

export const practiceFormUploadFile = path.resolve(__dirname, 'practiceFormData.json');
