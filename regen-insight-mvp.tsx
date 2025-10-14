        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'reforestation' && <ReforestationView />}
        {activeTab === 'carbon' && <CarbonView />}
        {activeTab === 'community' && <CommunityView />}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-3">Technology Stack</h4>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• AI/ML: TensorFlow, OpenAI</li>
                <li>• GIS: Google Earth Engine</li>
                <li>• Blockchain: Polygon Network</li>
                <li>• Backend: Supabase</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Impact Metrics</h4>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• 85,900 tCO₂ sequestered</li>
                <li>• 47 regions monitored</li>
                <li>• 1,247 community contributors</li>
                <li>• $1.7M in carbon credits</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Powered By</h4>
              <p className="text-sm text-gray-300">
                Satellite imagery, AI land classification, predictive analytics, blockchain verification, and community-driven data collection.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            © 2025 ReGen Insight | Regenerating the Earth with Intelligence
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReGenInsightPlatform;
