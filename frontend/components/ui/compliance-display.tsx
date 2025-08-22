import * as React from 'react';
import { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { useFieldOperations } from './use-mobile';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  FileText,
  Calendar,
  User,
  MapPin,
  Clock,
  Eye,
  Download,
  ChevronRight,
  ChevronDown,
  Star,
  Award,
  Certificate,
  Gavel,
  BookOpen,
  Settings
} from 'lucide-react';
import { StatusBadge, ComplianceBadge, ViolationBadge, AuditBadge } from './status-badge';

export interface ComplianceRequirement {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'safety' | 'environmental' | 'operational' | 'documentation' | 'reporting';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'compliant' | 'non-compliant' | 'pending' | 'under-review';
  dueDate?: string;
  lastAudit?: string;
  responsiblePerson?: string;
  location?: string;
  documents?: string[];
  violations?: string[];
  notes?: string;
}

export interface AuditTrail {
  id: string;
  timestamp: number;
  action: 'created' | 'updated' | 'reviewed' | 'approved' | 'rejected' | 'audited';
  user: string;
  details: string;
  complianceId: string;
  attachments?: string[];
}

export interface ComplianceDisplayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof complianceDisplayVariants> {
  requirements: ComplianceRequirement[];
  auditTrail: AuditTrail[];
  currentUser: string;
  lastAuditDate?: string;
  nextAuditDate?: string;
  complianceScore?: number;
  violations?: number;
  pendingReviews?: number;
  showDetails?: boolean;
  compact?: boolean;
  forestry?: boolean;
}

