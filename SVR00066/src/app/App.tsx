import { Routes, Route, Navigate } from 'react-router';
import { useAuth } from './hooks';
import { Layout }         from './components/Layout';
import { AdminLayout }    from './components/AdminLayout';
import { HomePage }       from './pages/HomePage';
import { ProductsPage }   from './pages/ProductsPage';
import { ProductDetail }  from './pages/ProductDetail';
import { AboutPage }      from './pages/AboutPage';
import { ContactPage }    from './pages/ContactPage';
import { BlogPage }       from './pages/BlogPage';
import { BlogPostPage }   from './pages/BlogPostPage';
import { NotFoundPage }   from './pages/NotFoundPage';
import { AdminLogin }     from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts }  from './pages/admin/AdminProducts';
import { AdminProductForm } from './pages/admin/AdminProductForm';
import { AdminBlog }      from './pages/admin/AdminBlog';
import { AdminBlogForm }  from './pages/admin/AdminBlogForm';
import { AdminInquiries } from './pages/admin/AdminInquiries';
import { AdminHomepage }  from './pages/admin/AdminHomepage';
import { AdminAbout }     from './pages/admin/AdminAbout';
import { AdminSettings }  from './pages/admin/AdminSettings';
import { AdminSEO }       from './pages/admin/AdminSEO';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B0B0B' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '2px solid #FFC107', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Loading…</p>
      </div>
    </div>
  );
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route element={<Layout />}>
        <Route path="/"                    element={<HomePage />} />
        <Route path="/products"            element={<ProductsPage />} />
        <Route path="/products/:slug"      element={<ProductDetail />} />
        <Route path="/about"               element={<AboutPage />} />
        <Route path="/contact"             element={<ContactPage />} />
        <Route path="/blog"                element={<BlogPage />} />
        <Route path="/blog/:slug"          element={<BlogPostPage />} />
        <Route path="*"                    element={<NotFoundPage />} />
      </Route>

      {/* ── Admin login (no layout) ── */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ── Admin panel (protected) ── */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index                         element={<AdminDashboard />} />
        <Route path="products"               element={<AdminProducts />} />
        <Route path="products/new"           element={<AdminProductForm />} />
        <Route path="products/:id"           element={<AdminProductForm />} />
        <Route path="blog"                   element={<AdminBlog />} />
        <Route path="blog/new"               element={<AdminBlogForm />} />
        <Route path="blog/:id"               element={<AdminBlogForm />} />
        <Route path="inquiries"              element={<AdminInquiries />} />
        <Route path="homepage"               element={<AdminHomepage />} />
        <Route path="about"                  element={<AdminAbout />} />
        <Route path="testimonials"           element={<AdminTestimonials />} />
        <Route path="seo"                    element={<AdminSEO />} />
        <Route path="settings"              element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
