-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Roles Table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role) REFERENCES roles(name)
);

-- Countries Table
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(3) NOT NULL UNIQUE,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cities Table
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cities_country FOREIGN KEY (country_id) REFERENCES countries(id)
);

-- Specializations Table
CREATE TABLE specializations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Certification Levels Table
CREATE TABLE certification_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    requirements JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Applications Table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    application_number VARCHAR(50) UNIQUE NOT NULL,
    specialization_id UUID,
    certification_level_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    submission_date TIMESTAMP WITH TIME ZONE,
    review_date TIMESTAMP WITH TIME ZONE,
    approval_date TIMESTAMP WITH TIME ZONE,
    rejection_date TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    reviewer_id UUID,
    registrar_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_applications_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_applications_specialization FOREIGN KEY (specialization_id) REFERENCES specializations(id),
    CONSTRAINT fk_applications_certification_level FOREIGN KEY (certification_level_id) REFERENCES certification_levels(id),
    CONSTRAINT fk_applications_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id),
    CONSTRAINT fk_applications_registrar FOREIGN KEY (registrar_id) REFERENCES users(id),
    CONSTRAINT chk_application_status CHECK (status IN ('draft', 'submitted', 'under_review', 'pending_documents', 'approved', 'rejected', 'registered'))
);

-- Personal Information Table
CREATE TABLE personal_information (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    national_id VARCHAR(20),
    passport_number VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    nationality VARCHAR(100),
    marital_status VARCHAR(20),
    address TEXT,
    city_id UUID,
    postal_code VARCHAR(10),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_personal_info_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_personal_info_city FOREIGN KEY (city_id) REFERENCES cities(id),
    CONSTRAINT chk_gender CHECK (gender IN ('male', 'female')),
    CONSTRAINT chk_marital_status CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed'))
);

-- Education Table
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    degree_type VARCHAR(50) NOT NULL,
    degree_name VARCHAR(255) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    institution_country VARCHAR(100),
    field_of_study VARCHAR(255),
    graduation_year INTEGER,
    graduation_date DATE,
    gpa DECIMAL(3,2),
    gpa_scale DECIMAL(3,2),
    certificate_url TEXT,
    transcript_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID,
    verification_date TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_education_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    CONSTRAINT fk_education_verified_by FOREIGN KEY (verified_by) REFERENCES users(id),
    CONSTRAINT chk_degree_type CHECK (degree_type IN ('bachelor', 'master', 'phd', 'diploma', 'certificate'))
);

-- Work Experience Table
CREATE TABLE work_experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_type VARCHAR(100),
    industry VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    job_description TEXT,
    responsibilities TEXT,
    achievements TEXT,
    supervisor_name VARCHAR(255),
    supervisor_contact VARCHAR(255),
    employment_letter_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID,
    verification_date TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_experience_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    CONSTRAINT fk_experience_verified_by FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- Professional Training Table
CREATE TABLE professional_training (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    training_title VARCHAR(255) NOT NULL,
    training_provider VARCHAR(255) NOT NULL,
    training_type VARCHAR(50),
    start_date DATE,
    end_date DATE,
    duration_hours INTEGER,
    certificate_number VARCHAR(100),
    certificate_url TEXT,
    skills_acquired TEXT,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID,
    verification_date TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_training_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    CONSTRAINT fk_training_verified_by FOREIGN KEY (verified_by) REFERENCES users(id),
    CONSTRAINT chk_training_type CHECK (training_type IN ('course', 'workshop', 'seminar', 'certification', 'conference'))
);

-- Documents Table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(50),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_required BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID,
    verification_date TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_documents_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    CONSTRAINT fk_documents_verified_by FOREIGN KEY (verified_by) REFERENCES users(id),
    CONSTRAINT chk_document_type CHECK (document_type IN ('national_id', 'passport', 'photo', 'degree_certificate', 'transcript', 'experience_letter', 'training_certificate', 'other'))
);

-- Professional Certifications Table
CREATE TABLE professional_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    certification_name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    certification_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    is_active BOOLEAN DEFAULT true,
    certificate_url TEXT,
    verification_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID,
    verification_date TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_certifications_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    CONSTRAINT fk_certifications_verified_by FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- Verification History Table
CREATE TABLE verification_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    user_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_verification_history_application FOREIGN KEY (application_id) REFERENCES applications(id),
    CONSTRAINT fk_verification_history_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT chk_verification_action CHECK (action IN ('verify', 'reject', 'approve', 'update', 'comment')),
    CONSTRAINT chk_verification_entity_type CHECK (entity_type IN ('education', 'experience', 'training', 'document', 'certification', 'application'))
);

-- Institutions Table
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_type VARCHAR(50) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    license_number VARCHAR(100),
    commercial_register VARCHAR(100),
    tax_number VARCHAR(100),
    establishment_year INTEGER,
    address TEXT,
    city_id UUID,
    website VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_person VARCHAR(255),
    description_en TEXT,
    description_ar TEXT,
    accreditation_body VARCHAR(255),
    accreditation_date DATE,
    accreditation_expiry DATE,
    sector VARCHAR(100),
    company_size VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    logo_url TEXT,
    documents JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_institutions_city FOREIGN KEY (city_id) REFERENCES cities(id),
    CONSTRAINT chk_institution_type CHECK (institution_type IN ('university', 'company', 'training_center', 'government')),
    CONSTRAINT chk_institution_status CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    CONSTRAINT chk_company_size CHECK (company_size IN ('startup', 'small', 'medium', 'large', 'enterprise'))
);

-- Fellowship Programs Table
CREATE TABLE fellowship_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    institution_id UUID,
    duration_months INTEGER,
    start_date DATE,
    end_date DATE,
    application_deadline DATE,
    max_participants INTEGER,
    requirements JSONB DEFAULT '{}',
    benefits JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active',
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fellowship_institution FOREIGN KEY (institution_id) REFERENCES institutions(id),
    CONSTRAINT fk_fellowship_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT chk_fellowship_status CHECK (status IN ('draft', 'active', 'closed', 'cancelled'))
);

-- Fellowship Applications Table
CREATE TABLE fellowship_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fellowship_id UUID NOT NULL,
    user_id UUID NOT NULL,
    application_number VARCHAR(50) UNIQUE NOT NULL,
    motivation_letter TEXT,
    research_proposal TEXT,
    status VARCHAR(50) DEFAULT 'submitted',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_by UUID,
    review_date TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fellowship_app_fellowship FOREIGN KEY (fellowship_id) REFERENCES fellowship_programs(id),
    CONSTRAINT fk_fellowship_app_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_fellowship_app_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id),
    CONSTRAINT chk_fellowship_app_status CHECK (status IN ('submitted', 'under_review', 'accepted', 'rejected', 'waitlisted'))
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT chk_notification_type CHECK (type IN ('info', 'success', 'warning', 'error', 'application_update', 'document_required', 'verification_complete'))
);

-- Audit Log Table
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_log_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_submission_date ON applications(submission_date);
CREATE INDEX idx_education_application_id ON education(application_id);
CREATE INDEX idx_experience_application_id ON work_experience(application_id);
CREATE INDEX idx_training_application_id ON professional_training(application_id);
CREATE INDEX idx_documents_application_id ON documents(application_id);
CREATE INDEX idx_certifications_application_id ON professional_certifications(application_id);
CREATE INDEX idx_verification_history_application_id ON verification_history(application_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
