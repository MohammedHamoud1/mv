// src/components/Layout.js
import Header from './Header'; // سنقوم بإنشاء هذا الملف لاحقاً
import Footer from './Footer'; // سنقوم بإنشاء هذا الملف لاحقاً

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
