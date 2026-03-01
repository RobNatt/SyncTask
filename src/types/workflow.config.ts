export type SystemRole = 'ADMIN' | 'PRIMARY_ACTOR' | 'SUPPORT_ACTOR' | 'TECHNICAL_ACTOR';

export interface WorkflowConfig {
  industry: string;
  roles: {
    id: SystemRole;
    label: string;
  }[];
  steps: {
    id: string;
    label: string;
    actor: SystemRole;
    requires: string[]; // IDs of steps that must be COMPLETED
    validation: (data: any) => boolean; // Zod or custom logic
  }[];
}

// Example: How a developer would "Onboard" a new industry in 5 minutes
export const ClinicalManifest: WorkflowConfig = {
  industry: "Healthcare",
  roles: [
    { id: 'PRIMARY_ACTOR', label: 'Doctor' },
    { id: 'SUPPORT_ACTOR', label: 'Nurse' },
    { id: 'TECHNICAL_ACTOR', label: 'MedTech' }
  ],
  steps: [
    { id: 'VITALS', label: 'Patient Vitals', actor: 'SUPPORT_ACTOR', requires: [], validation: (d) => !!d.bp },
    { id: 'TECH_CHECK', label: 'Machine Calibration', actor: 'TECHNICAL_ACTOR', requires: [], validation: (d) => d.status === 'OK' },
    { id: 'DIAGNOSIS', label: 'Final Diagnosis', actor: 'PRIMARY_ACTOR', requires: ['VITALS', 'TECH_CHECK'], validation: (d) => !!d.plan }
  ]
};