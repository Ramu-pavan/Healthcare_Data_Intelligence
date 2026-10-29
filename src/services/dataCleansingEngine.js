/**
 * Healthcare Data Cleansing & Quality Engine
 * Specialized for Australian Healthcare & Web Scraping Audits
 */

// Helper to check if a value is effectively empty or contains common scraper placeholder junk
export function isPlaceholderOrEmpty(val) {
  if (val === null || val === undefined) return true;
  const str = String(val).trim().toLowerCase();
  if (str === "") return true;
  const placeholders = [
    "n/a", "na", "null", "none", "-", "--", "---", "pending", "unknown",
    "not available", "nil", "undefined", "#n/a", "no website", "no phone"
  ];
  return placeholders.includes(str);
}

// Normalizes state names to Australian standard abbreviations
export function normalizeState(state) {
  if (!state) return "UNKNOWN";
  const s = String(state).trim().toUpperCase();
  const map = {
    "NEW SOUTH WALES": "NSW",
    "VICTORIA": "VIC",
    "QUEENSLAND": "QLD",
    "WESTERN AUSTRALIA": "WA",
    "SOUTH AUSTRALIA": "SA",
    "TASMANIA": "TAS",
    "NORTHERN TERRITORY": "NT",
    "AUSTRALIAN CAPITAL TERRITORY": "ACT"
  };
  return map[s] || s;
}

