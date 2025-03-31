"use client";
import { useState, FormEvent, useEffect } from "react";
import { FormContent } from './components/FormContent';
import { ChevronDown } from './components/icons/ChevronDown';
import { FinancialChart } from './components/FinancialChart';
import { AiInput } from './components/AiInput';
import ResponseModal from './components/ResponseModal';
import { format } from "date-fns";

type SortDirection = "asc" | "desc" | null;
type SortField = "date" | "cashOnHand" | "cashBurn" | "monthlyRevenue" | null;

interface FinancialData {
  date: string;
  cashOnHand: number;
  cashBurn: number;
  monthlyRevenue: number;
}

export default function Home() {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [newEntry, setNewEntry] = useState<FinancialData>({
    date: "",
    cashOnHand: 0,
    cashBurn: 0,
    monthlyRevenue: 0,
  });
  const [error, setError] = useState("");
  const [isFormCollapsed, setIsFormCollapsed] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [didSucceed, setDidSucceed] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [financialData, setFinancialData] = useState<FinancialData[]>([
    {
      date: "Mar 1 2024",
      cashOnHand: 485000, // After Series A funding round
      cashBurn: 385000, // Growing team, increased marketing spend
      monthlyRevenue: 210000, // ~2.5M ARR
    },
    {
      date: "Feb 3 2024",
      cashOnHand: 512500,
      cashBurn: 375000,
      monthlyRevenue: 195000,
    },
    {
      date: "Jan 6 2024",
      cashOnHand: 540000,
      cashBurn: 360000,
      monthlyRevenue: 182000,
    },
    {
      date: "Dec 2, 2023",
      cashOnHand: 565000,
      cashBurn: 340000,
      monthlyRevenue: 170000,
    },
    {
      date: "Nov 4, 2023",
      cashOnHand: 590000,
      cashBurn: 320000,
      monthlyRevenue: 155000,
    },
    {
      date: "Oct 3, 2023",
      cashOnHand: 615000,
      cashBurn: 300000,
      monthlyRevenue: 142000,
    },
    {
      date: "Sep 9, 2023",
      cashOnHand: 85000,
      cashBurn: 280000,
      monthlyRevenue: 130000,
    },
    {
      date: "Aug 8, 2023",
      cashOnHand: 105000,
      cashBurn: 265000,
      monthlyRevenue: 118000,
    },
    {
      date: "Jul 2, 2023",
      cashOnHand: 125000,
      cashBurn: 250000,
      monthlyRevenue: 105000,
    },
    {
      date: "Jun 1, 2023",
      cashOnHand: 145000, 
      cashBurn: 235000,
      monthlyRevenue: 92000,
    }
  ]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc");
      setSortField(sortDirection === "desc" ? null : field);
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSortedData = () => {
    if (!sortField || !sortDirection) return financialData;

    return [...financialData].sort((a, b) => {
      const multiplier = sortDirection === "asc" ? 1 : -1;
      return a[sortField] > b[sortField] ? multiplier : -multiplier;
    });
  };

  const paginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const sortedData = getSortedData();
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  };

  const totalPages = Math.ceil(financialData.length / rowsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate the form data
    if (newEntry.cashOnHand <= 0 || newEntry.cashBurn <= 0 || newEntry.monthlyRevenue <= 0) {
      setError("Please fill in all fields");
      return; // Basic validation
    }
    
    setError(""); // Reset errors
    
    // Add the new entry to the state
    setFinancialData(prevData => [{
      ...newEntry,
      date: newEntry.date || format(new Date(), 'MMM d, yyyy')
    }, ...prevData]);
    
    // Reset the form
    setNewEntry({
      date: "",
      cashOnHand: 0,
      cashBurn: 0,
      monthlyRevenue: 0,
    });

    setDidSucceed(true);
    
    // Return to the first page to see the new entry
    setCurrentPage(1);
  };

  useEffect(() => {
    if (didSucceed) {
      setTimeout(() => {
        setDidSucceed(false);
      }, 3000);
    }
  }, [didSucceed]);

  const handleAiSubmit = (query: string) => {
    // Call OpenAI API
    setIsAiLoading(true);
    fetch('/api/openaiChat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: query, financialData: financialData }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAiResponse(data.message);
      })
      .catch((error) => {
        console.error('Error:', error); 
      })
      .finally(() => {
        setIsAiLoading(false);
      });
  };

  const closeModal = () => {
    setAiResponse(null);
  };

  return (
    <main className="min-h-screen bg-offWhite text-black p-10">
      <ResponseModal message={aiResponse || ''} isOpen={!!aiResponse} onClose={closeModal} />
      <div className="flex flex-col lg:flex-row space-x-6 space-y-4 items-center justify-between">
        <div className="flex flex-col lg:flex-row items-center gap-3 w-full max-w-[800px]">
          <h1 className="text-4xl font-bold text-brandPurple line-clamp-1">Cerebro-demo</h1>
          <div className="w-full max-w-[500px]">
            <AiInput className="w-full" onSubmit={handleAiSubmit} isLoading={isAiLoading} />
          </div>
        </div>
  
        <button className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors lg:order-last order-first w-full max-w-[500px] lg:w-auto mb-3">
            <span className="text-gray-700 font-medium line-clamp-1">Company ABC</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-semibold text-gray-800">Portfolio Value</h1>
        <div className="flex items-center gap-2">
          <div className="text-5xl font-bold text-gray-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(financialData[0]?.cashOnHand || 0)}
          </div>
          {financialData[1] && (
            <div className={`text-2xl ${financialData[0].cashOnHand > financialData[1].cashOnHand ? 'text-green-500' : 'text-red-500'}`}>
              {financialData[0].cashOnHand > financialData[1].cashOnHand ? '↑' : '↓'}
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Form (shown above table) */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsFormCollapsed(!isFormCollapsed)}
          className="w-full bg-white rounded-lg shadow-lg p-4 flex justify-between items-center text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold">Add New Metric</span>
          <ChevronDown 
            className={`w-5 h-5 transition-transform duration-200 ${
              isFormCollapsed ? '' : 'rotate-180'
            }`}
          />
        </button>

        {/* Collapsible Form */}
        <div className={`transition-all duration-200 ease-in-out ${isFormCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-[600px] mt-4'}`}>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <FormContent newEntry={newEntry} setNewEntry={setNewEntry} handleSubmit={handleSubmit} error={error} didSucceed={didSucceed} />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex gap-8">
      {/* Desktop Form Section */}
        <div className="hidden lg:flex w-[21%] flex-col">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-[480px]">
              <FormContent newEntry={newEntry} setNewEntry={setNewEntry} handleSubmit={handleSubmit} error={error} didSucceed={didSucceed} />
            </div>
          </div>
        </div>
        
        {/* Table Section */}
        <div className="w-full lg:w-[75%] flex flex-col">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      {sortField === "date" && (
                        <span className="text-[#776FCB]">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("cashOnHand")}
                  >
                    <div className="flex items-center gap-2">
                      Cash on Hand
                      {sortField === "cashOnHand" && (
                        <span className="text-[#776FCB]">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("cashBurn")}
                  >
                    <div className="flex items-center gap-2">
                      Monthly Burn
                      {sortField === "cashBurn" && (
                        <span className="text-[#776FCB]">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("monthlyRevenue")}
                  >
                    <div className="flex items-center gap-2">
                      Monthly Revenue (MRR)
                      {sortField === "monthlyRevenue" && (
                        <span className="text-[#776FCB]">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData().map((row, index) => (
                  <tr 
                    key={index}
                    className={`
                      border-b border-gray-50 hover:bg-gray-50 transition-colors
                      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                    `}
                  >
                    <td className="px-6 py-5 text-sm text-gray-600">{row.date}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">
                      {formatCurrency(row.cashOnHand)}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">
                      {formatCurrency(row.cashBurn)}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">
                      {formatCurrency(row.monthlyRevenue)}
                    </td>
                  </tr>
                ))}
                
                {/* Add empty rows to maintain consistent table height */}
                {paginatedData().length < rowsPerPage && Array(rowsPerPage - paginatedData().length).fill(0).map((_, index) => (
                  <tr 
                    key={`empty-${index}`}
                    className={`border-b border-gray-50 h-[61px] ${(paginatedData().length + index) % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                  >
                    <td className="px-6 py-5"></td>
                    <td className="px-6 py-5"></td>
                    <td className="px-6 py-5"></td>
                    <td className="px-6 py-5"></td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            <div className="flex bg-gray-50 justify-between items-center px-6 py-3 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Showing {Math.min((currentPage - 1) * rowsPerPage + 1, financialData.length)} to {Math.min(currentPage * rowsPerPage, financialData.length)} of {financialData.length} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded-lg flex items-center justify-center ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="ml-1">Prev</span>
                </button>
                
                {/* <span className="text-sm text-gray-600 font-medium">
                  Page {currentPage} of {totalPages}
                </span> */}
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 rounded-lg flex items-center justify-center ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-1">Next</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
        
        </div>

      </div>

        {/* Add Chart Below Table */}
        <FinancialChart data={financialData} />
    </main>
  );
}
