/**
 * CSV Import / Export & Field Auto-Mapping Service
 */
import Papa from "papaparse";

// Standard column key map
const FIELD_SYNONYMS = {
  clinicName: [
    "clinic name", "clinicname", "clinic", "practice name", "practicename",
    "practice", "name", "medical centre", "medical center", "center name",
    "facility", "facility name"
  ],
  city: [
    "city", "suburb", "town", "locality", "municipality", "metro"
  ],
  state: [
    "state", "province", "territory", "region"
  ],
  phone: [
    "phone", "phone number", "phonenumber", "telephone", "tel", "contact",
    "contact number", "mobile", "cell", "phone_number"
  ],
  website: [
    "website", "web", "url", "site", "web address", "webpage", "link", "homepage"
  ],
  address: [
    "address", "street", "street address", "location", "full address"
  ],
  postalCode: [
    "postal code", "postalcode", "postcode", "zip", "zip code", "zipcode"
  ],
  practiceType: [
    "practice type", "practicetype", "type", "category", "specialty", "billing type"
  ]
};

/**
 * Maps arbitrary CSV headers to standard internal keys
 * @param {Array<string>} headers - Headers found in the CSV
 * @returns {Object} Map of standard key -> actual CSV header
 */
export function detectColumnMapping(headers = []) {
  const mapping = {};
  const lowerHeaders = headers.map(h => ({
    original: h,
    normalized: String(h).trim().toLowerCase().replace(/[_\s-]+/g, " ")
  }));

  Object.entries(FIELD_SYNONYMS).forEach(([standardKey, synonyms]) => {
    // Try exact or synonym match
    for (const item of lowerHeaders) {
      if (synonyms.includes(item.normalized)) {
        mapping[standardKey] = item.original;
        break;
      }
    }
    // If not found, try substring match
    if (!mapping[standardKey]) {
      for (const item of lowerHeaders) {
        if (synonyms.some(syn => item.normalized.includes(syn))) {
          mapping[standardKey] = item.original;
          break;
        }
      }
    }
  });

  return mapping;
}

/**
 * Parses raw CSV string or file into normalized records
 * @param {File|string} input - CSV file or string
 * @returns {Promise<{ records: Array, headers: Array, mapping: Object, error?: string }>}
 */
export function parseUploadedCSV(input) {
  return new Promise((resolve) => {
    Papa.parse(input, {
      header: true,
      skipEmptyLines: "greedy",
      dynamicTyping: false,
      complete: (results) => {
        if (results.errors && results.errors.length > 0 && results.data.length === 0) {
          return resolve({
            records: [],
            headers: [],
            mapping: {},
            error: results.errors[0].message || "Failed to parse CSV file."
          });
        }

        const headers = results.meta.fields || [];
        const mapping = detectColumnMapping(headers);

        const records = results.data.map((row, index) => {
          return {
            id: `UPLOAD-${String(index + 1).padStart(4, "0")}`,
            clinicName: mapping.clinicName ? row[mapping.clinicName] || "" : "",
            city: mapping.city ? row[mapping.city] || "" : "",
            state: mapping.state ? row[mapping.state] || "" : "",
            phone: mapping.phone ? row[mapping.phone] || "" : "",
            website: mapping.website ? row[mapping.website] || "" : "",
            address: mapping.address ? row[mapping.address] || "" : "",
            postalCode: mapping.postalCode ? row[mapping.postalCode] || "" : "",
            practiceType: mapping.practiceType ? row[mapping.practiceType] || "General Practice" : "General Practice",
            scrapedSource: "Custom CSV Import",
            scrapeTimestamp: new Date().toISOString().replace("T", " ").substring(0, 19)
          };
        }).filter(r => r.clinicName.trim() !== "" || r.city.trim() !== ""); // Filter out blank ghost lines

        resolve({ records, headers, mapping });
      },
      error: (err) => {
        resolve({
          records: [],
          headers: [],
          mapping: {},
          error: err.message || "Failed to process CSV file."
        });
      }
    });
  });
}

/**
 * Exports cleaned dataset as a formatted CSV download
 * @param {Array} records - Cleaned records to export
 * @param {string} filename - Output file name
 */
export function exportToCSV(records = [], filename = "Australian_Healthcare_Cleaned_Dataset.csv") {
  if (!records || records.length === 0) return;

  const exportData = records.map(r => ({
    "Clinic ID": r.id,
    "Clinic Name": r.clinicName,
    "City": r.city,
    "State": r.state,
    "Phone": r.phone || "N/A",
    "Website": r.website || "N/A",
    "Address": r.address || "",
    "Postal Code": r.postalCode || "",
    "Practice Type": r.practiceType || "General Practice",
    "Scraped Source": r.scrapedSource || "Web Scraper",
    "Audit Verified": (!r.hasMissingPhone && !r.hasMissingWebsite) ? "Full Contact" : "Partial Contact"
  }));

  const csv = Papa.unparse(exportData, { quotes: true });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports Audit Quality Report as JSON
 */
export function exportAuditReportJSON(engineResult, filename = "AcuMed_Quality_Audit_Log.json") {
  const report = {
    generatedAt: new Date().toISOString(),
    executiveSummary: {
      rawScrapedRecords: engineResult.rawCount,
      deduplicatedCleanedRecords: engineResult.cleanedCount,
      duplicatesRemoved: engineResult.duplicatesRemovedCount,
      whitespaceIrregularitiesSanitized: engineResult.whitespaceFixedCount,
      stateCodesNormalized: engineResult.stateNormalizedCount,
      missingPhoneNumbers: engineResult.missingPhoneCount,
      missingWebsites: engineResult.missingWebsiteCount,
      isolatedClinicsNoContact: engineResult.missingBothContactsCount,
      overallQualityScore: `${engineResult.qualityScore}%`,
      qualityGrade: engineResult.qualityGrade
    },
    cityDistribution: engineResult.cityDistribution,
    duplicateClusters: engineResult.duplicateClusters.map(c => ({
      clusterKey: c.key,
      clinicName: c.clinicName,
      city: c.city,
      totalDuplicates: c.totalFound,
      retainedRecordId: c.chosenRecord.id,
      discardedRecordIds: c.discardedRecords.map(d => d.id)
    })),
    itemizedAuditTrail: engineResult.auditLog
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Returns sample CSV template string for users to download and inspect
 */
export function getSampleCSVContent() {
  return `Clinic Name,City,State,Phone,Website,Address,Postal Code,Practice Type
"Sydney Harbor Medical","Sydney","NSW","(02) 9233 4455","https://www.sydneyharbormed.com.au","Suite 4, 100 George St","2000","Bulk Billing GP"
"  Sydney Harbor Medical   ","Sydney","NSW","02 9233 4455","","100 George St","2000","Medical Centre"
"Melbourne Docklands Clinic","Melbourne","VIC","(03) 9800 1122","https://www.docklandsclinic.com.au","88 Collins St","3000","Family Practice"
"Brisbane Valley Health Group","Brisbane","QLD","","https://www.valleyhealth.com.au","32 Ann St","4000","General Practice"
"Perth Coast Doctors","Perth","WA","(08) 9320 0011","None","45 St Georges Tce","6000","Mixed Billing GP"
`;
}
