export enum Role {
    SUPER_ADMIN = 'super_admin',
    GUIDELINE_ADMIN = 'guideline_admin',
    AUTHOR = 'author',
    REVIEWER = 'reviewer',
    VIEWER = 'viewer',
}

export enum GuidelineStatus {
    DRAFT = 'draft',
    IN_REVIEW = 'in_review',
    APPROVED = 'approved',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
    LIVING = 'living',
}

export enum RecommendationStrength {
    STRONG_FOR = 'strong',
    CONDITIONAL_FOR = 'conditional',
    CONDITIONAL_AGAINST = 'conditional_against',
    STRONG_AGAINST = 'strong_against',
    BEST_PRACTICE = 'best_practice',
}

export enum EvidenceCertainty {
    HIGH = 'high',
    MODERATE = 'moderate',
    LOW = 'low',
    VERY_LOW = 'very_low',
}
