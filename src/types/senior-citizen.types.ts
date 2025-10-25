// Base interfaces for related entities
export interface Barangay {
  id: number;
  name: string;
}

// Generic interface for array items with id and name
export interface Option {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  role: 'admin' | 'barangay' | 'osca' | 'viewOnly';
  barangayId?: number | null;
}

// Profile interfaces
export interface IdentifyingInformation {
  seniorId: number;
  picture?: string;
  lastname: string;
  firstname: string;
  middlename?: string;
  extension?: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  residence: string;
  street?: string;
  birthDate: Date;
  birthPlace: string;
  maritalStatus: string;
  religion?: string;
  sexAtBirth: string;
  contactNumber?: string;
  emailAddress?: string;
  fbMessengerName?: string;
  ethnicOrigin?: string;
  languageSpoken?: string;
  oscaIdNo?: string;
  gsisSssNo?: string;
  tin?: string;
  philhealthNo?: string;
  scAssociationIdNo?: string;
  otherGovIdNo?: string;
  employmentBusiness?: string;
  hasPension?: boolean;
  pensionList?: string;
  capabilityToTravel?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number | null;
  updatedBy?: number | null;
}

export interface FamilyComposition {
  seniorId: number;
  spouseLastname?: string;
  spouseFirstname?: string;
  spouseMiddlename?: string;
  spouseExtension?: string;
  fatherLastname?: string;
  fatherFirstname?: string;
  fatherMiddlename?: string;
  fatherExtension?: string;
  motherLastname?: string;
  motherFirstname?: string;
  motherMiddlename?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number | null;
  updatedBy?: number | null;
}

export interface DependencyProfile {
  seniorId: number;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number | null;
  updatedBy?: number | null;
  // Additional properties returned by API
  LivingConditions?: Option[];
  Cohabitants?: Option[];
}

export interface EducationProfile {
  seniorId: number;
  sharedSkills?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number | null;
  updatedBy?: number | null;
  // Additional properties returned by API
  HighestEducationalAttainments?: Option[];
  SpecializationTechnicalSkills?: Option[];
  CommunityInvolvements?: Option[];
}

export interface EconomicProfile {
  seniorId: number;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number | null;
  updatedBy?: number | null;
  // Additional properties returned by API
  IncomeAssistanceSources?: Option[];
  RealImmovableProperties?: Option[];
  PersonalMovableProperties?: Option[];
  MonthlyIncomes?: Option[];
  ProblemsNeedsCommonlyEncountereds?: Option[];
}

export interface HealthProfile {
  seniorId: number;
  bloodType: 'O' | 'O+' | 'O-' | 'A' | 'A+' | 'A-';
  physicalDisability?: string;
  listMedicines?: string;
  checkUp: boolean;
  scheduleCheckUp: 'Monthly' | 'Every 3 Months' | 'Every 6 Months' | 'Annually';
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number | null;
  updatedBy?: number | null;
  // Additional properties returned by API
  HealthProblemAilments?: Option[];
  DentalConcerns?: Option[];
  VisualConcerns?: Option[];
  AuralConcerns?: Option[];
  SocialEmotionalConcerns?: Option[];
  AreaOfDifficulties?: Option[];
}

export interface DeathInfo {
  seniorId: number;
  dateOfDeath: Date;
  deathCertificate?: Buffer;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number | null;
  updatedBy?: number | null;
}

export interface SeniorStatusHistory {
  id?: number;
  seniorId: number;
  status: 'Pending' | 'Active' | 'Declined';
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number | null;
  updatedBy?: number | null;
}

export interface HelpDeskRecord {
  id?: number;
  seniorId: number;
  helpDeskRecordCategory: number;
  details: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
}

export interface Children {
  id?: number;
  seniorId: number;
  name: string;
  occupation?: string;
  income?: string;
  age: number;
  isWorking: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number | null;
  updatedBy?: number | null;
}

export interface Dependent {
  id?: number;
  seniorId: number;
  name: string;
  occupation?: string;
  income?: string;
  age: number;
  isWorking: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number | null;
  updatedBy?: number | null;
}

// Main SeniorCitizen interface
export interface SeniorCitizen {
  id?: number;
  isDeleted?: boolean;
  barangayId: number;
  photo?: Blob;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;

  // Associations
  barangay?: Barangay;
  creator?: User;
  updater?: User;
  deleter?: User;

  // Profile Associations (PascalCase as returned by Sequelize API)
  IdentifyingInformation?: IdentifyingInformation;
  FamilyComposition?: FamilyComposition;
  DependencyProfile?: DependencyProfile;
  EducationProfile?: EducationProfile;
  EconomicProfile?: EconomicProfile;
  HealthProfile?: HealthProfile;
  DeathInfo?: DeathInfo;
  SeniorStatusHistories?: SeniorStatusHistory[];
  HelpDeskRecords?: HelpDeskRecord[];
  Children?: Children[];
  Dependents?: Dependent[];
}

// Utility types for different use cases
export type SeniorCitizenCreateInput = Omit<SeniorCitizen, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type SeniorCitizenUpdateInput = Partial<Omit<SeniorCitizen, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>;
export type SeniorCitizenWithProfiles = SeniorCitizen & {
  IdentifyingInformation: IdentifyingInformation;
  FamilyComposition: FamilyComposition;
  DependencyProfile: DependencyProfile;
  EducationProfile: EducationProfile;
  EconomicProfile: EconomicProfile;
  HealthProfile: HealthProfile;
  DeathInfo?: DeathInfo;
  SeniorStatusHistories: SeniorStatusHistory[];
  HelpDeskRecords: HelpDeskRecord[];
  Children: Children[];
  Dependents: Dependent[];
};

// Status types
export type SeniorStatus = 'Pending' | 'Active' | 'Declined';
export type BloodType = 'O' | 'O+' | 'O-' | 'A' | 'A+' | 'A-';
export type CheckUpSchedule = 'Monthly' | 'Every 3 Months' | 'Every 6 Months' | 'Annually';
export type UserRole = 'admin' | 'barangay' | 'osca' | 'viewOnly';
