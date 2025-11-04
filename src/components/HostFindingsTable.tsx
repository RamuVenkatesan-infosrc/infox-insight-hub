import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface Finding {
  hostFindings: string;
  vrrScore: number;
  scannerName: string;
  scannerPluginID: string;
  vulnerabilityName: string;
  scannerReportedSeverity: string;
  scannerSeverity: string;
  description: string;
  status: string;
  port: string;
  protocol: string;
  pluginOutput: string;
  possibleSolutions: string;
  possiblePatches: string;
  ipAddress: string;
  vulnerabilities: string[];
  weaknesses: string[];
  threat: string;
}

interface HostFindingsTableProps {
  data: Finding[];
}

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "critical":
      return "bg-severity-critical text-white";
    case "high":
      return "bg-severity-high text-white";
    case "medium":
      return "bg-severity-medium text-white";
    case "low":
      return "bg-severity-low text-white";
    default:
      return "bg-severity-info text-white";
  }
};

export function HostFindingsTable({ data }: HostFindingsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter(
    (item) =>
      item.hostFindings.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vulnerabilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ipAddress.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-card-foreground">Host Findings</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search findings..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Host</TableHead>
              <TableHead>VRR Score</TableHead>
              <TableHead>Scanner</TableHead>
              <TableHead>Vulnerability</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Port</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((finding, index) => (
              <TableRow key={index} className="hover:bg-muted/50 cursor-pointer">
                <TableCell className="font-medium">{finding.hostFindings}</TableCell>
                <TableCell>
                  <Badge variant="outline">{finding.vrrScore}</Badge>
                </TableCell>
                <TableCell>{finding.scannerName}</TableCell>
                <TableCell className="max-w-xs truncate" title={finding.vulnerabilityName}>
                  {finding.vulnerabilityName}
                </TableCell>
                <TableCell>
                  <Badge className={getSeverityColor(finding.scannerSeverity)}>
                    {finding.scannerSeverity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={finding.status === "Open" ? "destructive" : "secondary"}>
                    {finding.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {finding.port}/{finding.protocol}
                </TableCell>
                <TableCell className="font-mono text-sm">{finding.ipAddress}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} findings
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
