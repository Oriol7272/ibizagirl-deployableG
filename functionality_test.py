#!/usr/bin/env python3
"""
Functionality Test for IbizaGirl.pics
Tests JavaScript functionality and integration
"""

import os
import re
import json

def test_javascript_functionality():
    """Test JavaScript functionality and configuration"""
    
    print("🔧 Testing IbizaGirl.pics JavaScript Functionality...")
    
    # Test main-script.js
    print("\n📜 Testing main-script.js...")
    
    with open('/app/main-script.js', 'r', encoding='utf-8') as f:
        main_script = f.read()
    
    main_functions = [
        'initializeApp',
        'setupNavigation', 
        'switchView',
        'setupBannerRotation',
        'loadGalleryContent',
        'loadVideoContent',
        'openLightbox',
        'closeLightbox',
        'handleGalleryClick',
        'handleVideoClick',
        'checkVIPAccess',
        'showPremiumModal'
    ]
    
    found_functions = 0
    for func in main_functions:
        if f'function {func}' in main_script or f'{func}(' in main_script:
            print(f"✅ {func}")
            found_functions += 1
        else:
            print(f"❌ {func}")
    
    print(f"📊 Main script functions: {found_functions}/{len(main_functions)}")
    
    # Test content-data1.js (Configuration)
    print("\n⚙️ Testing content-data1.js (Configuration)...")
    
    with open('/app/content-data1.js', 'r', encoding='utf-8') as f:
        config_script = f.read()
    
    config_checks = [
        ('ContentConfig', 'const ContentConfig' in config_script),
        ('PayPal Client ID', 'AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5' in config_script),
        ('EUR Currency', 'currency: \'EUR\'' in config_script),
        ('Pricing Configuration', 'pricing:' in config_script and 'monthly: 9.99' in config_script),
        ('TimeUtils', 'const TimeUtils' in config_script),
        ('ArrayUtils', 'const ArrayUtils' in config_script),
        ('EventManager', 'class EventManager' in config_script),
        ('StorageManager', 'class StorageManager' in config_script),
        ('FeatureDetector', 'const FeatureDetector' in config_script)
    ]
    
    config_passed = 0
    for check_name, result in config_checks:
        if result:
            print(f"✅ {check_name}")
            config_passed += 1
        else:
            print(f"❌ {check_name}")
    
    print(f"📊 Configuration: {config_passed}/{len(config_checks)}")
    
    # Test content managers
    print("\n📦 Testing Content Managers...")
    
    content_files = {
        'content-data2.js': 'PublicContentManager',
        'content-data3.js': 'PremiumContentPart1', 
        'content-data4.js': 'PremiumContentPart2',
        'content-data5.js': 'VideoContentManager',
        'content-data-integration.js': 'VideoContentManager'
    }
    
    manager_passed = 0
    for file_name, manager_name in content_files.items():
        if os.path.exists(f'/app/{file_name}'):
            with open(f'/app/{file_name}', 'r', encoding='utf-8') as f:
                content = f.read()
            
            if manager_name in content and 'class' in content:
                print(f"✅ {manager_name} in {file_name}")
                manager_passed += 1
            else:
                print(f"❌ {manager_name} in {file_name}")
        else:
            print(f"❌ {file_name} not found")
    
    print(f"📊 Content managers: {manager_passed}/{len(content_files)}")
    
    # Test PayPal integration
    print("\n💳 Testing PayPal Integration...")
    
    with open('/app/main.html', 'r', encoding='utf-8') as f:
        main_html = f.read()
    
    paypal_checks = [
        ('PayPal SDK Script', 'paypal.com/sdk/js' in main_html),
        ('Client ID', 'AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5' in main_html),
        ('EUR Currency', 'currency=EUR' in main_html),
        ('PayPal Buttons', 'paypal.Buttons' in main_html),
        ('Payment Success Handler', 'handlePaymentSuccess' in main_html),
        ('PPV Button Container', 'paypal-ppv-button' in main_html),
        ('Monthly Button Container', 'paypal-monthly-button' in main_html),
        ('Lifetime Button Container', 'paypal-lifetime-button' in main_html),
        ('Price Configuration', 'PAYPAL_CONFIG' in main_html)
    ]
    
    paypal_passed = 0
    for check_name, result in paypal_checks:
        if result:
            print(f"✅ {check_name}")
            paypal_passed += 1
        else:
            print(f"❌ {check_name}")
    
    print(f"📊 PayPal integration: {paypal_passed}/{len(paypal_checks)}")
    
    # Test JuicyAds integration
    print("\n📢 Testing JuicyAds Integration...")
    
    juicy_checks = [
        ('JuicyAds Script', 'jads.co/js/jads.js' in main_html),
        ('Ad Calls', main_html.count('jads(') >= 3),
        ('Site Verification', 'juicyads-site-verification' in main_html),
        ('Ad Containers', main_html.count('ad-container') >= 3),
        ('Mobile Ad', '2092250' in main_html),
        ('Square Ad', '2092251' in main_html),
        ('Bottom Ad', '2092471' in main_html)
    ]
    
    juicy_passed = 0
    for check_name, result in juicy_checks:
        if result:
            print(f"✅ {check_name}")
            juicy_passed += 1
        else:
            print(f"❌ {check_name}")
    
    print(f"📊 JuicyAds integration: {juicy_passed}/{len(juicy_checks)}")
    
    # Test responsive design
    print("\n📱 Testing Responsive Design...")
    
    with open('/app/styles.css', 'r', encoding='utf-8') as f:
        css_content = f.read()
    
    responsive_checks = [
        ('Viewport Meta Tag', 'viewport' in main_html),
        ('Mobile Media Queries', '@media (max-width: 768px)' in css_content),
        ('Small Screen Queries', '@media (max-width: 480px)' in css_content),
        ('Flexible Grid', 'grid-template-columns: repeat(auto-fit' in css_content),
        ('Mobile Navigation', 'flex-direction: column' in css_content),
        ('Responsive Images', 'width: 100%' in css_content and 'object-fit: cover' in css_content)
    ]
    
    responsive_passed = 0
    for check_name, result in responsive_checks:
        if result:
            print(f"✅ {check_name}")
            responsive_passed += 1
        else:
            print(f"❌ {check_name}")
    
    print(f"📊 Responsive design: {responsive_passed}/{len(responsive_checks)}")
    
    # Test SEO optimization
    print("\n🔍 Testing SEO Optimization...")
    
    with open('/app/index.html', 'r', encoding='utf-8') as f:
        index_html = f.read()
    
    seo_checks = [
        ('Title Tags', '<title>' in index_html and '<title>' in main_html),
        ('Meta Descriptions', 'name="description"' in index_html and 'name="description"' in main_html),
        ('Meta Keywords', 'name="keywords"' in index_html and 'name="keywords"' in main_html),
        ('Open Graph Tags', 'property="og:' in index_html and 'property="og:' in main_html),
        ('Twitter Cards', 'name="twitter:' in index_html and 'name="twitter:' in main_html),
        ('Canonical URLs', 'rel="canonical"' in index_html),
        ('Structured Data', 'application/ld+json' in main_html or 'schema.org' in main_html),
        ('Alt Attributes', 'alt=' in main_html)
    ]
    
    seo_passed = 0
    for check_name, result in seo_checks:
        if result:
            print(f"✅ {check_name}")
            seo_passed += 1
        else:
            print(f"❌ {check_name}")
    
    print(f"📊 SEO optimization: {seo_passed}/{len(seo_checks)}")
    
    # Test content statistics
    print("\n📊 Testing Content Statistics...")
    
    # Count actual content files
    full_dir = '/app/full'
    uncensored_dir = '/app/uncensored'
    videos_dir = '/app/uncensored-videos'
    
    stats = {}
    
    if os.path.exists(full_dir):
        full_files = [f for f in os.listdir(full_dir) if f.endswith(('.webp', '.jpg', '.jpeg', '.png'))]
        stats['free_images'] = len(full_files)
        print(f"📸 Free images: {len(full_files)}")
    
    if os.path.exists(uncensored_dir):
        uncensored_files = [f for f in os.listdir(uncensored_dir) if f.endswith(('.webp', '.jpg', '.jpeg', '.png'))]
        stats['premium_images'] = len(uncensored_files)
        print(f"💎 Premium images: {len(uncensored_files)}")
    
    if os.path.exists(videos_dir):
        video_files = [f for f in os.listdir(videos_dir) if f.endswith(('.mp4', '.webm', '.mov'))]
        stats['videos'] = len(video_files)
        print(f"🎬 Videos: {len(video_files)}")
    
    total_content = sum(stats.values())
    print(f"📁 Total content files: {total_content}")
    
    # Summary
    print("\n" + "="*60)
    print("📋 FUNCTIONALITY TEST SUMMARY")
    print("="*60)
    
    total_tests = (len(main_functions) + len(config_checks) + len(content_files) + 
                  len(paypal_checks) + len(juicy_checks) + len(responsive_checks) + len(seo_checks))
    
    total_passed = (found_functions + config_passed + manager_passed + 
                   paypal_passed + juicy_passed + responsive_passed + seo_passed)
    
    success_rate = (total_passed / total_tests * 100) if total_tests > 0 else 0
    
    print(f"✅ Functionality Tests Passed: {total_passed}/{total_tests}")
    print(f"📈 Success Rate: {success_rate:.1f}%")
    print(f"📁 Content Files: {total_content}")
    
    # Individual scores
    print(f"\n📊 Detailed Scores:")
    print(f"   🔧 Main Functions: {found_functions}/{len(main_functions)} ({found_functions/len(main_functions)*100:.1f}%)")
    print(f"   ⚙️ Configuration: {config_passed}/{len(config_checks)} ({config_passed/len(config_checks)*100:.1f}%)")
    print(f"   📦 Content Managers: {manager_passed}/{len(content_files)} ({manager_passed/len(content_files)*100:.1f}%)")
    print(f"   💳 PayPal Integration: {paypal_passed}/{len(paypal_checks)} ({paypal_passed/len(paypal_checks)*100:.1f}%)")
    print(f"   📢 JuicyAds Integration: {juicy_passed}/{len(juicy_checks)} ({juicy_passed/len(juicy_checks)*100:.1f}%)")
    print(f"   📱 Responsive Design: {responsive_passed}/{len(responsive_checks)} ({responsive_passed/len(responsive_checks)*100:.1f}%)")
    print(f"   🔍 SEO Optimization: {seo_passed}/{len(seo_checks)} ({seo_passed/len(seo_checks)*100:.1f}%)")
    
    if success_rate >= 90:
        print("\n🎉 Functionality is excellent!")
        status = "EXCELLENT"
    elif success_rate >= 75:
        print("\n✅ Functionality is good!")
        status = "GOOD"
    elif success_rate >= 50:
        print("\n⚠️ Functionality has some issues")
        status = "NEEDS_IMPROVEMENT"
    else:
        print("\n❌ Functionality has major issues")
        status = "POOR"
    
    return {
        'success_rate': success_rate,
        'total_passed': total_passed,
        'total_tests': total_tests,
        'content_files': total_content,
        'status': status,
        'details': {
            'main_functions': f"{found_functions}/{len(main_functions)}",
            'configuration': f"{config_passed}/{len(config_checks)}",
            'content_managers': f"{manager_passed}/{len(content_files)}",
            'paypal': f"{paypal_passed}/{len(paypal_checks)}",
            'juicyads': f"{juicy_passed}/{len(juicy_checks)}",
            'responsive': f"{responsive_passed}/{len(responsive_checks)}",
            'seo': f"{seo_passed}/{len(seo_checks)}"
        }
    }

if __name__ == "__main__":
    result = test_javascript_functionality()
    print(f"\nTest completed with status: {result['status']}")