const complianceDisplayVariants = cva(
  "relative w-full",
  {
    variants: {
      variant: {
        default: "bg-surface-bg border border-surface-border rounded-lg",
        field: "bg-white/95 dark:bg-gray-900/95 border-2 border-surface-border rounded-lg",
        compact: "bg-surface-card border border-surface-border rounded-md",
        critical: "bg-status-error/5 border-2 border-status-error/20 rounded-lg",
      },
      size: {
        sm: "p-2",
        default: "p-3",
        lg: "p-4",
      },
      priority: {
        low: "border-status-success/20",
        medium: "border-status-warning/20",
        high: "border-status-error/20",
        critical: "border-status-error/40",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      priority: "low",
    },
  }
);

export const ComplianceDisplay = React.forwardRef<HTMLDivElement, ComplianceDisplayProps>(
  ({ 
    className, 
    variant, 
    size, 
    priority,
    requirements,
    auditTrail,
    currentUser,
    lastAuditDate,
    nextAuditDate,
    complianceScore = 0,
    violations = 0,
    pendingReviews = 0,
    showDetails = false,
    compact = false,
    forestry = false,
    ...props 
  }, ref) => {
    const fieldOps = useFieldOperations();
    const [expandedRequirement, setExpandedRequirement] = useState<string | null>(null);
    const [showAuditTrail, setShowAuditTrail] = useState(false);
    const [filterCategory, setFilterCategory] = useState<string>('all');

    // Calculate compliance statistics
    const compliantCount = requirements.filter(r => r.status === 'compliant').length;
    const nonCompliantCount = requirements.filter(r => r.status === 'non-compliant').length;
    const pendingCount = requirements.filter(r => r.status === 'pending').length;
    const criticalViolations = requirements.filter(r => r.priority === 'critical' && r.status === 'non-compliant');

    // Get compliance score color
    const getScoreColor = (score: number) => {
      if (score >= 90) return 'text-status-success';
      if (score >= 70) return 'text-status-warning';
      return 'text-status-error';
    };

    // Get priority color
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'critical': return 'text-status-error';
        case 'high': return 'text-status-warning';
        case 'medium': return 'text-status-info';
        case 'low': return 'text-status-success';
        default: return 'text-surface-on-variant';
      }
    };

    // Format date
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    // Filter requirements by category
    const filteredRequirements = filterCategory === 'all' 
      ? requirements 
      : requirements.filter(r => r.category === filterCategory);

    return (
      <div
        ref={ref}
        className={cn(
          complianceDisplayVariants({ 
            variant: fieldOps.shouldUseHighContrast ? "field" : variant, 
            size: fieldOps.shouldUseLargeButtons ? "lg" : size, 
            priority 
          }),
          fieldOps.shouldUseCompactLayout && "p-2",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center gap-2",
              fieldOps.shouldUseLargeButtons && "gap-3"
            )}>
              <Shield className={cn(
                "text-brand-primary",
                fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-5 h-5"
              )} />
              <div>
                <div className={cn(
                  "font-semibold text-surface-on-surface",
                  fieldOps.shouldUseLargerText && "text-field-lg"
                )}>
                  {forestry ? 'Соответствие требованиям' : 'Compliance Status'}
                </div>
                <div className={cn(
                  "text-field-xs text-surface-on-variant",
                  fieldOps.shouldUseLargerText && "text-field-sm"
                )}>
                  {forestry ? 'Лесное хозяйство' : 'Forestry Operations'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {criticalViolations.length > 0 && (
              <StatusBadge
                status="error"
                count={criticalViolations.length}
                showText={false}
                fieldMode={fieldOps.shouldUseHighContrast}
                compact={fieldOps.shouldUseCompactLayout}
              />
            )}
            
            {pendingReviews > 0 && (
              <StatusBadge
                status="warning"
                count={pendingReviews}
                showText={false}
                fieldMode={fieldOps.shouldUseHighContrast}
                compact={fieldOps.shouldUseCompactLayout}
              />
            )}
          </div>
        </div>

        {/* Compliance Score */}
        <div className="ios-card p-4 mb-4">
          <div className="grid gap-4">
            <div className="text-center">
              <div className={cn(
                "text-3xl font-bold mb-1",
                getScoreColor(complianceScore),
                fieldOps.shouldUseLargerText && "text-4xl"
              )}>
                {complianceScore}%
              </div>
              <div className={cn(
                "text-field-sm text-surface-on-variant",
                fieldOps.shouldUseLargerText && "text-field-base"
              )}>
                {forestry ? 'Общий показатель соответствия' : 'Overall Compliance Score'}
              </div>
            </div>

            <div className={cn(
              "grid gap-2",
              fieldOps.isMobile ? "grid-cols-2" : "grid-cols-4",
              fieldOps.isLandscape && "grid-cols-4 gap-1"
            )}>
              <div className="text-center">
                <div className={cn(
                  "text-field-lg font-bold text-status-success",
                  fieldOps.shouldUseLargerText && "text-field-xl"
                )}>
                  {compliantCount}
                </div>
                <div className={cn(
                  "text-field-xs text-surface-on-variant",
                  fieldOps.shouldUseLargerText && "text-field-sm"
                )}>
                  {forestry ? 'Соответствует' : 'Compliant'}
                </div>
              </div>

              <div className="text-center">
                <div className={cn(
                  "text-field-lg font-bold text-status-error",
                  fieldOps.shouldUseLargerText && "text-field-xl"
                )}>
                  {nonCompliantCount}
                </div>
                <div className={cn(
                  "text-field-xs text-surface-on-variant",
                  fieldOps.shouldUseLargerText && "text-field-sm"
                )}>
                  {forestry ? 'Нарушения' : 'Violations'}
                </div>
              </div>

              <div className="text-center">
                <div className={cn(
                  "text-field-lg font-bold text-status-warning",
                  fieldOps.shouldUseLargerText && "text-field-xl"
                )}>
                  {pendingCount}
                </div>
                <div className={cn(
                  "text-field-xs text-surface-on-variant",
                  fieldOps.shouldUseLargerText && "text-field-sm"
                )}>
                  {forestry ? 'Ожидает' : 'Pending'}
                </div>
              </div>

              <div className="text-center">
                <div className={cn(
                  "text-field-lg font-bold text-status-info",
                  fieldOps.shouldUseLargerText && "text-field-xl"
                )}>
                  {requirements.length}
                </div>
                <div className={cn(
                  "text-field-xs text-surface-on-variant",
                  fieldOps.shouldUseLargerText && "text-field-sm"
                )}>
                  {forestry ? 'Всего' : 'Total'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <div className={cn(
            "text-field-sm font-medium mb-2",
            fieldOps.shouldUseLargerText && "text-field-base"
          )}>
            {forestry ? 'Фильтр по категориям' : 'Filter by Category'}
          </div>
          <div className={cn(
            "flex gap-2 overflow-x-auto",
            fieldOps.shouldUseCompactLayout && "gap-1"
          )}>
            {[
              { id: 'all', label: forestry ? 'Все' : 'All' },
              { id: 'safety', label: forestry ? 'Безопасность' : 'Safety' },
              { id: 'environmental', label: forestry ? 'Экология' : 'Environmental' },
              { id: 'operational', label: forestry ? 'Операции' : 'Operational' },
              { id: 'documentation', label: forestry ? 'Документация' : 'Documentation' },
              { id: 'reporting', label: forestry ? 'Отчётность' : 'Reporting' }
            ].map(category => (
              <button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                className={cn(
                  "px-3 py-1 rounded-full text-field-xs font-medium transition-colors",
                  filterCategory === category.id
                    ? "bg-brand-primary text-white"
                    : "bg-surface-card text-surface-on-variant hover:text-surface-on-surface",
                  fieldOps.shouldUseLargeButtons && "px-4 py-2 text-field-sm",
                  fieldOps.shouldUseLargerText && "text-field-base"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Requirements List */}
        <div className="space-y-3">
          {filteredRequirements.map(requirement => (
            <div
              key={requirement.id}
              className={cn(
                "ios-card p-3 border-l-4",
                requirement.priority === 'critical' ? "border-status-error" :
                requirement.priority === 'high' ? "border-status-warning" :
                requirement.priority === 'medium' ? "border-status-info" : "border-status-success"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-field-xs font-mono bg-surface-card px-2 py-1 rounded",
                      fieldOps.shouldUseLargerText && "text-field-sm"
                    )}>
                      {requirement.code}
                    </span>
                    <span className={cn(
                      "text-field-xs font-medium",
                      getPriorityColor(requirement.priority),
                      fieldOps.shouldUseLargerText && "text-field-sm"
                    )}>
                      {requirement.priority.toUpperCase()}
                    </span>
                    {requirement.status === 'compliant' ? (
                      <ComplianceBadge 
                        fieldMode={fieldOps.shouldUseHighContrast}
                        compact={fieldOps.shouldUseCompactLayout}
                      />
                    ) : requirement.status === 'non-compliant' ? (
                      <ViolationBadge 
                        fieldMode={fieldOps.shouldUseHighContrast}
                        compact={fieldOps.shouldUseCompactLayout}
                      />
                    ) : (
                      <AuditBadge 
                        fieldMode={fieldOps.shouldUseHighContrast}
                        compact={fieldOps.shouldUseCompactLayout}
                      />
                    )}
                  </div>

                  <div className={cn(
                    "font-medium text-surface-on-surface mb-1",
                    fieldOps.shouldUseLargerText && "text-field-lg"
                  )}>
                    {requirement.title}
                  </div>

                  <div className={cn(
                    "text-field-sm text-surface-on-variant",
                    fieldOps.shouldUseLargerText && "text-field-base"
                  )}>
                    {requirement.description}
                  </div>

                  {requirement.dueDate && (
                    <div className="flex items-center gap-1 mt-2">
                      <Calendar className={cn(
                        "text-surface-on-variant",
                        fieldOps.shouldUseLargeButtons ? "w-4 h-4" : "w-3 h-3"
                      )} />
                      <span className={cn(
                        "text-field-xs text-surface-on-variant",
                        fieldOps.shouldUseLargerText && "text-field-sm"
                      )}>
                        {forestry ? 'Срок' : 'Due'}: {formatDate(requirement.dueDate)}
                      </span>
                    </div>
                  )}

                  {requirement.responsiblePerson && (
                    <div className="flex items-center gap-1 mt-1">
                      <User className={cn(
                        "text-surface-on-variant",
                        fieldOps.shouldUseLargeButtons ? "w-4 h-4" : "w-3 h-3"
                      )} />
                      <span className={cn(
                        "text-field-xs text-surface-on-variant",
                        fieldOps.shouldUseLargerText && "text-field-sm"
                      )}>
                        {requirement.responsiblePerson}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setExpandedRequirement(
                    expandedRequirement === requirement.id ? null : requirement.id
                  )}
                  className={cn(
                    "touch-target p-1",
                    fieldOps.shouldUseLargeButtons && "p-2"
                  )}
                >
                  {expandedRequirement === requirement.id ? (
                    <ChevronDown className={cn(
                      "w-4 h-4 text-surface-on-variant",
                      fieldOps.shouldUseLargeButtons && "w-5 h-5"
                    )} />
                  ) : (
                    <ChevronRight className={cn(
                      "w-4 h-4 text-surface-on-variant",
                      fieldOps.shouldUseLargeButtons && "w-5 h-5"
                    )} />
                  )}
                </button>
              </div>

              {/* Expanded Details */}
              {expandedRequirement === requirement.id && (
                <div className="mt-3 pt-3 border-t border-surface-border">
                  {requirement.violations && requirement.violations.length > 0 && (
                    <div className="mb-3">
                      <div className={cn(
                        "text-field-sm font-medium mb-2",
                        fieldOps.shouldUseLargerText && "text-field-base"
                      )}>
                        {forestry ? 'Нарушения' : 'Violations'}:
                      </div>
                      <ul className="space-y-1">
                        {requirement.violations.map((violation, index) => (
                          <li key={index} className={cn(
                            "text-field-sm text-status-error flex items-start gap-2",
                            fieldOps.shouldUseLargerText && "text-field-base"
                          )}>
                            <XCircle className={cn(
                              "w-3 h-3 mt-0.5 flex-shrink-0",
                              fieldOps.shouldUseLargeButtons && "w-4 h-4"
                            )} />
                            {violation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {requirement.notes && (
                    <div className="mb-3">
                      <div className={cn(
                        "text-field-sm font-medium mb-2",
                        fieldOps.shouldUseLargerText && "text-field-base"
                      )}>
                        {forestry ? 'Примечания' : 'Notes'}:
                      </div>
                      <div className={cn(
                        "text-field-sm text-surface-on-variant",
                        fieldOps.shouldUseLargerText && "text-field-base"
                      )}>
                        {requirement.notes}
                      </div>
                    </div>
                  )}

                  {requirement.documents && requirement.documents.length > 0 && (
                    <div>
                      <div className={cn(
                        "text-field-sm font-medium mb-2",
                        fieldOps.shouldUseLargerText && "text-field-base"
                      )}>
                        {forestry ? 'Документы' : 'Documents'}:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {requirement.documents.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 px-2 py-1 bg-surface-card rounded text-field-xs"
                          >
                            <FileText className="w-3 h-3" />
                            {doc}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Audit Information */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-surface-border">
            <div className="flex items-center justify-between mb-3">
              <div className={cn(
                "text-field-sm font-medium",
                fieldOps.shouldUseLargerText && "text-field-base"
              )}>
                {forestry ? 'Аудит и отчётность' : 'Audit & Reporting'}
              </div>
              <button
                onClick={() => setShowAuditTrail(!showAuditTrail)}
                className={cn(
                  "ios-button ios-button-secondary touch-target",
                  fieldOps.shouldUseLargeButtons && "ios-button-lg"
                )}
              >
                <Eye className="w-4 h-4" />
                <span>{forestry ? 'История' : 'History'}</span>
              </button>
            </div>

            <div className={cn(
              "grid gap-3",
              fieldOps.isMobile ? "grid-cols-1" : "grid-cols-2",
              fieldOps.isLandscape && "grid-cols-2 gap-2"
            )}>
              {lastAuditDate && (
                <div className="ios-card p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className={cn(
                      "text-status-info",
                      fieldOps.shouldUseLargeButtons ? "w-5 h-5" : "w-4 h-4"
                    )} />
                    <span className={cn(
                      "text-field-sm font-medium",
                      fieldOps.shouldUseLargerText && "text-field-base"
                    )}>
                      {forestry ? 'Последний аудит' : 'Last Audit'}
                    </span>
                  </div>
                  <div className={cn(
                    "text-field-sm text-surface-on-variant",
                    fieldOps.shouldUseLargerText && "text-field-base"
                  )}>
                    {formatDate(lastAuditDate)}
                  </div>
                </div>
              )}

              {nextAuditDate && (
                <div className="ios-card p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className={cn(
                      "text-status-warning",
                      fieldOps.shouldUseLargeButtons ? "w-5 h-5" : "w-4 h-4"
                    )} />
                    <span className={cn(
                      "text-field-sm font-medium",
                      fieldOps.shouldUseLargerText && "text-field-base"
                    )}>
                      {forestry ? 'Следующий аудит' : 'Next Audit'}
                    </span>
                  </div>
                  <div className={cn(
                    "text-field-sm text-surface-on-variant",
                    fieldOps.shouldUseLargerText && "text-field-base"
                  )}>
                    {formatDate(nextAuditDate)}
                  </div>
                </div>
              )}
            </div>

            {/* Audit Trail */}
            {showAuditTrail && (
              <div className="mt-3">
                <div className={cn(
                  "text-field-sm font-medium mb-2",
                  fieldOps.shouldUseLargerText && "text-field-base"
                )}>
                  {forestry ? 'История изменений' : 'Change History'}
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {auditTrail.slice(0, 5).map(audit => (
                    <div key={audit.id} className="flex items-start gap-2 p-2 bg-surface-card rounded">
                      <div className="flex-shrink-0">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-2",
                          audit.action === 'approved' ? "bg-status-success" :
                          audit.action === 'rejected' ? "bg-status-error" :
                          audit.action === 'audited' ? "bg-status-info" : "bg-status-warning"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "text-field-sm font-medium",
                          fieldOps.shouldUseLargerText && "text-field-base"
                        )}>
                          {audit.user}
                        </div>
                        <div className={cn(
                          "text-field-xs text-surface-on-variant",
                          fieldOps.shouldUseLargerText && "text-field-sm"
                        )}>
                          {audit.details}
                        </div>
                        <div className={cn(
                          "text-field-xs text-surface-on-variant",
                          fieldOps.shouldUseLargerText && "text-field-sm"
                        )}>
                          {new Date(audit.timestamp).toLocaleString('ru-RU')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

ComplianceDisplay.displayName = 'ComplianceDisplay';
