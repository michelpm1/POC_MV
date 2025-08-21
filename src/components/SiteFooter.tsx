export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 text-sm text-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <h3 className="text-gray-900 font-medium">MarketVector</h3>
            <p className="text-xs">Sign up for insights</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-gray-900 font-medium">Legal</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-gray-900">Privacy policy</a></li>
              <li><a href="#" className="hover:text-gray-900">Terms of service</a></li>
              <li><a href="#" className="hover:text-gray-900">Disclaimer</a></li>
              <li><a href="#" className="hover:text-gray-900">Imprint</a></li>
              <li><a href="#" className="hover:text-gray-900">Regulation</a></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-gray-900 font-medium">Company</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-gray-900">Documents</a></li>
              <li><a href="#" className="hover:text-gray-900">Data</a></li>
              <li><a href="#" className="hover:text-gray-900">Careers</a></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-gray-900 font-medium">Trademarks</h3>
            <p className="text-xs">© 2025 MarketVector Indexes GmbH (&#39;MarketVector&#39;). All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}


