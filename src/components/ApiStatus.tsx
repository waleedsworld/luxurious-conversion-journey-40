import { getApiKey } from "@/utils/apiConfig";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

export const ApiStatus = () => {
  const apiKey = getApiKey();
  
  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
        Test Environment
      </Badge>
      {apiKey && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Info className="h-4 w-4" />
          <span>API Key Configured</span>
        </div>
      )}
    </div>
  );
};