// Cleans multiple consecutive spaces, tabs, newlines and trims
export function cleanWhitespace(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/[\r\n\t]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Normalize a string for strict duplicate matching (removes symbols, lowercase)
export function normalizeForMatching(str) {
  if (!str) return "";
  return cleanWhitespace(str)
    .toLowerCase()
    .replace(/[^\w\s]/gi, ""); // strip punctuation
}

// Validates website URL syntax
export function isValidUrl(url) {
  if (isPlaceholderOrEmpty(url)) return false;
  const cleaned = cleanWhitespace(url);
  try {
    const parsed = new URL(cleaned.startsWith("http") ? cleaned : `https://${cleaned}`);
    return parsed.hostname.includes(".");
  } catch (e) {
    return false;
  }
}

// Formats Australian Phone nicely if matched
export function formatAustralianPhone(rawPhone) {
  if (isPlaceholderOrEmpty(rawPhone)) return null;
  const digits = String(rawPhone).replace(/\D/g, "");
  
  // 10-digit Australian landline (e.g., 02xxxxxxxx, 03xxxxxxxx, 07xxxxxxxx, 08xxxxxxxx)
  if (digits.length === 10 && digits.startsWith("0")) {
    const area = digits.substring(0, 2);
    const part1 = digits.substring(2, 6);
    const part2 = digits.substring(6, 10);
    return `(${area}) ${part1} ${part2}`;
  }
  
  // Australian Mobile (04xxxxxxxx)
  if (digits.length === 10 && digits.startsWith("04")) {
    return `${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7, 10)}`;
  }

  // 1300 / 1800 numbers (6 or 10 digits)
  if (digits.startsWith("1300") || digits.startsWith("1800")) {
    return `${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7, 10)}`;
  }

  return cleanWhitespace(rawPhone);
}

/**
 * Main Data Cleansing & Quality Audit Execution
 * @param {Array} rawRecords - Raw scraped dataset array
 * @returns {Object} Cleaned records, itemized audits, metrics and duplicate clusters
 */
export function executeDataCleansingEngine(rawRecords = []) {
  if (!Array.isArray(rawRecords) || rawRecords.length === 0) {
    return {
      rawCount: 0,
      cleanedCount: 0,
      duplicatesRemovedCount: 0,
      missingPhoneCount: 0,
      missingWebsiteCount: 0,
      missingBothContactsCount: 0,
      whitespaceFixedCount: 0,
      stateNormalizedCount: 0,
      qualityScore: 100,
      qualityGrade: "A+",
      cleanedRecords: [],
      duplicateClusters: [],
      auditLog: [],
      cityDistribution: {}
    };
  }

  const auditLog = [];
  let whitespaceFixedCount = 0;
  let stateNormalizedCount = 0;

  // Step 1: Pre-cleansing of individual records (Whitespace, States, Contact Validations)
  const preProcessed = rawRecords.map((item, index) => {
    const id = item.id || `SCRAPE-${String(index + 1).padStart(4, "0")}`;
    const originalClinicName = item.clinicName || item.ClinicName || item["Clinic Name"] || item.name || "";
    const originalCity = item.city || item.City || "";
    const originalState = item.state || item.State || "";
    const originalPhone = item.phone || item.Phone || item.telephone || "";
    const originalWebsite = item.website || item.Website || item.url || "";
    const originalAddress = item.address || item.Address || "";
    const originalPostalCode = item.postalCode || item.PostalCode || item["Postal Code"] || item.postcode || "";
    const practiceType = item.practiceType || item.PracticeType || item["Practice Type"] || "General Practice";

    let hadWhitespaceIssue = false;

    // Clean whitespace
    const cleanedClinicName = cleanWhitespace(originalClinicName);
    if (cleanedClinicName !== originalClinicName) {
      hadWhitespaceIssue = true;
      auditLog.push({
        id: `AUDIT-WS-${auditLog.length + 1}`,
        recordId: id,
        clinicName: cleanedClinicName,
        category: "Whitespace Cleaning",
        severity: "info",
        description: `Trimmed extra whitespace or control characters in clinic name: "${originalClinicName}" -> "${cleanedClinicName}"`
      });
    }

    const cleanedCity = cleanWhitespace(originalCity);
    if (cleanedCity !== originalCity) {
      hadWhitespaceIssue = true;
    }

    const cleanedStateRaw = cleanWhitespace(originalState);
    const normalizedState = normalizeState(cleanedStateRaw);
    if (normalizedState !== cleanedStateRaw) {
      stateNormalizedCount++;
      auditLog.push({
        id: `AUDIT-ST-${auditLog.length + 1}`,
        recordId: id,
        clinicName: cleanedClinicName,
        category: "State Standardization",
        severity: "info",
        description: `Standardized Australian state format: "${cleanedStateRaw}" -> "${normalizedState}"`
      });
    }

    const cleanedPhoneRaw = cleanWhitespace(originalPhone);
    if (cleanedPhoneRaw !== originalPhone && originalPhone !== "") {
      hadWhitespaceIssue = true;
    }

    const cleanedWebsiteRaw = cleanWhitespace(originalWebsite);
    if (cleanedWebsiteRaw !== originalWebsite && originalWebsite !== "") {
      hadWhitespaceIssue = true;
    }

    if (hadWhitespaceIssue) {
      whitespaceFixedCount++;
    }

    // Evaluate Missing Contact Cells
    const hasMissingPhone = isPlaceholderOrEmpty(cleanedPhoneRaw);
    const hasMissingWebsite = isPlaceholderOrEmpty(cleanedWebsiteRaw);

    // Standardize phone formatting if present
    const standardizedPhone = hasMissingPhone ? null : (formatAustralianPhone(cleanedPhoneRaw) || cleanedPhoneRaw);

    // Standardize website URL if present
    let standardizedWebsite = null;
    let urlValid = false;
    if (!hasMissingWebsite) {
      urlValid = isValidUrl(cleanedWebsiteRaw);
      if (urlValid) {
        standardizedWebsite = cleanedWebsiteRaw.startsWith("http")
          ? cleanedWebsiteRaw
          : `https://${cleanedWebsiteRaw}`;
      } else {
        standardizedWebsite = cleanedWebsiteRaw;
        auditLog.push({
          id: `AUDIT-URL-${auditLog.length + 1}`,
          recordId: id,
          clinicName: cleanedClinicName,
          category: "URL Formatting",
          severity: "warning",
          description: `Flagged suspicious or unformatted website domain: "${cleanedWebsiteRaw}"`
        });
      }
    }

    // Completeness rating for this single row (used for deduplication tie-breaking)
    let completenessScore = 0;
    if (cleanedClinicName) completenessScore += 25;
    if (cleanedCity) completenessScore += 25;
    if (!hasMissingPhone) completenessScore += 25;
    if (!hasMissingWebsite) completenessScore += 25;

    return {
      rawRecord: item,
      id,
      clinicName: cleanedClinicName,
      city: cleanedCity,
      state: normalizedState,
      phone: standardizedPhone,
      website: standardizedWebsite,
      address: cleanWhitespace(originalAddress),
      postalCode: cleanWhitespace(originalPostalCode),
      practiceType: cleanWhitespace(practiceType),
      scrapedSource: item.scrapedSource || "Web Scraper Standard",
      scrapeTimestamp: item.scrapeTimestamp || new Date().toISOString().replace("T", " ").substring(0, 19),
      hasMissingPhone,
      hasMissingWebsite,
      completenessScore,
      // Deduplication matching key: normalized clinic name + normalized city
      matchKey: `${normalizeForMatching(cleanedClinicName)}:::${normalizeForMatching(cleanedCity)}`
    };
  });

  // Step 2: Deduplication Engine based on Clinic Name and City
  const clustersMap = new Map();
  const cleanedRecords = [];
  const duplicateClusters = [];
  let duplicatesRemovedCount = 0;

  preProcessed.forEach((record) => {
    const key = record.matchKey;
    if (!clustersMap.has(key)) {
      clustersMap.set(key, [record]);
    } else {
      clustersMap.get(key).push(record);
    }
  });

  clustersMap.forEach((recordsList, key) => {
    if (recordsList.length === 1) {
      cleanedRecords.push(recordsList[0]);
    } else {
      // Multiple records sharing same clinic name and city!
      // Sort by completenessScore descending (keep the record with the most populated contact information)
      recordsList.sort((a, b) => b.completenessScore - a.completenessScore);
      const chosenRecord = recordsList[0];
      const discardedRecords = recordsList.slice(1);

      duplicatesRemovedCount += discardedRecords.length;

      // Log deduplication cluster
      duplicateClusters.push({
        key,
        clinicName: chosenRecord.clinicName,
        city: chosenRecord.city,
        totalFound: recordsList.length,
        chosenRecord,
        discardedRecords
      });

      discardedRecords.forEach(discarded => {
        auditLog.push({
          id: `AUDIT-DUP-${auditLog.length + 1}`,
          recordId: discarded.id,
          clinicName: discarded.clinicName,
          category: "Deduplication",
          severity: "critical",
          description: `Duplicate detected and removed based on Clinic Name ("${discarded.clinicName}") and City ("${discarded.city}"). Retained primary record ${chosenRecord.id}.`
        });
      });

      cleanedRecords.push(chosenRecord);
    }
  });

  // Step 3: Aggregate Quality Metrics on Cleaned Dataset
  let missingPhoneCount = 0;
  let missingWebsiteCount = 0;
  let missingBothContactsCount = 0;
  const cityDistribution = {};

  cleanedRecords.forEach(rec => {
    if (rec.hasMissingPhone) {
      missingPhoneCount++;
      auditLog.push({
        id: `AUDIT-MPH-${auditLog.length + 1}`,
        recordId: rec.id,
        clinicName: rec.clinicName,
        category: "Missing Contact Cell",
        severity: "warning",
        description: `Missing contact telephone number for clinic "${rec.clinicName}" in ${rec.city}`
      });
    }

    if (rec.hasMissingWebsite) {
      missingWebsiteCount++;
      auditLog.push({
        id: `AUDIT-MWEB-${auditLog.length + 1}`,
        recordId: rec.id,
        clinicName: rec.clinicName,
        category: "Missing Contact Cell",
        severity: "warning",
        description: `Missing official practice website URL for clinic "${rec.clinicName}" in ${rec.city}`
      });
    }

    if (rec.hasMissingPhone && rec.hasMissingWebsite) {
      missingBothContactsCount++;
    }

    // City aggregation
    const cityName = rec.city || "Unspecified";
    if (!cityDistribution[cityName]) {
      cityDistribution[cityName] = {
        city: cityName,
        state: rec.state || "N/A",
        count: 0,
        missingPhoneCount: 0,
        missingWebsiteCount: 0,
        fullContactsCount: 0
      };
    }
    cityDistribution[cityName].count += 1;
    if (rec.hasMissingPhone) cityDistribution[cityName].missingPhoneCount += 1;
    if (rec.hasMissingWebsite) cityDistribution[cityName].missingWebsiteCount += 1;
    if (!rec.hasMissingPhone && !rec.hasMissingWebsite) {
      cityDistribution[cityName].fullContactsCount += 1;
    }
  });

  // Step 4: Calculate Health / Quality Score (0-100)
  const totalCleaned = cleanedRecords.length;
  const rawTotal = rawRecords.length;

  let phoneCompletenessPct = totalCleaned > 0 ? ((totalCleaned - missingPhoneCount) / totalCleaned) * 100 : 100;
  let websiteCompletenessPct = totalCleaned > 0 ? ((totalCleaned - missingWebsiteCount) / totalCleaned) * 100 : 100;
  let contactCompletenessScore = (phoneCompletenessPct + websiteCompletenessPct) / 2; // out of 100

  // Deduplication score: 100 if no duplicates, reduced if duplicate ratio is high
  const dupRatio = rawTotal > 0 ? (duplicatesRemovedCount / rawTotal) : 0;
  const deduplicationScore = Math.max(0, 100 - (dupRatio * 150));

  // Hygiene score (whitespace & state)
  const hygieneRatio = rawTotal > 0 ? (whitespaceFixedCount / rawTotal) : 0;
  const hygieneScore = Math.max(0, 100 - (hygieneRatio * 50));

  // Weighted total: 45% completeness, 35% deduplication integrity, 20% hygiene
  const qualityScore = Math.round(
    (contactCompletenessScore * 0.45) +
    (deduplicationScore * 0.35) +
    (hygieneScore * 0.20)
  );

  let qualityGrade = "A+";
  if (qualityScore < 60) qualityGrade = "D (Poor)";
  else if (qualityScore < 75) qualityGrade = "C (Fair)";
  else if (qualityScore < 85) qualityGrade = "B (Good)";
  else if (qualityScore < 95) qualityGrade = "A (High)";
  else qualityGrade = "A+ (Optimal)";

  return {
    rawCount: rawTotal,
    cleanedCount: totalCleaned,
    duplicatesRemovedCount,
    missingPhoneCount,
    missingWebsiteCount,
    missingBothContactsCount,
    whitespaceFixedCount,
    stateNormalizedCount,
    qualityScore,
    qualityGrade,
    cleanedRecords,
    duplicateClusters,
    auditLog,
    cityDistribution
  };
}
