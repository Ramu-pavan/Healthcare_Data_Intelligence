/**
 * Australian General Practice Sample Datasets for Scraping & Quality Audit
 * Cities: Sydney (NSW), Melbourne (VIC), Brisbane (QLD), Perth (WA)
 * Includes realistic raw scraping anomalies (whitespace, duplicates, missing cells).
 */

export const AUSTRALIAN_GP_DATASET_DEFAULT = [
  // Sydney (NSW)
  {
    id: "RAW-SYD-001",
    clinicName: "Sydney City Medical Centre",
    city: "Sydney",
    state: "NSW",
    phone: "(02) 9231 3211",
    website: "https://www.sydneycitymedical.com.au",
    address: "Level 1, 422 George St, Sydney NSW 2000",
    postalCode: "2000",
    practiceType: "Bulk Billing General Practice",
    scrapedSource: "HealthEngine Directory",
    scrapeTimestamp: "2026-10-28 09:14:22"
  },
  {
    id: "RAW-SYD-002",
    clinicName: "  Sydney City Medical Centre   ", // Duplicate + whitespace
    city: "Sydney",
    state: "NSW",
    phone: "02 9231 3211",
    website: "", // Missing website in this scrape record
    address: "422 George St, Sydney",
    postalCode: "2000",
    practiceType: "Medical Centre",
    scrapedSource: "YellowPages Scraping Bot v2.1",
    scrapeTimestamp: "2026-10-28 10:02:11"
  },
  {
    id: "RAW-SYD-003",
    clinicName: "Harbour Health Care Medical Practice",
    city: "Sydney",
    state: "NSW",
    phone: "(02) 9247 5800",
    website: "https://www.harbourhealthcare.com.au",
    address: "100 Barangaroo Avenue, Barangaroo NSW 2000",
    postalCode: "2000",
    practiceType: "Private & Corporate Health",
    scrapedSource: "HotDoc Directory",
    scrapeTimestamp: "2026-10-28 09:15:00"
  },
  {
    id: "RAW-SYD-004",
    clinicName: "Bondi Junction Family Doctors",
    city: "Sydney",
    state: "NSW",
    phone: "02 9389 2244",
    website: "https://www.bondifamilydoctors.com.au",
    address: "215 Oxford St, Bondi Junction NSW 2022",
    postalCode: "2022",
    practiceType: "Mixed Billing GP",
    scrapedSource: "Google Maps Scraper",
    scrapeTimestamp: "2026-10-28 09:16:45"
  },
  {
    id: "RAW-SYD-005",
    clinicName: "Darlinghurst Medical Centre",
    city: "Sydney",
    state: "NSW",
    phone: "  (02) 8302 1100  ", // Whitespace in phone
    website: "https://www.darlinghurstmedical.com.au",
    address: "213-219 Darlinghurst Rd, Darlinghurst NSW 2010",
    postalCode: "2010",
    practiceType: "Comprehensive GP & Allied Health",
    scrapedSource: "HealthEngine Directory",
    scrapeTimestamp: "2026-10-28 09:18:10"
  },
  {
    id: "RAW-SYD-006",
    clinicName: "Surry Hills Medical Group",
    city: "Sydney",
    state: "nsw", // Lowercase state
    phone: "", // Missing Phone
    website: "https://www.surryhillsmedical.com.au",
    address: "573 Crown St, Surry Hills NSW 2010",
    postalCode: "2010",
    practiceType: "Community Practice",
    scrapedSource: "Web Crawler Alpha",
    scrapeTimestamp: "2026-10-28 09:20:00"
  },
  {
    id: "RAW-SYD-007",
    clinicName: "North Sydney Doctors Practice",
    city: "Sydney",
    state: "NSW",
    phone: "02 9955 6000",
    website: "N/A", // Missing website token
    address: "Suite 302, 121 Walker St, North Sydney NSW 2060",
    postalCode: "2060",
    practiceType: "Private GP",
    scrapedSource: "YellowPages Scraping Bot v2.1",
    scrapeTimestamp: "2026-10-28 09:22:15"
  },
  {
    id: "RAW-SYD-008",
    clinicName: "Macquarie Street Medical Practice",
    city: "Sydney",
    state: "NSW",
    phone: "02 9232 5055",
    website: "https://www.macquariestreetmedical.com.au",
    address: "Level 7, 195 Macquarie St, Sydney NSW 2000",
    postalCode: "2000",
    practiceType: "Specialist & GP",
    scrapedSource: "HotDoc Directory",
    scrapeTimestamp: "2026-10-28 09:24:40"
  },
  {
    id: "RAW-SYD-009",
    clinicName: "Ultimo Primary Health Clinic",
    city: "Sydney",
    state: "NSW",
    phone: "-", // Missing Phone
    website: "-", // Missing Website
    address: "492 Jones St, Ultimo NSW 2007",
    postalCode: "2007",
    practiceType: "Student Health & General Practice",
    scrapedSource: "Web Crawler Alpha",
    scrapeTimestamp: "2026-10-28 09:25:12"
  },
  {
    id: "RAW-SYD-010",
    clinicName: "Newtown Medical Practice",
    city: "Sydney",
    state: "NSW",
    phone: "(02) 9557 2266",
    website: "https://www.newtownmedical.com.au",
    address: "148 King St, Newtown NSW 2042",
    postalCode: "2042",
    practiceType: "Bulk Billing General Practice",
    scrapedSource: "HealthEngine Directory",
    scrapeTimestamp: "2026-10-28 09:27:00"
  },

  // Melbourne (VIC)
  {
    id: "RAW-MEL-001",
    clinicName: "Melbourne City Medical Centre",
    city: "Melbourne",
    state: "VIC",
    phone: "(03) 9650 0023",
    website: "https://www.melbournecitymedical.com.au",
    address: "68 Lonsdale St, Melbourne VIC 3000",
    postalCode: "3000",
    practiceType: "Bulk Billing GP",
    scrapedSource: "HotDoc Directory",
    scrapeTimestamp: "2026-10-28 09:30:10"
  },
  {
    id: "RAW-MEL-002",
    clinicName: "Melbourne Central Clinic\t", // Trailing tab whitespace
    city: "Melbourne",
    state: "VIC",
    phone: "03 9654 6088",
    website: "https://www.melbournecentralclinic.com.au",
    address: "Level 1, 211 La Trobe St, Melbourne VIC 3000",
    postalCode: "3000",
    practiceType: "Mixed Billing GP",
    scrapedSource: "Google Maps Scraper",
    scrapeTimestamp: "2026-10-28 09:32:05"
  },
  {
    id: "RAW-MEL-003",
    clinicName: "melbourne central clinic", // Case difference duplicate!
    city: "Melbourne",
    state: "VIC",
    phone: "(03) 9654 6088",
    website: "https://www.melbournecentralclinic.com.au",
    address: "211 La Trobe Street, Melbourne",
    postalCode: "3000",
    practiceType: "GP Clinic",
    scrapedSource: "YellowPages Scraping Bot v2.1",
    scrapeTimestamp: "2026-10-28 09:33:14"
  },
  {
    id: "RAW-MEL-004",
    clinicName: "Carlton Family Medical Clinic",
    city: "Melbourne",
    state: "VIC",
    phone: "(03) 9347 9422",
    website: "https://www.carltonmedical.com.au",
    address: "254 Elgin St, Carlton VIC 3053",
    postalCode: "3053",
    practiceType: "Family Practice",
    scrapedSource: "HealthEngine Directory",
    scrapeTimestamp: "2026-10-28 09:34:50"
  },
  {
    id: "RAW-MEL-005",
    clinicName: "Southbank Medical Centre",
    city: "Melbourne",
    state: "Victoria", // Full state name instead of code
    phone: "03 9690 1433",
    website: "", // Missing website
    address: "Shop 7/12 Riverside Quay, Southbank VIC 3006",
    postalCode: "3006",
    practiceType: "Corporate & Community GP",
    scrapedSource: "Web Crawler Alpha",
    scrapeTimestamp: "2026-10-28 09:36:20"
  },
  {
    id: "RAW-MEL-006",
    clinicName: "Fitzroy Community Health GP",
    city: "Melbourne",
    state: "VIC",
    phone: "null", // Null string
    website: "https://www.fitzroyhealth.org.au",
    address: "75 Brunswick St, Fitzroy VIC 3065",
    postalCode: "3065",
    practiceType: "Community Health Clinic",
    scrapedSource: "HealthEngine Directory",
    scrapeTimestamp: "2026-10-28 09:38:00"
  },
  {
    id: "RAW-MEL-007",
    clinicName: "St Kilda Road Medical Centre",
    city: "Melbourne",
    state: "VIC",
    phone: "(03) 9866 5755",
    website: "https://www.stkildamedical.com.au",
    address: "391 St Kilda Rd, Melbourne VIC 3004",
    postalCode: "3004",
    practiceType: "Mixed Billing GP",
    scrapedSource: "HotDoc Directory",
    scrapeTimestamp: "2026-10-28 09:40:12"
  },
  {
    id: "RAW-MEL-008",
    clinicName: "Richmond Medical Doctors",
    city: "Melbourne",
    state: "VIC",
    phone: "(03) 9429 8822",
    website: "https://www.richmondmedical.com.au",
    address: "534 Bridge Rd, Richmond VIC 3121",
    postalCode: "3121",
    practiceType: "Family Healthcare",
    scrapedSource: "Google Maps Scraper",
    scrapeTimestamp: "2026-10-28 09:42:30"
  },
  {
    id: "RAW-MEL-009",
    clinicName: "Docklands Health & Medical",
    city: "Melbourne",
    state: "VIC",
    phone: "", // Missing phone
    website: "None", // Missing website token
    address: "883 Collins St, Docklands VIC 3008",
    postalCode: "3008",
    practiceType: "Walk-in & General Practice",
    scrapedSource: "Web Crawler Alpha",
    scrapeTimestamp: "2026-10-28 09:44:00"
  },

  // Brisbane (QLD)
  {
    id: "RAW-BNE-001",
    clinicName: "Brisbane City Doctors",
    city: "Brisbane",
    state: "QLD",
    phone: "(07) 3221 3366",
    website: "https://www.brisbanecitydoctors.com.au",
    address: "Level 1, 245 Albert St, Brisbane City QLD 4000",
    postalCode: "4000",
    practiceType: "Bulk Billing & Family Practice",
    scrapedSource: "HotDoc Directory",
    scrapeTimestamp: "2026-10-28 09:46:11"
  },
  {
    id: "RAW-BNE-002",
    clinicName: "  Brisbane City Doctors  ", // Duplicate + whitespace
    city: "Brisbane",
    state: "QLD",
    phone: "07 3221 3366",
    website: "https://www.brisbanecitydoctors.com.au",
    address: "245 Albert St, Brisbane",
    postalCode: "4000",
    practiceType: "Medical Practice",
    scrapedSource: "YellowPages Scraping Bot v2.1",
    scrapeTimestamp: "2026-10-28 09:47:05"
  },
  {
    id: "RAW-BNE-003",
    clinicName: "Queen Street Medical Centre",
    city: "Brisbane",
    state: "QLD",
    phone: " (07) 3229 9355 ", // Phone whitespace
    website: "https://www.queenstreetmedical.com.au",
    address: "Shop 12, 141 Queen St, Brisbane QLD 4000",
    postalCode: "4000",
    practiceType: "Central CBD GP",
    scrapedSource: "HealthEngine Directory",
    scrapeTimestamp: "2026-10-28 09:48:33"
  },
  {
    id: "RAW-BNE-004",
    clinicName: "South Bank Family Practice",
    city: "Brisbane",
    state: "QLD",
    phone: "(07) 3844 8344",
    website: "https://www.southbankmedical.com.au",
    address: "180 Grey St, South Brisbane QLD 4101",
    postalCode: "4101",
    practiceType: "Mixed Billing GP",
    scrapedSource: "Google Maps Scraper",
    scrapeTimestamp: "2026-10-28 09:50:18"
  },
  {
    id: "RAW-BNE-005",
    clinicName: "Fortitude Valley Doctors Clinic",
    city: "Brisbane",
    state: "QLD",
    phone: "N/A", // Missing phone
    website: "https://www.valleydoctors.com.au",
    address: "369 Brunswick St, Fortitude Valley QLD 4006",
    postalCode: "4006",
    practiceType: "Community & Sexual Health GP",
    scrapedSource: "Web Crawler Alpha",
    scrapeTimestamp: "2026-10-28 09:52:00"
  },
  {
    id: "RAW-BNE-006",
    clinicName: "Spring Hill General Practice",
    city: "Brisbane",
    state: "QLD",
    phone: "(07) 3831 6688",
    website: "https://www.springhillgp.com.au",
    address: "477 Boundary St, Spring Hill QLD 4000",
    postalCode: "4000",
    practiceType: "Family & Travel Health",
    scrapedSource: "HotDoc Directory",
    scrapeTimestamp: "2026-10-28 09:53:45"
  },
  {
    id: "RAW-BNE-007",
    clinicName: "Kangaroo Point Medical Centre",
    city: "Brisbane",
    state: "Queensland", // Full state
    phone: "07 3391 8008",
    website: "", // Missing website
    address: "10/720 Main St, Kangaroo Point QLD 4169",
    postalCode: "4169",
    practiceType: "General Practice",
    scrapedSource: "HealthEngine Directory",
    scrapeTimestamp: "2026-10-28 09:55:10"
  },
  {
    id: "RAW-BNE-008",
    clinicName: "West End Community GP Hub",
    city: "Brisbane",
    state: "QLD",
    phone: "(07) 3844 7788",
    website: "https://www.westendhealth.com.au",
    address: "162 Boundary St, West End QLD 4101",
    postalCode: "4101",
    practiceType: "Holistic & Family Practice",
    scrapedSource: "Google Maps Scraper",
    scrapeTimestamp: "2026-10-28 09:56:55"
  },

  // Perth (WA)
  {
    id: "RAW-PER-001",
    clinicName: "Perth Central Medical Practice",
    city: "Perth",
    state: "WA",
    phone: "(08) 9225 1188",
    website: "https://www.perthcentralmedical.com.au",
    address: "Ground Floor, 140 St Georges Terrace, Perth WA 6000",
    postalCode: "6000",
    practiceType: "Corporate & Family GP",
    scrapedSource: "HotDoc Directory",
    scrapeTimestamp: "2026-10-28 10:00:15"
  },
  {
    id: "RAW-PER-002",
    clinicName: "Perth Central Medical Practice\n", // Duplicate + newline whitespace
    city: "Perth",
    state: "WA",
    phone: "08 9225 1188",
    website: "https://www.perthcentralmedical.com.au",
    address: "140 St Georges Terrace, Perth WA 6000",
    postalCode: "6000",
    practiceType: "General Practice",
    scrapedSource: "YellowPages Scraping Bot v2.1",
    scrapeTimestamp: "2026-10-28 10:01:40"
  },
  {
    id: "RAW-PER-003",
    clinicName: "Northbridge Medical Centre",
    city: "Perth",
    state: "WA",
    phone: "(08) 9228 8339",
    website: "https://www.northbridgemedical.com.au",
    address: "1/158 Newcastle St, Perth WA 6000",
    postalCode: "6000",
    practiceType: "Multilingual General Practice",
    scrapedSource: "HealthEngine Directory",
    scrapeTimestamp: "2026-10-28 10:03:00"
  },
  {
    id: "RAW-PER-004",
    clinicName: "East Perth Medical Centre",
    city: "Perth",
    state: "WA",
    phone: "08 9221 4204",
    website: "https://www.eastperthmedical.com.au",
    address: "168 Adelaide Terrace, East Perth WA 6004",
    postalCode: "6004",
    practiceType: "Mixed Billing GP",
    scrapedSource: "Google Maps Scraper",
    scrapeTimestamp: "2026-10-28 10:05:22"
  },
  {
    id: "RAW-PER-005",
    clinicName: "Subiaco Primary Health Centre",
    city: "Perth",
    state: "WA",
    phone: "  ", // Empty whitespace phone
    website: "https://www.subiacohealth.com.au",
    address: "123 Rokeby Rd, Subiaco WA 6008",
    postalCode: "6008",
    practiceType: "Family Healthcare",
    scrapedSource: "Web Crawler Alpha",
    scrapeTimestamp: "2026-10-28 10:07:00"
  },
  {
    id: "RAW-PER-006",
    clinicName: "West Perth Doctors Group",
    city: "Perth",
    state: "WA",
    phone: "(08) 9322 2811",
    website: "pending", // Invalid placeholder website
    address: "Suite 4, 1260 Hay St, West Perth WA 6005",
    postalCode: "6005",
    practiceType: "Executive Health & GP",
    scrapedSource: "YellowPages Scraping Bot v2.1",
    scrapeTimestamp: "2026-10-28 10:08:45"
  },
  {
    id: "RAW-PER-007",
    clinicName: "Fremantle Family Doctors",
    city: "Perth",
    state: "WA",
    phone: "(08) 9336 3030",
    website: "https://www.fremantledoctors.com.au",
    address: "88 High St, Fremantle WA 6160",
    postalCode: "6160",
    practiceType: "Long-established Community GP",
    scrapedSource: "HotDoc Directory",
    scrapeTimestamp: "2026-10-28 10:10:30"
  },
  {
    id: "RAW-PER-008",
    clinicName: "South Perth Medical Practice",
    city: "Perth",
    state: "wa",
    phone: "(08) 9367 1799",
    website: "https://www.southperthmedical.com.au",
    address: "125 Mends St, South Perth WA 6151",
    postalCode: "6151",
    practiceType: "Bulk Billing Primary Clinic",
    scrapedSource: "HealthEngine Directory",
    scrapeTimestamp: "2026-10-28 10:12:15"
  }
];

export const DATASET_PRESETS = [
  {
    id: "preset-all-au",
    name: "Australian General Practice Multi-City Audit (35 Records)",
    description: "Production web scrape covering Sydney, Melbourne, Brisbane & Perth. Contains duplicates, whitespace anomalies, and missing contact cells.",
    data: AUSTRALIAN_GP_DATASET_DEFAULT
  },
  {
    id: "preset-syd-mel",
    name: "Sydney & Melbourne Primary Care Cohort (19 Records)",
    description: "Eastern seaboard metro corridor audit focusing on high-density GP practices with phone formatting discrepancies.",
    data: AUSTRALIAN_GP_DATASET_DEFAULT.filter(d => ['Sydney', 'Melbourne'].includes(d.city))
  },
  {
    id: "preset-bne-per",
    name: "Brisbane & Perth Urban Healthcare Scan (16 Records)",
    description: "Sunbelt and Western Australia GP scraping dataset with missing website tokens and whitespace irregularities.",
    data: AUSTRALIAN_GP_DATASET_DEFAULT.filter(d => ['Brisbane', 'Perth'].includes(d.city))
  }
];
