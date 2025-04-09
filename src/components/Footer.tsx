
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-skillsync-blue to-skillsync-purple flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-skillsync-blue to-skillsync-purple bg-clip-text text-transparent">
                SkillSync
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              A peer-to-peer platform for exchanging skills and knowledge. Teach what you know, learn what you don't.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-skillsync-blue transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-skillsync-blue transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-skillsync-blue transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-skillsync-blue transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/explore" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Explore Skills
                </Link>
              </li>
              <li>
                <Link to="/teachers" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Find Teachers
                </Link>
              </li>
              <li>
                <Link to="/sessions" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Upcoming Sessions
                </Link>
              </li>
              <li>
                <Link to="/groups" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Community Groups
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/trust" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Trust & Safety
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} SkillSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
