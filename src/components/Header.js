// src/components/Header.js
import React, { useState } from 'react';
import Link from 'next/link'; // استخدم Link للتوجيه في Next.js
import { useRouter } from 'next/router'; // استخدم useRouter للحصول على المسار الحالي
import { useAuth } from '../context/AuthContext'; // استيراد AuthContext
import LoginModal from './LoginModal'; // سنقوم بإنشاء هذا لاحقاً
import SignupModal from './SignupModal'; // سنقوم بإنشاء هذا لاحقاً

import {
  Search, Shield, Trophy, Users, DollarSign, Star, Clock, AlertTriangle,
  CheckCircle, XCircle, Eye, MessageSquare, Filter, Plus, Menu, X, Bell,
  User, Settings, Home, Info, Mail, UserPlus, Briefcase, Activity,
  BarChart3, FileText, Award, Globe, Zap, Target, Lock, BookOpen,
  ChevronRight, Github, Twitter, Linkedin, MapPin, Calendar, TrendingUp,
  Cpu, Database, Code, Server, ChevronDown, Heart, Flag, Share2
} from 'lucide-react';

const Header = () => {
  const router = useRouter();
  const { user, signOut } = useAuth(); // الوصول إلى بيانات المستخدم ووظيفة تسجيل الخروج
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupType, setSignupType] = useState('researcher');

  const navItems = [
    { name: 'home', path: '/' },
    { name: 'programs', path: '/programs' },
    { name: 'hacktivity', path: '/hacktivity' },
    { name: 'leaderboard', path: '/leaderboard' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Damsec</span>
            </Link>

            <nav className="hidden md:flex space-x-6">
              {navItems.map(item => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`px-3 py-2 text-sm font-medium capitalize ${
                    router.pathname === item.path
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className={`px-3 py-2 text-sm font-medium ${
                    router.pathname === '/admin'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Admin
                </Link>
              )}
              {user?.role === 'company' && (
                <Link
                  href="/company-dashboard"
                  className={`px-3 py-2 text-sm font-medium ${
                    router.pathname === '/company-dashboard'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Dashboard
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="relative hidden md:block">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search programs, reports..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <Bell className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => router.push('/profile')} // توجيه إلى صفحة البروفايل
                >
                  <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
                    <p className="text-xs text-gray-500">Rep: {user.reputation || 0}</p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await signOut();
                    router.push('/'); // التوجيه للصفحة الرئيسية بعد تسجيل الخروج
                  }}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowSignupModal(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  Sign Up
                </button>
              </div>
            )}

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4">
          <nav className="space-y-2">
            {navItems.map(item => (
              <Link
                key={item.name}
                href={item.path}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded capitalize"
                onClick={() => setShowMobileMenu(false)}
              >
                {item.name}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setShowMobileMenu(false)}
              >
                Admin
              </Link>
            )}
            {user?.role === 'company' && (
              <Link
                href="/company-dashboard"
                className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setShowMobileMenu(false)}
              >
                My Dashboard
              </Link>
            )}
            {user ? (
              <button
                onClick={async () => {
                  await signOut();
                  router.push('/');
                  setShowMobileMenu(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
              >
                Sign Out
              </button>
            ) : (
              <>
                <button
                  onClick={() => {setShowLoginModal(true); setShowMobileMenu(false);}}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {setShowSignupModal(true); setShowMobileMenu(false);}}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                >
                  Sign Up
                </button>
              </>
            )}
          </nav>
        </div>
      )}

      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <SignupModal show={showSignupModal} onClose={() => setShowSignupModal(false)} setSignupType={setSignupType} signupType={signupType} />
    </header>
  );
};

export default Header;
