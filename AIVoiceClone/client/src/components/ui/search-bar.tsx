import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: "name" | "date";
  onSortChange: (sort: "name" | "date") => void;
}

export default function SearchBar({ searchQuery, onSearchChange, sortBy, onSortChange }: SearchBarProps) {
  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-reverse space-x-3">
          <i className="fas fa-search text-primary text-xl"></i>
          <span>البحث والاستعلام</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            data-testid="input-search"
            placeholder="ابحث بالاسم أو رقم البطاقة أو رقم المحفظة أو رقم الهاتف..."
            className="w-full px-4 py-3 pr-12"
          />
          <i className="fas fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-reverse space-x-2 text-sm text-gray-600">
            <i className="fas fa-info-circle"></i>
            <span>يمكنك البحث في جميع الحقول</span>
          </div>
          <div className="flex items-center space-x-reverse space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSortChange("name")}
              data-testid="button-sort-name"
              className={`text-sm ${sortBy === "name" ? "text-primary" : "text-gray-600"} hover:text-primary`}
            >
              <i className="fas fa-sort-alpha-down ml-1"></i>
              ترتيب بالاسم
            </Button>
            <span className="text-gray-400">|</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSortChange("date")}
              data-testid="button-sort-date"
              className={`text-sm ${sortBy === "date" ? "text-primary" : "text-gray-600"} hover:text-primary`}
            >
              <i className="fas fa-sort-numeric-down ml-1"></i>
              ترتيب بالتاريخ
            </Button>
            <span className="text-gray-400">|</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              data-testid="button-clear-search"
              className="text-primary hover:text-primary-dark text-sm"
            >
              مسح البحث
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
