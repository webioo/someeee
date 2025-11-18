export const documentKnowledge = {
  "birth certificate": {
    documents: [
      "Hospital birth record",
      "Parents' ID proof (Aadhar/Passport)",
      "Address proof",
      "Marriage certificate of parents"
    ],
    process: "Visit municipal office → Fill Form 1 → Submit within 21 days → Get certificate in 7 days",
    fees: "Free if within 21 days, ₹5 after"
  },
  "water connection": {
    documents: [
      "Property ownership proof",
      "NOC from society/landlord",
      "ID proof",
      "Address proof",
      "Property tax receipt"
    ],
    process: "Submit Form 3 → Site inspection → Pay charges → Installation in 15 days",
    fees: "Connection: ₹500-2000, Deposit: ₹1000"
  },
  "ration card": {
    documents: [
      "Family photo",
      "ID proof (Aadhar)",
      "Address proof",
      "Income certificate",
      "Gas connection proof (if any)"
    ],
    process: "Fill online form → Upload documents → Submit at Tehsil → Get card in 30 days",
    fees: "₹10 for APL, Free for BPL"
  },
  "property tax": {
    documents: [
      "Property documents",
      "Previous tax receipt",
      "Property card",
      "ID proof"
    ],
    process: "Visit municipal office → Calculate tax → Pay online/offline → Get receipt",
    fees: "Based on property size and location"
  },
  "trade license": {
    documents: [
      "Shop ownership/rental agreement",
      "NOC from fire department",
      "ID proof",
      "Address proof",
      "Photos of shop"
    ],
    process: "Submit application → Site inspection → Pay fees → Get license in 15 days",
    fees: "₹500-5000 based on business type"
  },
  "death certificate": {
    documents: [
      "Hospital death record/Doctor's certificate",
      "ID proof of deceased",
      "ID proof of applicant",
      "Address proof"
    ],
    process: "Fill Form 2 → Submit within 21 days → Get certificate in 3 days",
    fees: "Free if within 21 days, ₹5 after"
  },
  "building plan": {
    documents: [
      "7/12 extract",
      "Property documents",
      "Architect's plan",
      "Structural stability certificate",
      "NOC from neighbors"
    ],
    process: "Submit plans → Site inspection → Approval in 60 days → Pay development charges",
    fees: "₹500-10000 based on area"
  },
  "electricity connection": {
    documents: [
      "Property ownership proof",
      "ID proof",
      "Address proof",
      "Wiring completion certificate"
    ],
    process: "Apply online → Site visit → Install meter → Connection in 7 days",
    fees: "₹1000-3000 + security deposit"
  }
};

export const greetings = [
  "🙏 Namaste! I'm your Municipal AI Assistant. Ask about documents, processes, or services!",
  "Hello! I can help you with municipal services and document requirements. What do you need?",
  "Welcome! I'm here to guide you through municipal processes. How can I assist you?"
];

export const fallbackResponses = [
  "I can help with documents and processes for: birth certificate, water connection, ration card, property tax, trade license, death certificate, building plan, and electricity connection.",
  "Try asking about specific services like 'How to get birth certificate?' or 'Documents for water connection'",
  "I have information about various municipal services. Please ask about a specific document or service."
];
