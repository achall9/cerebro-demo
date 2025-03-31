import { useState } from 'react';
import { format, parse } from 'date-fns';
import { SheetIcon } from './icons/SheetIcon';

interface FormContentProps {
  newEntry: FinancialData;
  setNewEntry: (entry: FinancialData) => void;
  handleSubmit: (e: React.FormEvent) => void;
  error?: string;
  didSucceed: boolean;
}

interface FinancialData {
  date: string;
  cashOnHand: number;
  cashBurn: number;
  monthlyRevenue: number;
}

export function FormContent({ newEntry, setNewEntry, handleSubmit, error, didSucceed }: FormContentProps) {
  const [isEmailCopyMode, setIsEmailCopyMode] = useState(false);
  const [emailCopy, setEmailCopy] = useState('');
  const [aiError, setAiError] = useState('');
  
  const toggleEmailCopyMode = () => {
    setIsEmailCopyMode(!isEmailCopyMode);
  };

  const handleExtractData = async () => {
    try {
      const response = await fetch('/api/openaiExtract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailData: emailCopy }),
      });
      const data = await response.json();
      // Parse the JSON string in data.message to get the actual object
      const financialData = JSON.parse(data.message);
      setNewEntry({
        ...newEntry,
        date: format(new Date(), 'MMM d, yyyy'),
        cashOnHand: Number(financialData.cashOnHand) || 0,
        monthlyRevenue: Number(financialData.monthlyRevenue) || 0,
        cashBurn: Number(financialData.cashBurn) || 0
      });
      setEmailCopy('');
      setIsEmailCopyMode(false);
    } catch (error) {
      setAiError('Error extracting data.');
      console.error('Error extracting data:', error);
    }
  };

  const getDateValue = () => {
    if (!newEntry.date) {
      return format(new Date(), 'yyyy-MM-dd');
    }
    try {
      return format(parse(newEntry.date, 'MMM d, yyyy', new Date()), 'yyyy-MM-dd');
    } catch {
      return format(new Date(), 'yyyy-MM-dd');
    }
  };

  return (
    <form onSubmit={isEmailCopyMode ? (e) => { e.preventDefault(); handleExtractData(); } : handleSubmit} className="space-y-4">
      <div className="flex bg-gray-50 px-4 py-4 justify-between items-center">
        <label className="block text-sm font-semibold text-gray-700">
          {isEmailCopyMode ? 'Email Copy' : 'Add New Metric'}
        </label>
        <button
          type="button"
          onClick={toggleEmailCopyMode}
          className={`p-2 rounded-full ${isEmailCopyMode ? 'bg-brandPurple text-white' : 'bg-gray-200 text-gray-700'} hover:bg-brandPurple/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brandPurple/50 focus:ring-offset-2`}
        >
          <SheetIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="px-4">
      {isEmailCopyMode ? (
        <textarea
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#776FCB]/20 focus:border-[#776FCB]"
          rows={5}
          placeholder="Enter your email copy here..."
          value={emailCopy}
          onChange={(e) => setEmailCopy(e.target.value)}
        />
      ) : (
        <>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#776FCB]/20 focus:border-[#776FCB] appearance-none"
                value={getDateValue()}
                onChange={(e) => {
                  try {
                    console.log('e.target.value', e.target.value);
                    const date = parse(e.target.value, 'yyyy-MM-dd', new Date());
                    setNewEntry({
                      ...newEntry,
                      date: format(date, 'MMM d, yyyy')
                    });
                  } catch (error) {
                    console.error('Error parsing date:', error);
                  }
                }}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Cash on Hand
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#776FCB]/20 focus:border-[#776FCB]"
              value={newEntry.cashOnHand}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setNewEntry({...newEntry, cashOnHand: Number(value)});
              }}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Cash Burn
            </label>
            <input
              type="numeric"
              pattern="[0-9]*"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#776FCB]/20 focus:border-[#776FCB]"
              value={newEntry.cashBurn}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setNewEntry({...newEntry, cashBurn: Number(value)});
              }}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Monthly Revenue
            </label>
            <input
              type="numeric"
              pattern="[0-9]*"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#776FCB]/20 focus:border-[#776FCB]"
              value={newEntry.monthlyRevenue}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setNewEntry({...newEntry, monthlyRevenue: Number(value)});
              }}
              required
            />
          </div>
        </>
      )}
      </div>

   
    
      <div className="px-4">
      <button
        type="submit"
        className="w-full cursor-pointer bg-[#776FCB] text-white py-2 rounded-lg hover:bg-[#776FCB]/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#776FCB]/50 focus:ring-offset-2"
      >
        {isEmailCopyMode ? 'Extract Metrics' : 'Add Metric'}
      </button>

      {(error || aiError) && (
         <div className="text-red-500 text-sm text-center px-4 py-3">
           {error || aiError}
         </div>
      )}

      {didSucceed && (
        <div className="my-3 bg-green-100/70 text-green-700 text-sm text-center px-6 py-3 rounded-lg border border-green-200">
          Metric added successfully!
        </div>
      )}
      </div>

    </form>
  );
} 