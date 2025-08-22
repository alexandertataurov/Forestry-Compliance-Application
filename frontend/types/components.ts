// Component Library Type Definitions

// Base component props interface
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Button component types
export interface ButtonProps extends BaseComponentProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Input component types
export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  title?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

// Card component types
export interface CardProps extends BaseComponentProps {}
export interface CardHeaderProps extends BaseComponentProps {}
export interface CardTitleProps extends BaseComponentProps {}
export interface CardDescriptionProps extends BaseComponentProps {}
export interface CardContentProps extends BaseComponentProps {}
export interface CardFooterProps extends BaseComponentProps {}

// Badge component types
export interface BadgeProps extends BaseComponentProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

// Select component types
export interface SelectProps extends BaseComponentProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  placeholder?: string;
}

export interface SelectItemProps extends BaseComponentProps {
  value: string;
  disabled?: boolean;
}

// Checkbox component types
export interface CheckboxProps extends BaseComponentProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
}

// Switch component types
export interface SwitchProps extends BaseComponentProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

// Slider component types
export interface SliderProps extends BaseComponentProps {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

// Progress component types
export interface ProgressProps extends BaseComponentProps {
  value?: number;
  max?: number;
  min?: number;
}

// Tabs component types
export interface TabsProps extends BaseComponentProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

export interface TabsListProps extends BaseComponentProps {}
export interface TabsTriggerProps extends BaseComponentProps {
  value: string;
  disabled?: boolean;
}
export interface TabsContentProps extends BaseComponentProps {
  value: string;
}

// Sidebar component types
export interface SidebarProps extends BaseComponentProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export interface SidebarItemProps extends BaseComponentProps {
  active?: boolean;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

// Navigation component types
export interface NavigationProps extends BaseComponentProps {}
export interface NavigationItemProps extends BaseComponentProps {
  active?: boolean;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
}

// DataTable component types
export interface DataTableProps<T = any> extends BaseComponentProps {
  data: T[];
  columns: ColumnDef<T>[];
  pagination?: PaginationProps;
  sorting?: SortingProps;
  filtering?: FilteringProps;
  selection?: SelectionProps<T>;
  loading?: boolean;
  emptyMessage?: string;
}

export interface ColumnDef<T> {
  key: string;
  header: string | React.ReactNode;
  cell: (item: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export interface SortingProps {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortDirection: 'asc' | 'desc') => void;
}

export interface FilteringProps {
  filters: Filter[];
  onFilterChange: (filters: Filter[]) => void;
}

export interface Filter {
  key: string;
  value: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
}

export interface SelectionProps<T> {
  selectedItems: T[];
  onSelectionChange: (selectedItems: T[]) => void;
  selectAll?: boolean;
  onSelectAllChange?: (selectAll: boolean) => void;
}

// Chart component types
export interface ChartProps extends BaseComponentProps {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  data: ChartData;
  options?: ChartOptions;
  height?: string | number;
  width?: string | number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip?: {
      enabled?: boolean;
    };
  };
  scales?: {
    x?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
    y?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
  };
}

// StatusBadge component types
export interface StatusBadgeProps extends BaseComponentProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending';
  text: string;
  icon?: React.ReactNode;
}

// ProgressIndicator component types
export interface ProgressIndicatorProps extends BaseComponentProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

// Forestry-specific component types
export interface SpeciesSelectorProps extends BaseComponentProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}

export interface MeasurementInputProps extends BaseComponentProps {
  value?: number;
  onValueChange?: (value: number) => void;
  unit: 'cm' | 'm' | 'mm' | 'in' | 'ft';
  precision?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
}

export interface GPSInputProps extends BaseComponentProps {
  latitude?: number;
  longitude?: number;
  onLocationChange?: (latitude: number, longitude: number) => void;
  disabled?: boolean;
  required?: boolean;
  accuracy?: number;
  onAccuracyChange?: (accuracy: number) => void;
}

export interface NumericInputProps extends BaseComponentProps {
  value?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  label?: string;
  error?: string;
  suffix?: string;
  prefix?: string;
}

// Form component types
export interface FormProps extends BaseComponentProps {
  onSubmit?: (data: any) => void;
  onReset?: () => void;
  defaultValues?: any;
  validationSchema?: any;
}

export interface FormFieldProps extends BaseComponentProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

// Dialog component types
export interface DialogProps extends BaseComponentProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

export interface DialogTriggerProps extends BaseComponentProps {
  asChild?: boolean;
}

export interface DialogContentProps extends BaseComponentProps {
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onInteractOutside?: (event: Event) => void;
}

// Toast component types
export interface ToastProps extends BaseComponentProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
  duration?: number;
}

// Alert component types
export interface AlertProps extends BaseComponentProps {
  variant?: 'default' | 'destructive';
  icon?: React.ReactNode;
}

// Tooltip component types
export interface TooltipProps extends BaseComponentProps {
  content: string | React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
}

// Utility types
export type ComponentVariantProps<T> = T extends { variants: infer V } ? V : never;
export type ComponentSizeProps<T> = T extends { sizes: infer S } ? S : never;

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    destructive: string;
    muted: string;
    background: string;
    foreground: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
    fontWeight: {
      light: string;
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

// Event types
export interface ComponentEvent<T = any> {
  type: string;
  target: T;
  data?: any;
}

// Validation types
export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Accessibility types
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  'aria-disabled'?: boolean;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean;
  'aria-pressed'?: boolean;
  'aria-current'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: boolean;
  'aria-relevant'?: 'additions' | 'additions removals' | 'additions text' | 'all' | 'removals' | 'removals additions' | 'removals text' | 'text' | 'text additions' | 'text removals';
  'aria-busy'?: boolean;
  'aria-controls'?: string;
  'aria-flowto'?: string;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-level'?: number;
  'aria-multiline'?: boolean;
  'aria-multiselectable'?: boolean;
  'aria-orientation'?: 'horizontal' | 'vertical';
  'aria-placeholder'?: string;
  'aria-readonly'?: boolean;
  'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
  'aria-valuemax'?: number;
  'aria-valuemin'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
}
