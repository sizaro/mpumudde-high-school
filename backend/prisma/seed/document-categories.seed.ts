import { prisma } from "./prisma.js";

export async function seedDocumentCategories() {
  console.log("Seeding document categories...");

  const categories = [
    // Teacher Identification Documents
    { name: "National ID", entityType: "TEACHER", description: "National Identity Card", isRequired: false, allowMultiple: false },
    { name: "Passport", entityType: "TEACHER", description: "International Passport", isRequired: false, allowMultiple: false },
    { name: "LC1 Introduction Letter", entityType: "TEACHER", description: "Local Council 1 Introduction Letter", isRequired: false, allowMultiple: false },
    { name: "Driving Permit", entityType: "TEACHER", description: "Driving Permit / License", isRequired: false, allowMultiple: false },
    { name: "Birth Certificate", entityType: "TEACHER", description: "Birth Certificate", isRequired: false, allowMultiple: false },
    // Teacher Employment Documents
    { name: "Academic Certificate", entityType: "TEACHER", description: "Academic qualification certificate", isRequired: false, allowMultiple: true },
    { name: "Appointment Letter", entityType: "TEACHER", description: "Employment Appointment Letter", isRequired: false, allowMultiple: false },
    { name: "Employment Contract", entityType: "TEACHER", description: "Signed Employment Contract", isRequired: false, allowMultiple: false },
    { name: "Recommendation Letter", entityType: "TEACHER", description: "Reference / Recommendation Letter", isRequired: false, allowMultiple: true },
    { name: "Police Clearance", entityType: "TEACHER", description: "Police Clearance Certificate", isRequired: false, allowMultiple: false },
    { name: "Teaching License", entityType: "TEACHER", description: "Government Teaching License / Registration", isRequired: false, allowMultiple: false },
    { name: "CV", entityType: "TEACHER", description: "Curriculum Vitae", isRequired: false, allowMultiple: false },
    { name: "Medical Report", entityType: "TEACHER", description: "Medical Fitness Report", isRequired: false, allowMultiple: false },
    { name: "Other", entityType: "TEACHER", description: "Other document", isRequired: false, allowMultiple: true },
    // Student Documents
    { name: "Birth Certificate", entityType: "STUDENT", description: "Birth Certificate", isRequired: false, allowMultiple: false },
    { name: "Previous Report Card", entityType: "STUDENT", description: "Previous School Report Card", isRequired: false, allowMultiple: true },
    { name: "Transfer Letter", entityType: "STUDENT", description: "Transfer Letter from Previous School", isRequired: false, allowMultiple: false },
    { name: "Other", entityType: "STUDENT", description: "Other document", isRequired: false, allowMultiple: true },
    // Finance
    { name: "Invoice", entityType: "FINANCE", description: "Payment Invoice", isRequired: false, allowMultiple: true },
    { name: "Receipt", entityType: "FINANCE", description: "Payment Receipt", isRequired: false, allowMultiple: true },
  ];

  for (const cat of categories) {
    await prisma.documentCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        entityType: cat.entityType,
        description: cat.description,
        isRequired: cat.isRequired,
        allowMultiple: cat.allowMultiple,
        isActive: true,
      },
    });
    console.log(`Category checked: ${cat.name} (${cat.entityType})`);
  }

  console.log("Document categories completed.");
}
