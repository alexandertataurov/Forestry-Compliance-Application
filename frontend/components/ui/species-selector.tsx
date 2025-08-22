import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check as CheckIcon, ChevronDown as ChevronDownIcon, Search as SearchIcon, Tree as TreeIcon } from "lucide-react";
import { cn } from "./utils";

// Forestry species data structure
interface Species {
  id: string;
  name: string;
  scientificName: string;
  category: "coniferous" | "deciduous" | "mixed";
  commonNames: string[];
  density: number; // kg/m³
  color: string;
  description?: string;
}

interface SpeciesSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "filled";
  showSearch?: boolean;
  showCategoryFilter?: boolean;
  showScientificName?: boolean;
  showDensity?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

// Common forestry species data
const FORESTRY_SPECIES: Species[] = [
  // Coniferous species
  {
    id: "pine-scots",
    name: "Scots Pine",
    scientificName: "Pinus sylvestris",
    category: "coniferous",
    commonNames: ["Scots Pine", "Scotch Pine", "Baltic Pine"],
    density: 520,
    color: "#8B4513",
    description: "Widely distributed pine species, important for timber and paper production"
  },
  {
    id: "spruce-norway",
    name: "Norway Spruce",
    scientificName: "Picea abies",
    category: "coniferous",
    commonNames: ["Norway Spruce", "European Spruce", "Common Spruce"],
    density: 450,
    color: "#654321",
    description: "Fast-growing spruce, commonly used for construction and paper"
  },
  {
    id: "fir-silver",
    name: "Silver Fir",
    scientificName: "Abies alba",
    category: "coniferous",
    commonNames: ["Silver Fir", "European Silver Fir", "Common Fir"],
    density: 480,
    color: "#8B7355",
    description: "Large fir tree, valued for its high-quality timber"
  },
  {
    id: "larch-european",
    name: "European Larch",
    scientificName: "Larix decidua",
    category: "coniferous",
    commonNames: ["European Larch", "Common Larch"],
    density: 550,
    color: "#A0522D",
    description: "Deciduous conifer, durable wood used for outdoor construction"
  },
  
  // Deciduous species
  {
    id: "oak-english",
    name: "English Oak",
    scientificName: "Quercus robur",
    category: "deciduous",
    commonNames: ["English Oak", "Pedunculate Oak", "Common Oak"],
    density: 720,
    color: "#8B4513",
    description: "Long-lived oak species, high-quality timber for furniture and construction"
  },
  {
    id: "beech-european",
    name: "European Beech",
    scientificName: "Fagus sylvatica",
    category: "deciduous",
    commonNames: ["European Beech", "Common Beech"],
    density: 680,
    color: "#DEB887",
    description: "Hardwood species, excellent for furniture and flooring"
  },
  {
    id: "birch-silver",
    name: "Silver Birch",
    scientificName: "Betula pendula",
    category: "deciduous",
    commonNames: ["Silver Birch", "European White Birch"],
    density: 650,
    color: "#F5DEB3",
    description: "Fast-growing birch, used for plywood and paper production"
  },
  {
    id: "maple-norway",
    name: "Norway Maple",
    scientificName: "Acer platanoides",
    category: "deciduous",
    commonNames: ["Norway Maple", "European Maple"],
    density: 620,
    color: "#CD853F",
    description: "Hardwood maple, valued for its attractive grain and color"
  },
  {
    id: "ash-common",
    name: "Common Ash",
    scientificName: "Fraxinus excelsior",
    category: "deciduous",
    commonNames: ["Common Ash", "European Ash"],
    density: 690,
    color: "#8B7355",
    description: "Strong and flexible wood, excellent for tool handles and sports equipment"
  },
  {
    id: "elm-english",
    name: "English Elm",
    scientificName: "Ulmus procera",
    category: "deciduous",
    commonNames: ["English Elm", "Common Elm"],
    density: 560,
    color: "#8B4513",
    description: "Traditional hardwood, resistant to water and used for boat building"
  }
];

