export function normalizePhone(value) {
  return String(value ?? '')
    .split(',')
    .map((part) => part.replace(/\D/g, '').trim())
    .filter(Boolean)
    .join(',');
}

function normalizeDestinationCities(value) {
  return String(value ?? '')
    .split(/[;,]/)
    .map((city) => city.trim())
    .filter(Boolean);
}

export function buildTransporterPayload(row) {
  const companyName = String(row.companyName || row.company || row.company_name || '').trim();
  const ownerName = String(row.ownerName || row.owner || row.owner_name || '').trim();
  const phone = normalizePhone(row.phone || row.mobile || row.phoneNumber || '');
  const whatsapp = normalizePhone(row.whatsapp || row.whatsApp || row.whatsappNumber || phone);
  const city = String(row.city || row.fromCity || row.from_city || '').trim();
  const destinations = normalizeDestinationCities(row.destinationCities || row.destinations || row.toCities || row.to_city || '');
  const description = String(row.description || '').trim();

  return {
    companyName,
    ownerName,
    phone,
    whatsapp,
    address: String(row.address || '').trim(),
    city,
    description,
    verified: true,
    status: 'active',
    routes: destinations.map((destination) => ({
      from: city,
      to: destination,
      frequency: 'Daily',
      transitDays: '',
    })),
  };
}

function getPhoneTokens(value) {
  return normalizePhone(value)
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

export function prepareBulkTransporterRows(rows = [], { existingPhones = [] } = {}) {
  const seenPhones = new Set(existingPhones.map(normalizePhone).filter(Boolean));
  const records = [];
  const duplicates = [];

  rows.forEach((row, index) => {
    const payload = buildTransporterPayload(row);
    const phone = payload.phone;
    const phoneTokens = getPhoneTokens(phone);
    const duplicatePhone = Boolean(
      phoneTokens.length &&
        (phoneTokens.some((token) => seenPhones.has(token)) ||
          records.some((record) => getPhoneTokens(record.payload.phone).some((token) => phoneTokens.includes(token))))
    );

    if (duplicatePhone) {
      duplicates.push({
        rowNumber: index + 2,
        companyName: payload.companyName || `Row ${index + 2}`,
        phone,
      });
      return;
    }

    if (phone) {
      seenPhones.add(phone);
    }

    records.push({
      rowNumber: index + 2,
      payload,
    });
  });

  return { records, duplicates };
}
