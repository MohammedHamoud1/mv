// src/components/Footer.js
/* eslint-disable react/no-unescaped-entities */

import React from 'react';
import {Shield,Twitter, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-indigo-400" />
              <span className="text-lg font-bold">SecureBounty</span>
            </div>
            <p className="text-gray-400 text-sm">
              The world's #1 hacker-powered security platform.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Bug Bounty</a></li>
              <li><a href="#" className="hover:text-white">Penetration Testing</a></li>
              <li><a href="#" className="hover:text-white">Code Review</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <div className="flex space-x-4">
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Github className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 SecureBounty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
