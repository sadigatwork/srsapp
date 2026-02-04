// Authentication Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  phone?: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

// User Types
export interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  role: string
  isActive: boolean
  emailVerified: boolean
  emailVerifiedAt?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface PersonalInformation {
  id: string
  userId: string
  nationalId?: string
  passportNumber?: string
  dateOfBirth?: string
  gender?: "male" | "female"
  nationality?: string
  maritalStatus?: "single" | "married" | "divorced" | "widowed"
  address?: string
  cityId?: string
  postalCode?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelationship?: string
  createdAt: string
  updatedAt: string
}

// Application Types
export interface Application {
  id: string
  userId: string
  applicationNumber: string
  specializationId?: string
  certificationLevelId?: string
  status: ApplicationStatus
  submissionDate?: string
  reviewDate?: string
  approvalDate?: string
  rejectionDate?: string
  rejectionReason?: string
  reviewerId?: string
  registrarId?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "pending_documents"
  | "approved"
  | "rejected"
  | "registered"

export interface CreateApplicationRequest {
  specializationId: string
  certificationLevelId: string
}

export interface UpdateApplicationStatusRequest {
  applicationId: string
  status: ApplicationStatus
  userId: string
  reason?: string
}

// Education Types
export interface Education {
  id: string
  applicationId: string
  degreeType: "bachelor" | "master" | "phd" | "diploma" | "certificate"
  degreeName: string
  institutionName: string
  institutionCountry?: string
  fieldOfStudy?: string
  graduationYear?: number
  graduationDate?: string
  gpa?: number
  gpaScale?: number
  certificateUrl?: string
  transcriptUrl?: string
  isVerified: boolean
  verifiedBy?: string
  verificationDate?: string
  verificationNotes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateEducationRequest {
  applicationId: string
  degreeType: string
  degreeName: string
  institutionName: string
  institutionCountry?: string
  fieldOfStudy?: string
  graduationYear?: number
  graduationDate?: string
  gpa?: number
  gpaScale?: number
}

// Work Experience Types
export interface WorkExperience {
  id: string
  applicationId: string
  jobTitle: string
  companyName: string
  companyType?: string
  industry?: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  jobDescription?: string
  responsibilities?: string
  achievements?: string
  supervisorName?: string
  supervisorContact?: string
  employmentLetterUrl?: string
  isVerified: boolean
  verifiedBy?: string
  verificationDate?: string
  verificationNotes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateWorkExperienceRequest {
  applicationId: string
  jobTitle: string
  companyName: string
  companyType?: string
  industry?: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  jobDescription?: string
  responsibilities?: string
  achievements?: string
  supervisorName?: string
  supervisorContact?: string
}

// Training Types
export interface ProfessionalTraining {
  id: string
  applicationId: string
  trainingTitle: string
  trainingProvider: string
  trainingType?: "course" | "workshop" | "seminar" | "certification" | "conference"
  startDate?: string
  endDate?: string
  durationHours?: number
  certificateNumber?: string
  certificateUrl?: string
  skillsAcquired?: string
  isVerified: boolean
  verifiedBy?: string
  verificationDate?: string
  verificationNotes?: string
  createdAt: string
  updatedAt: string
}

// Document Types
export interface Document {
  id: string
  applicationId: string
  documentType: DocumentType
  documentName: string
  fileUrl: string
  fileSize?: number
  fileType?: string
  uploadDate: string
  isRequired: boolean
  isVerified: boolean
  verifiedBy?: string
  verificationDate?: string
  verificationNotes?: string
  createdAt: string
  updatedAt: string
}

export type DocumentType =
  | "national_id"
  | "passport"
  | "photo"
  | "degree_certificate"
  | "transcript"
  | "experience_letter"
  | "training_certificate"
  | "other"

export interface UploadDocumentRequest {
  applicationId: string
  documentType: DocumentType
  documentName: string
  file: File
  isRequired?: boolean
}

// Verification Types
export interface VerifyItemRequest {
  itemType: "education" | "experience" | "training" | "document" | "certification"
  itemId: string
  userId: string
  notes?: string
}

export interface VerificationHistory {
  id: string
  applicationId: string
  userId: string
  action: "verify" | "reject" | "approve" | "update" | "comment"
  entityType: "education" | "experience" | "training" | "document" | "certification" | "application"
  entityId: string
  oldStatus?: string
  newStatus?: string
  notes?: string
  createdAt: string
}

// Institution Types
export interface Institution {
  id: string
  institutionType: "university" | "company" | "training_center" | "government"
  nameEn: string
  nameAr: string
  licenseNumber?: string
  commercialRegister?: string
  taxNumber?: string
  establishmentYear?: number
  address?: string
  cityId?: string
  website?: string
  contactEmail?: string
  contactPhone?: string
  contactPerson?: string
  descriptionEn?: string
  descriptionAr?: string
  accreditationBody?: string
  accreditationDate?: string
  accreditationExpiry?: string
  sector?: string
  companySize?: "startup" | "small" | "medium" | "large" | "enterprise"
  status: "pending" | "approved" | "rejected" | "suspended"
  logoUrl?: string
  documents: any[]
  createdAt: string
  updatedAt: string
}

// Fellowship Types
export interface FellowshipProgram {
  id: string
  titleEn: string
  titleAr: string
  descriptionEn?: string
  descriptionAr?: string
  institutionId?: string
  durationMonths?: number
  startDate?: string
  endDate?: string
  applicationDeadline?: string
  maxParticipants?: number
  requirements: any
  benefits: any
  status: "draft" | "active" | "closed" | "cancelled"
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface FellowshipApplication {
  id: string
  fellowshipId: string
  userId: string
  applicationNumber: string
  motivationLetter?: string
  researchProposal?: string
  status: "submitted" | "under_review" | "accepted" | "rejected" | "waitlisted"
  submittedAt: string
  reviewedBy?: string
  reviewDate?: string
  reviewNotes?: string
  createdAt: string
  updatedAt: string
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error" | "application_update" | "document_required" | "verification_complete"
  relatedEntityType?: string
  relatedEntityId?: string
  isRead: boolean
  readAt?: string
  createdAt: string
}

// Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Query Parameters
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface ApplicationFilters extends PaginationParams {
  status?: ApplicationStatus
  userId?: string
  specializationId?: string
  certificationLevelId?: string
  dateFrom?: string
  dateTo?: string
}

export interface UserFilters extends PaginationParams {
  role?: string
  isActive?: boolean
  search?: string
}
