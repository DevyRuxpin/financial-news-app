const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-6 fixed bottom-0 w-full">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Financial News</h3>
              <p className="text-gray-400">Stay updated with market trends</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Financial News App. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  