#!/usr/bin/env python3
"""
Backend Test Suite for IbizaGirl.pics
Tests the static website functionality and any potential backend endpoints
"""

import requests
import sys
import time
from datetime import datetime

class IbizaGirlTester:
    def __init__(self, base_url="https://visual-content-shop.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.errors = []

    def log_test(self, name, success, message=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}: PASSED {message}")
        else:
            print(f"❌ {name}: FAILED {message}")
            self.errors.append(f"{name}: {message}")

    def test_static_files(self):
        """Test static file accessibility"""
        print("\n🔍 Testing Static Files...")
        
        static_files = [
            "/index.html",
            "/main.html", 
            "/styles.css",
            "/main-script.js",
            "/content-data-integration.js",
            "/content-data1.js"
        ]
        
        for file_path in static_files:
            try:
                response = requests.get(f"{self.base_url}{file_path}", timeout=10)
                success = response.status_code == 200
                self.log_test(
                    f"Static File {file_path}",
                    success,
                    f"Status: {response.status_code}"
                )
            except Exception as e:
                self.log_test(f"Static File {file_path}", False, f"Error: {str(e)}")

    def test_landing_page(self):
        """Test landing page functionality"""
        print("\n🏠 Testing Landing Page...")
        
        try:
            response = requests.get(self.base_url, timeout=10)
            success = response.status_code == 200
            
            if success:
                content = response.text
                # Check for key elements
                checks = [
                    ("Title", "IbizaGirl.pics" in content),
                    ("Auto-redirect script", "window.location.href = '/main.html'" in content),
                    ("Enter button", "ENTER PARADISE" in content),
                    ("Age warning", "Adults Only (18+)" in content),
                    ("Meta tags", 'meta name="description"' in content)
                ]
                
                for check_name, check_result in checks:
                    self.log_test(f"Landing Page {check_name}", check_result)
            else:
                self.log_test("Landing Page Access", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Landing Page Access", False, f"Error: {str(e)}")

    def test_main_application(self):
        """Test main application page"""
        print("\n🎯 Testing Main Application...")
        
        try:
            response = requests.get(f"{self.base_url}/main.html", timeout=10)
            success = response.status_code == 200
            
            if success:
                content = response.text
                # Check for key elements
                checks = [
                    ("Navigation buttons", 'data-view="gallery"' in content and 'data-view="videos"' in content),
                    ("PayPal SDK", "paypal.com/sdk/js" in content),
                    ("JuicyAds", "jads.co/js/jads.js" in content),
                    ("Pricing cards", "€9.99" in content and "€49.99" in content),
                    ("Gallery container", 'id="main-gallery"' in content),
                    ("Video container", 'id="video-gallery"' in content),
                    ("Banner rotation", 'id="bannerRotation"' in content),
                    ("Lightbox modal", 'id="lightbox"' in content)
                ]
                
                for check_name, check_result in checks:
                    self.log_test(f"Main App {check_name}", check_result)
            else:
                self.log_test("Main Application Access", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Main Application Access", False, f"Error: {str(e)}")

    def test_paypal_configuration(self):
        """Test PayPal configuration"""
        print("\n💳 Testing PayPal Configuration...")
        
        try:
            response = requests.get(f"{self.base_url}/main.html", timeout=10)
            if response.status_code == 200:
                content = response.text
                
                # Check PayPal configuration
                checks = [
                    ("PayPal Client ID", "AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5" in content),
                    ("EUR Currency", "currency=EUR" in content),
                    ("PayPal Buttons", "paypal.Buttons" in content),
                    ("Payment Handlers", "handlePaymentSuccess" in content),
                    ("Pricing Config", "prices:" in content and "ppv:" in content)
                ]
                
                for check_name, check_result in checks:
                    self.log_test(f"PayPal {check_name}", check_result)
            else:
                self.log_test("PayPal Configuration Check", False, "Cannot access main.html")
                
        except Exception as e:
            self.log_test("PayPal Configuration Check", False, f"Error: {str(e)}")

    def test_ads_integration(self):
        """Test ads integration"""
        print("\n📢 Testing Ads Integration...")
        
        try:
            response = requests.get(f"{self.base_url}/main.html", timeout=10)
            if response.status_code == 200:
                content = response.text
                
                # Check ads integration
                checks = [
                    ("JuicyAds Script", "jads.co/js/jads.js" in content),
                    ("Ad Containers", "ad-container" in content),
                    ("JuicyAds Calls", "jads(" in content),
                    ("Ad Verification Meta", "juicyads-site-verification" in content),
                    ("Multiple Ad Zones", content.count("jads(") >= 3)
                ]
                
                for check_name, check_result in checks:
                    self.log_test(f"Ads {check_name}", check_result)
            else:
                self.log_test("Ads Integration Check", False, "Cannot access main.html")
                
        except Exception as e:
            self.log_test("Ads Integration Check", False, f"Error: {str(e)}")

    def test_content_system(self):
        """Test content management system"""
        print("\n📁 Testing Content System...")
        
        content_files = [
            "/content-data1.js",
            "/content-data2.js", 
            "/content-data3.js",
            "/content-data4.js",
            "/content-data5.js",
            "/content-data6.js",
            "/content-data-integration.js"
        ]
        
        for file_path in content_files:
            try:
                response = requests.get(f"{self.base_url}{file_path}", timeout=10)
                success = response.status_code == 200
                
                if success and file_path == "/content-data1.js":
                    # Check key configurations in content-data1.js
                    content = response.text
                    config_checks = [
                        ("ContentConfig", "ContentConfig" in content),
                        ("TimeUtils", "TimeUtils" in content),
                        ("ArrayUtils", "ArrayUtils" in content),
                        ("PayPal Config", "paypal:" in content),
                        ("Pricing Config", "pricing:" in content)
                    ]
                    
                    for check_name, check_result in config_checks:
                        self.log_test(f"Content System {check_name}", check_result)
                
                self.log_test(f"Content File {file_path}", success, f"Status: {response.status_code}")
                
            except Exception as e:
                self.log_test(f"Content File {file_path}", False, f"Error: {str(e)}")

    def test_responsive_meta(self):
        """Test responsive design meta tags"""
        print("\n📱 Testing Responsive Design...")
        
        try:
            response = requests.get(f"{self.base_url}/main.html", timeout=10)
            if response.status_code == 200:
                content = response.text
                
                checks = [
                    ("Viewport Meta", 'name="viewport"' in content),
                    ("Mobile Responsive", "width=device-width" in content),
                    ("CSS Media Queries", "@media" in content or "responsive" in content.lower()),
                    ("Mobile Navigation", "nav-btn" in content)
                ]
                
                for check_name, check_result in checks:
                    self.log_test(f"Responsive {check_name}", check_result)
            else:
                self.log_test("Responsive Design Check", False, "Cannot access main.html")
                
        except Exception as e:
            self.log_test("Responsive Design Check", False, f"Error: {str(e)}")

    def test_seo_optimization(self):
        """Test SEO optimization"""
        print("\n🔍 Testing SEO Optimization...")
        
        pages = ["/index.html", "/main.html"]
        
        for page in pages:
            try:
                response = requests.get(f"{self.base_url}{page}", timeout=10)
                if response.status_code == 200:
                    content = response.text
                    
                    checks = [
                        ("Title Tag", "<title>" in content),
                        ("Meta Description", 'name="description"' in content),
                        ("Meta Keywords", 'name="keywords"' in content),
                        ("Open Graph", 'property="og:' in content),
                        ("Twitter Card", 'name="twitter:' in content),
                        ("Canonical URL", 'rel="canonical"' in content or page == "/main.html")
                    ]
                    
                    for check_name, check_result in checks:
                        self.log_test(f"SEO {page} {check_name}", check_result)
                        
            except Exception as e:
                self.log_test(f"SEO {page} Check", False, f"Error: {str(e)}")

    def run_all_tests(self):
        """Run all tests"""
        print(f"🚀 Starting IbizaGirl.pics Backend Test Suite")
        print(f"🌐 Testing URL: {self.base_url}")
        print(f"⏰ Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 60)
        
        # Run all test suites
        self.test_static_files()
        self.test_landing_page()
        self.test_main_application()
        self.test_paypal_configuration()
        self.test_ads_integration()
        self.test_content_system()
        self.test_responsive_meta()
        self.test_seo_optimization()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 TEST SUMMARY")
        print(f"✅ Tests Passed: {self.tests_passed}/{self.tests_run}")
        print(f"❌ Tests Failed: {len(self.errors)}")
        print(f"📈 Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.errors:
            print(f"\n🚨 FAILED TESTS:")
            for error in self.errors:
                print(f"   • {error}")
        
        print(f"\n⏰ Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return len(self.errors) == 0

def main():
    """Main test execution"""
    tester = IbizaGirlTester()
    success = tester.run_all_tests()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())