const SpeciesSelector = React.forwardRef<HTMLButtonElement, SpeciesSelectorProps>(
  (
    {
      value,
      onValueChange,
      placeholder = "Select species...",
      label,
      error,
      required = false,
      disabled = false,
      size = "default",
      variant = "default",
      showSearch = true,
      showCategoryFilter = true,
      showScientificName = true,
      showDensity = false,
      className,
      triggerClassName,
      contentClassName,
      labelClassName,
      errorClassName,
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
    const [isOpen, setIsOpen] = React.useState(false);

    const selectedSpecies = FORESTRY_SPECIES.find(species => species.id === value);

    const filteredSpecies = FORESTRY_SPECIES.filter(species => {
      const matchesSearch = searchTerm === "" || 
        species.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        species.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        species.commonNames.some(name => name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || species.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    const categories = [
      { id: "all", name: "All Species", count: FORESTRY_SPECIES.length },
      { id: "coniferous", name: "Coniferous", count: FORESTRY_SPECIES.filter(s => s.category === "coniferous").length },
      { id: "deciduous", name: "Deciduous", count: FORESTRY_SPECIES.filter(s => s.category === "deciduous").length }
    ];

    const sizeClasses = {
      sm: "h-8 text-sm px-2",
      default: "h-10 text-base px-3",
      lg: "h-12 text-lg px-4"
    };

    const variantClasses = {
      default: "border-surface-border bg-surface-bg",
      outline: "border-2 border-surface-border bg-transparent",
      filled: "border-transparent bg-surface-bg-variant"
    };

    return (
      <div className={cn("space-y-1", className)}>
        {label && (
          <label
            className={cn(
              "text-label font-label text-surface-on-surface",
              size === "sm" && "text-sm",
              size === "lg" && "text-base",
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-brand-error ml-1">*</span>}
          </label>
        )}

        <SelectPrimitive.Root value={value} onValueChange={onValueChange} onOpenChange={setIsOpen}>
          <SelectPrimitive.Trigger
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full rounded-md border transition-all outline-none",
              "focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              "min-touch-target flex items-center justify-between",
              sizeClasses[size],
              variantClasses[variant],
              error && "border-brand-error focus-visible:border-brand-error focus-visible:ring-brand-error/20",
              triggerClassName
            )}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {selectedSpecies ? (
                <>
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: selectedSpecies.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{selectedSpecies.name}</div>
                    {showScientificName && (
                      <div className="text-xs text-surface-on-variant italic truncate">
                        {selectedSpecies.scientificName}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <span className="text-surface-on-variant">{placeholder}</span>
              )}
            </div>
            <ChevronDownIcon className="h-4 w-4 opacity-50 flex-shrink-0" />
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className={cn(
                "bg-surface-bg text-surface-on-surface z-50 max-h-96 min-w-[16rem] overflow-hidden rounded-md border border-surface-border shadow-2",
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                contentClassName
              )}
              position="popper"
              sideOffset={4}
            >
              <div className="p-2 space-y-2">
                {/* Search Input */}
                {showSearch && (
                  <div className="relative">
                    <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-on-variant" />
                    <input
                      type="text"
                      placeholder="Search species..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-2 py-1 text-sm bg-surface-bg-variant border border-surface-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                )}

                {/* Category Filter */}
                {showCategoryFilter && (
                  <div className="flex gap-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={cn(
                          "px-2 py-1 text-xs rounded-md transition-colors",
                          selectedCategory === category.id
                            ? "bg-brand-primary text-brand-on-primary"
                            : "bg-surface-bg-variant text-surface-on-surface hover:bg-surface-border"
                        )}
                      >
                        {category.name} ({category.count})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <SelectPrimitive.Viewport className="p-1">
                {filteredSpecies.length === 0 ? (
                  <div className="py-8 text-center text-surface-on-variant">
                    <TreeIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No species found</p>
                    <p className="text-xs">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  filteredSpecies.map((species) => (
                    <SelectPrimitive.Item
                      key={species.id}
                      value={species.id}
                      className={cn(
                        "relative flex items-center gap-2 px-2 py-2 rounded-sm text-sm outline-none cursor-pointer",
                        "hover:bg-surface-bg-variant focus:bg-surface-bg-variant",
                        "data-[state=checked]:bg-brand-primary data-[state=checked]:text-brand-on-primary"
                      )}
                    >
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: species.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{species.name}</div>
                        {showScientificName && (
                          <div className="text-xs italic opacity-75">
                            {species.scientificName}
                          </div>
                        )}
                        {showDensity && (
                          <div className="text-xs opacity-75">
                            Density: {species.density} kg/m³
                          </div>
                        )}
                      </div>
                      <SelectPrimitive.ItemIndicator>
                        <CheckIcon className="h-4 w-4" />
                      </SelectPrimitive.ItemIndicator>
                    </SelectPrimitive.Item>
                  ))
                )}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>

        {error && (
          <p
            className={cn(
              "text-brand-error text-caption flex items-center gap-1",
              errorClassName
            )}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

SpeciesSelector.displayName = "SpeciesSelector";

export { SpeciesSelector };
export type { SpeciesSelectorProps, Species };
export { FORESTRY_SPECIES };
