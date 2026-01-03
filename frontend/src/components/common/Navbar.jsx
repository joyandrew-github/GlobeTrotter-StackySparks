import React, { useState, useRef, useEffect } from 'react';
import { MapPin, User, Calendar, LogOut, Menu, X,User2 } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleMenuItemClick = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--secondary-color)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin style={{ color: 'var(--primary-color)' }} size={24} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
              GlobeTrotter
            </h1>
          </div>

          {/* Desktop Menu - Profile Dropdown */}
          <div style={{ position: 'relative' }} className="desktop-menu" ref={dropdownRef}>
            <button
              onClick={toggleProfileDropdown}
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, var(--secondary-color), #1a4060)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-color)',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(35, 87, 137, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <User2 size={20}/>
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                  minWidth: '240px',
                  overflow: 'hidden',
                  animation: 'fadeIn 0.2s ease-out',
                }}
              >
                {/* User Info Section */}
                <div
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, var(--secondary-color), #1a4060)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary-color)',
                        fontWeight: '700',
                        fontSize: '1.25rem',
                      }}
                    >
                      <User2 size={20}/>
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--secondary-color)', fontSize: '0.95rem' }}>
                        Abishek S
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        abishek@example.com
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div style={{ padding: '0.5rem 0' }}>
                  <button
                    onClick={handleMenuItemClick}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      fontSize: '0.9rem',
                      color: '#334155',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <User size={18} style={{ color: 'var(--secondary-color)' }} />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={handleMenuItemClick}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      fontSize: '0.9rem',
                      color: '#334155',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Calendar size={18} style={{ color: 'var(--secondary-color)' }} />
                    <span>Trip Calendar</span>
                  </button>
                </div>

                {/* Logout Section */}
                <div
                  style={{
                    borderTop: '1px solid #e2e8f0',
                    padding: '0.5rem',
                  }}
                >
                  <button
                    onClick={handleMenuItemClick}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      fontSize: '0.9rem',
                      color: '#dc2626',
                      fontWeight: '500',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '0.5rem',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? (
              <X size={24} color="var(--secondary-color)" />
            ) : (
              <Menu size={24} color="var(--secondary-color)" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              marginTop: '1rem',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
            className="mobile-dropdown"
          >
            {/* User Info Section - Mobile */}
            <div
              style={{
                padding: '1rem',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, var(--secondary-color), #1a4060)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-color)',
                    fontWeight: '700',
                    fontSize: '1.25rem',
                  }}
                >
                  AS
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--secondary-color)', fontSize: '0.95rem' }}>
                    Abishek S
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    abishek@example.com
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Items */}
            <div style={{ padding: '0.5rem 0' }}>
              <button
                onClick={handleMenuItemClick}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: '#334155',
                  textAlign: 'left',
                }}
              >
                <User size={18} style={{ color: 'var(--secondary-color)' }} />
                <span>Profile</span>
              </button>

              <button
                onClick={handleMenuItemClick}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: '#334155',
                  textAlign: 'left',
                }}
              >
                <Calendar size={18} style={{ color: 'var(--secondary-color)' }} />
                <span>Trip Calendar</span>
              </button>
            </div>

            {/* Logout Section - Mobile */}
            <div
              style={{
                borderTop: '1px solid #e2e8f0',
                padding: '0.5rem',
              }}
            >
              <button
                onClick={handleMenuItemClick}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: '#dc2626',
                  fontWeight: '500',
                  textAlign: 'left',
                }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        :root {
          --primary-color: #FDFFFC;
          --secondary-color: #235789;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-dropdown {
            display: none !important;
          }
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </header>
  );
};

export default Navbar;