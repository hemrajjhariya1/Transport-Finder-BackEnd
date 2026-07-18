import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareBulkTransporterRows } from '../utils/transporterImport.js';

test('prepareBulkTransporterRows normalizes rows and flags duplicate phones', () => {
  const existingPhones = ['9999999999'];
  const result = prepareBulkTransporterRows(
    [
      {
        companyName: 'Fast Movers',
        ownerName: 'Ravi',
        phone: '+91 99999 99999',
        whatsapp: '9999999999',
        address: 'Main Road',
        city: 'Delhi',
        destinationCities: 'Noida, Gurgaon',
        description: 'Daily service',
      },
      {
        companyName: 'Quick Cargo',
        ownerName: 'Asha',
        phone: '9999999999',
        whatsapp: '',
        address: 'Sector 12',
        city: 'Delhi',
        destinationCities: 'Faridabad',
        description: '',
      },
    ],
    { existingPhones }
  );

  assert.equal(result.records.length, 1);
  assert.deepEqual(result.duplicates, [
    {
      rowNumber: 3,
      companyName: 'Quick Cargo',
      phone: '9999999999',
    },
  ]);
  assert.equal(result.records[0].payload.phone, '919999999999');
  assert.equal(result.records[0].payload.routes.length, 2);
});

test('prepareBulkTransporterRows keeps comma-separated phone numbers as separate values', () => {
  const result = prepareBulkTransporterRows([
    {
      companyName: 'Fast Movers',
      ownerName: 'Ravi',
      phone: '1234567890, 1122334455',
      whatsapp: '1234567890, 1122334455',
      address: 'Main Road',
      city: 'Delhi',
      destinationCities: 'Noida',
      description: 'Daily service',
    },
  ]);

  assert.equal(result.records.length, 1);
  assert.equal(result.records[0].payload.phone, '1234567890,1122334455');
  assert.equal(result.records[0].payload.whatsapp, '1234567890,1122334455');
});
