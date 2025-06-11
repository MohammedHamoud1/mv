// src/pages/index.js
import React, { useState } from 'react';
import Layout from '../components/Layout'; // استيراد مكون Layout
import SignupModal from '../components/SignupModal'; // استيراد SignupModal

import {
  Shield, Target, CheckCircle, Code, Globe, Award, TrendingUp, Lock, Mail, MapPin, MessageSquare
} from 'lucide-react';

const HomePage = () => {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupType, setSignupType] = useState('researcher');

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800 text-white">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-24">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                The world's #1 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"> hacker-powered </span>
                security platform
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
                More Fortune 500 and Forbes Global 1000 companies trust SecureBounty than any other 
                hacker-powered security platform to find and fix critical vulnerabilities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => {setShowSignupModal(true); setSignupType('company')}}
                  className="bg-white text-indigo-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Start a bug bounty program
                </button>
                <button 
                  onClick={() => {setShowSignupModal(true); setSignupType('researcher')}}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-900 transition-colors"
                >
                  Become a hacker
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">400K+</div>
                <div className="text-gray-600">Security researchers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">$230M+</div>
                <div className="text-gray-600">Bounties awarded</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">2,800+</div>
                <div className="text-gray-600">Organizations</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">850K+</div>
                <div className="text-gray-600">Vulnerabilities resolved</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive security solutions powered by the world's largest community of ethical hackers
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Bug Bounty</h3>
                <p className="text-gray-600 mb-6">
                  Continuous security testing by ethical hackers to find vulnerabilities before attackers do.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Continuous testing</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Pay for results</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Global talent pool</li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Penetration Testing</h3>
                <p className="text-gray-600 mb-6">
                  Expert-led security assessments combining automated and manual testing techniques.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Expert-led testing</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Comprehensive reports</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Compliance ready</li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Code className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Code Review</h3>
                <p className="text-gray-600 mb-6">
                  Security-focused code reviews to identify vulnerabilities in your application code.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Security-focused</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Best practices</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Actionable insights</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">About SecureBounty</h2>
                <p className="text-lg text-gray-600 mb-6">
                  We're the trusted partner for security testing that delivers real results. 
                  Our platform connects organizations with the world's largest community of 
                  ethical hackers to surface critical security vulnerabilities.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  Since 2012, we've helped over 2,800 organizations including 26 of the top 
                  100 Fortune companies and nearly 2,500 organizations across the Federal 
                  civilian, defense, and intelligence communities.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-indigo-600 mb-1">2012</div>
                    <div className="text-gray-600">Founded</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600 mb-1">26</div>
                    <div className="text-gray-600">Fortune 100 companies</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <Globe className="h-8 w-8 text-indigo-600 mb-3" />
                    <h4 className="font-semibold mb-2">Global Reach</h4>
                    <p className="text-sm text-gray-600">Researchers from 195+ countries</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <Award className="h-8 w-8 text-green-600 mb-3" />
                    <h4 className="font-semibold mb-2">Trusted</h4>
                    <p className="text-sm text-gray-600">ISO 27001 certified platform</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <TrendingUp className="h-8 w-8 text-purple-600 mb-3" />
                    <h4 className="font-semibold mb-2">Results</h4>
                    <p className="text-sm text-gray-600">95% vulnerability accuracy</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <Lock className="h-8 w-8 text-red-600 mb-3" />
                    <h4 className="font-semibold mb-2">Security</h4>
                    <p className="text-sm text-gray-600">Bank-grade security controls</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-xl text-gray-600">Ready to strengthen your security posture?</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600">contact@securebounty.com</p>
              </div>
              
              <div className="text-center">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Visit Us</h3>
                <p className="text-gray-600">San Francisco, CA</p>
              </div>
              
              <div className="text-center">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600">24/7 Support Available</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <SignupModal show={showSignupModal} onClose={() => setShowSignupModal(false)} setSignupType={setSignupType} signupType={signupType} />
    </Layout>
  );
};

export default HomePage;
