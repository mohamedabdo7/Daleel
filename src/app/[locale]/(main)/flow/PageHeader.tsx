import React from "react";
import { Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  onSearch?: (query: string) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onSearch }) => {
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("query") as string;
    onSearch?.(query);
  };

  return (
    <div className="bg-gradient-to-r from-[#136fb7] to-[#0a2c75] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Protocols</h1>
            <p className="text-blue-100 text-sm">Browse Clinical Protocols</p>
          </div>
        </div>
        <div className="hidden md:flex">
          <form onSubmit={handleSearchSubmit}>
            <div className="bg-white rounded-full flex items-center overflow-hidden shadow-lg max-w-md">
              <div className="pl-4">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="query"
                placeholder="Search in Protocols"
                className="flex-1 px-3 py-2 text-sm text-gray-700 focus:outline-none bg-transparent"
              />
              <Button type="submit" size="sm" className="m-1 rounded-full">
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
