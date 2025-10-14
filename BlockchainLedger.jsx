import React, { useState, useEffect } from 'react';
import { counties } from '../data/counties';
import {
  Shield,
  CheckCircle,
  Link2,
  Clock,
  Hash,
  Database,
  TrendingUp,
  Download,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlockchainLedger = ({ selectedRegion }) => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    loadBlockchainRecords();
  }, [selectedRegion]);

  const loadBlockchainRecords = () => {
    // Simulate blockchain records
    const mockRecords = counties.map((county, idx) => ({
      id: `0x${Math.random().toString(16).substr(2, 40)}`,
      blockNumber: 1500000 + idx * 100,
      countyId: county.id,
      countyName: county.name,
      carbonAmount: county.carbonPotential,
      timestamp: new Date(Date.now() - idx * 86400000 * 3).toISOString(),
      verified: true,
      verifier: 'LandGuard AI',
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      credits: Math.floor(county.carbonPotential * 0.8 * 20),
      status: 'Confirmed'
    }));

    if (selectedRegion) {
      setRecords(mockRecords.filter(r => r.countyId === selectedRegion));
    } else {
      setRecords(mockRecords.slice(0, 10)); // Show latest 10
    }
  };

  const generateProofOfCarbon = () => {
    const county = counties.find(c => c.id === selectedRegion);
    if (!county) return;

    const newRecord = {
      id: `0x${Math.random().toString(16).substr(2, 40)}`,
      blockNumber: 1500000 + Math.floor(Math.random() * 10000),
      countyId: county.id,
      countyName: county.name,
      carbonAmount: county.carbonPotential,
      timestamp: new Date().toISOString(),
      verified: true,
      verifier: 'LandGuard AI',
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      credits: Math.floor(county.carbonPotential * 0.8 * 20),
      status: 'Pending'
    };

    // Simulate blockchain confirmation
    setTimeout(() => {
      newRecord.status = 'Confirmed';
      setRecords([newRecord, ...records]);
    }, 3000);

    setRecords([newRecord, ...records]);
  };

  const county = counties.find(c => c.id === selectedRegion);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="w-8 h-8" />
              Blockchain Proof-of-Carbon Ledger
            </h2>
            <p className="text-indigo-100 mt-2">
              Immutable verification of carbon sequestration across Kenya
            </p>
          </div>
          {county && (
            <Button
              onClick={generateProofOfCarbon}
              className="bg-white text-indigo-600 hover:bg-indigo-50"
            >
              <Database className="w-5 h-5 mr-2" />
              Generate Proof
            </Button>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Records</span>
            <Database className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{records.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Carbon</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {(records.reduce((sum, r) => sum + r.carbonAmount, 0) / 1000).toFixed(0)}k tCO₂
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Verified Credits</span>
            <CheckCircle className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ${(records.reduce((sum, r) => sum + r.credits, 0) / 1000).toFixed(0)}k
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Confirmed</span>
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {records.filter(r => r.status === 'Confirmed').length}
          </p>
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {selectedRegion ? `Records for ${county?.name}` : 'Recent Blockchain Records'}
        </h3>

        {records.length === 0 ? (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No blockchain records found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div
                key={record.id}
                className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedRecord(record)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <span className="font-mono text-sm text-gray-600">{record.id.substr(0, 20)}...</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        record.status === 'Confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {record.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">County</p>
                        <p className="font-semibold text-gray-800">{record.countyName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Carbon Amount</p>
                        <p className="font-semibold text-green-700">
                          {(record.carbonAmount / 1000).toFixed(1)}k tCO₂
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Credits</p>
                        <p className="font-semibold text-yellow-700">
                          ${(record.credits / 1000).toFixed(0)}k
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Block #</p>
                        <p className="font-semibold text-indigo-700">
                          {record.blockNumber.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(record.timestamp).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        Verified by {record.verifier}
                      </div>
                    </div>
                  </div>

                  <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Shield className="w-6 h-6 text-indigo-600" />
                Carbon Credit Certificate
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                selectedRecord.status === 'Confirmed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {selectedRecord.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Transaction Hash</p>
                <p className="font-mono text-xs text-gray-800 break-all">
                  {selectedRecord.transactionHash}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Block Number</p>
                  <p className="text-xl font-bold text-indigo-700">
                    {selectedRecord.blockNumber.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Timestamp</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(selectedRecord.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">County</p>
                <p className="text-xl font-bold text-gray-800">{selectedRecord.countyName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Carbon Sequestered</p>
                  <p className="text-2xl font-bold text-green-700">
                    {selectedRecord.carbonAmount.toLocaleString()} tCO₂
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Carbon Credits</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    ${selectedRecord.credits.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="font-semibold text-gray-800">Verification</p>
                </div>
                <p className="text-sm text-gray-700">
                  This carbon sequestration has been verified by <strong>{selectedRecord.verifier}</strong> using
                  satellite imagery analysis, AI-powered land classification, and on-ground validation.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setSelectedRecord(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Certificate
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainLedger;

