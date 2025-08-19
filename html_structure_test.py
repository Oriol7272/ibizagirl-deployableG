#!/usr/bin/env python3
"""
HTML Structure Test for IbizaGirl.pics
Tests the HTML files directly without browser automation
"""

import os
import re
from bs4 import BeautifulSoup

def test_html_structure():
    """Test HTML file structure and content"""
    
    print("🔍 Testing IbizaGirl.pics HTML Structure...")
    
    # Test index.html
    print("\n📄 Testing index.html...")
    
    if os.path.exists('/app/index.html'):
        with open('/app/index.html', 'r', encoding='utf-8') as f:
            index_content = f.read()
            
        soup = BeautifulSoup(index_content, 'html.parser')
        
        # Check key elements
        checks = [
            ("Title", soup.find('title') and 'IbizaGirl.pics' in soup.find('title').text),
            ("H1 with IbizaGirl.pics", soup.find('h1') and 'IbizaGirl.pics' in soup.find('h1').text),
            ("Enter Paradise button", soup.find('a', class_='enter-btn') and 'ENTER PARADISE' in soup.find('a', class_='enter-btn').text),
            ("Auto-redirect script", 'window.location.href = \'/main.html\'' in index_content),
            ("Adults Only warning", 'Adults Only (18+)' in index_content),
            ("Premium Paradise Gallery", 'Premium Paradise Gallery' in index_content),
            ("Palm tree emojis", '🌴' in index_content),
            ("CSS styles", soup.find('style') is not None),
            ("Meta description", soup.find('meta', attrs={'name': 'description'}) is not None),
            ("Open Graph tags", soup.find('meta', attrs={'property': 'og:title'}) is not None)
        ]
        
        passed = 0
        for check_name, result in checks:
            if result:
                print(f"✅ {check_name}")
                passed += 1
            else:
                print(f"❌ {check_name}")
        
        print(f"📊 Index.html: {passed}/{len(checks)} checks passed")
    else:
        print("❌ index.html not found")
    
    # Test main.html
    print("\n📄 Testing main.html...")
    
    if os.path.exists('/app/main.html'):
        with open('/app/main.html', 'r', encoding='utf-8') as f:
            main_content = f.read()
            
        soup = BeautifulSoup(main_content, 'html.parser')
        
        # Check key elements
        checks = [
            ("Title", soup.find('title') and 'IbizaGirl.pics' in soup.find('title').text),
            ("Main header", soup.find('header', class_='main-header') is not None),
            ("Site title", soup.find('h1', class_='site-title') is not None),
            ("Navigation buttons", len(soup.find_all('button', class_='nav-btn')) >= 3),
            ("Gallery view", soup.find('div', id='galleryView') is not None),
            ("Videos view", soup.find('div', id='videosView') is not None),
            ("Pricing view", soup.find('div', id='pricingView') is not None),
            ("Banner rotation", soup.find('div', id='bannerRotation') is not None),
            ("Main gallery", soup.find('div', id='main-gallery') is not None),
            ("Video gallery", soup.find('div', id='video-gallery') is not None),
            ("Pricing cards", soup.find('div', class_='pricing-cards') is not None),
            ("PayPal SDK", 'paypal.com/sdk/js' in main_content),
            ("JuicyAds script", 'jads.co/js/jads.js' in main_content),
            ("Lightbox modal", soup.find('div', id='lightbox') is not None),
            ("Footer", soup.find('footer', class_='main-footer') is not None),
            ("€9.99 price", '€9.99' in main_content),
            ("€49.99 price", '€49.99' in main_content),
            ("PayPal buttons", 'paypal.Buttons' in main_content),
            ("CSS link", soup.find('link', href='styles.css') is not None),
            ("Main script", soup.find('script', src='main-script.js') is not None)
        ]
        
        passed = 0
        for check_name, result in checks:
            if result:
                print(f"✅ {check_name}")
                passed += 1
            else:
                print(f"❌ {check_name}")
        
        print(f"📊 Main.html: {passed}/{len(checks)} checks passed")
    else:
        print("❌ main.html not found")
    
    # Test CSS file
    print("\n🎨 Testing styles.css...")
    
    if os.path.exists('/app/styles.css'):
        with open('/app/styles.css', 'r', encoding='utf-8') as f:
            css_content = f.read()
        
        css_checks = [
            ("CSS variables", ':root {' in css_content),
            ("Primary color", '--primary-color: #ff1493' in css_content),
            ("Loading screen styles", '.loading-screen' in css_content),
            ("Header styles", '.main-header' in css_content),
            ("Gallery grid", '.gallery-grid' in css_content),
            ("Video grid", '.video-grid' in css_content),
            ("Pricing cards", '.pricing-cards' in css_content),
            ("Banner rotation", '.banner-rotation' in css_content),
            ("Lightbox styles", '.lightbox' in css_content),
            ("Responsive design", '@media' in css_content),
            ("Animations", '@keyframes' in css_content),
            ("Palm animation", '.palm' in css_content and 'animation:' in css_content)
        ]
        
        passed = 0
        for check_name, result in css_checks:
            if result:
                print(f"✅ {check_name}")
                passed += 1
            else:
                print(f"❌ {check_name}")
        
        print(f"📊 Styles.css: {passed}/{len(css_checks)} checks passed")
        print(f"📏 CSS file size: {len(css_content)} characters")
    else:
        print("❌ styles.css not found")
    
    # Test JavaScript files
    print("\n📜 Testing JavaScript files...")
    
    js_files = [
        'main-script.js',
        'content-data-integration.js',
        'content-data1.js',
        'content-data2.js',
        'content-data3.js',
        'content-data4.js',
        'content-data5.js',
        'content-data6.js'
    ]
    
    js_passed = 0
    for js_file in js_files:
        if os.path.exists(f'/app/{js_file}'):
            with open(f'/app/{js_file}', 'r', encoding='utf-8') as f:
                js_content = f.read()
            
            # Basic checks for each file
            if js_file == 'main-script.js':
                has_functions = all(func in js_content for func in [
                    'initializeApp', 'setupNavigation', 'loadGalleryContent', 'openLightbox'
                ])
            elif 'content-data' in js_file:
                has_functions = 'console.log' in js_content and ('Manager' in js_content or 'Utils' in js_content)
            else:
                has_functions = len(js_content) > 100
            
            if has_functions:
                print(f"✅ {js_file} ({len(js_content)} chars)")
                js_passed += 1
            else:
                print(f"❌ {js_file} (invalid or empty)")
        else:
            print(f"❌ {js_file} (not found)")
    
    print(f"📊 JavaScript files: {js_passed}/{len(js_files)} files valid")
    
    # Test content directories
    print("\n📁 Testing Content Directories...")
    
    directories = ['full', 'uncensored', 'uncensored-videos']
    dir_stats = {}
    
    for directory in directories:
        if os.path.exists(f'/app/{directory}'):
            files = os.listdir(f'/app/{directory}')
            image_files = [f for f in files if f.endswith(('.webp', '.jpg', '.jpeg', '.png', '.mp4'))]
            dir_stats[directory] = len(image_files)
            print(f"✅ {directory}: {len(image_files)} files")
        else:
            dir_stats[directory] = 0
            print(f"❌ {directory}: not found")
    
    print(f"📊 Content files: {sum(dir_stats.values())} total files")
    
    # Summary
    print("\n" + "="*60)
    print("📋 SUMMARY")
    print("="*60)
    
    total_checks = 0
    total_passed = 0
    
    if os.path.exists('/app/index.html'):
        total_checks += 10
        # Recount index checks
        with open('/app/index.html', 'r', encoding='utf-8') as f:
            content = f.read()
        soup = BeautifulSoup(content, 'html.parser')
        index_passed = sum([
            soup.find('title') and 'IbizaGirl.pics' in soup.find('title').text,
            soup.find('h1') and 'IbizaGirl.pics' in soup.find('h1').text,
            'ENTER PARADISE' in content,
            'window.location.href = \'/main.html\'' in content,
            'Adults Only (18+)' in content,
            'Premium Paradise Gallery' in content,
            '🌴' in content,
            soup.find('style') is not None,
            soup.find('meta', attrs={'name': 'description'}) is not None,
            soup.find('meta', attrs={'property': 'og:title'}) is not None
        ])
        total_passed += index_passed
    
    if os.path.exists('/app/main.html'):
        total_checks += 20
        # Recount main checks
        with open('/app/main.html', 'r', encoding='utf-8') as f:
            content = f.read()
        soup = BeautifulSoup(content, 'html.parser')
        main_passed = sum([
            soup.find('title') and 'IbizaGirl.pics' in soup.find('title').text,
            soup.find('header', class_='main-header') is not None,
            soup.find('h1', class_='site-title') is not None,
            len(soup.find_all('button', class_='nav-btn')) >= 3,
            soup.find('div', id='galleryView') is not None,
            soup.find('div', id='videosView') is not None,
            soup.find('div', id='pricingView') is not None,
            soup.find('div', id='bannerRotation') is not None,
            soup.find('div', id='main-gallery') is not None,
            soup.find('div', id='video-gallery') is not None,
            soup.find('div', class_='pricing-cards') is not None,
            'paypal.com/sdk/js' in content,
            'jads.co/js/jads.js' in content,
            soup.find('div', id='lightbox') is not None,
            soup.find('footer', class_='main-footer') is not None,
            '€9.99' in content,
            '€49.99' in content,
            'paypal.Buttons' in content,
            soup.find('link', href='styles.css') is not None,
            soup.find('script', src='main-script.js') is not None
        ])
        total_passed += main_passed
    
    success_rate = (total_passed / total_checks * 100) if total_checks > 0 else 0
    
    print(f"✅ Structure Tests Passed: {total_passed}/{total_checks}")
    print(f"📈 Success Rate: {success_rate:.1f}%")
    print(f"📁 Content Files: {sum(dir_stats.values())}")
    print(f"📜 JavaScript Files: {js_passed}/{len(js_files)}")
    
    if success_rate >= 90:
        print("🎉 HTML structure is excellent!")
    elif success_rate >= 75:
        print("✅ HTML structure is good!")
    elif success_rate >= 50:
        print("⚠️ HTML structure has some issues")
    else:
        print("❌ HTML structure has major issues")
    
    return success_rate >= 75

if __name__ == "__main__":
    test_html_structure()