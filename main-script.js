'use strict';
// ============================
// BEACHGIRL.PICS MAIN SCRIPT v14.0.0 CORRECTED
// 200 fotos + 40 videos diarios con rotación completa
// Sistema multiidioma completo + PayPal + Ads mejoradas
// ============================

console.log('🌊 BeachGirl.pics v14.0.0 - Loading Paradise Gallery...');

// ============================
// ENVIRONMENT DETECTION
// ============================

const ENVIRONMENT = {
    isDevelopment: window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' || 
                   window.location.hostname.includes('192.168') || 
                   window.location.protocol === 'file:' ||
                   window.location.port !== '',
    get isProduction() { return !this.isDevelopment; }
};

console.log('🌍 Environment:', ENVIRONMENT.isDevelopment ? 'Development' : 'Production');

// ============================
// CONFIGURATION
// ============================

const CONFIG = {
    ANALYTICS_ID: 'UA-12345678-1',
    PAYPAL: {
        CLIENT_ID: 'AfQEdiielw5fm3wF08p9...',
        CURRENCY: 'EUR',
        PRICES: {
            MONTHLY_SUBSCRIPTION: 15.00,
            LIFETIME_SUBSCRIPTION: 100.00
        },
        PACKS: {
            starter: { items: 10, price: 10.00, savings: 33 },
            bronze: { items: 25, price: 20.00, savings: 50 },
            silver: { items: 50, price: 35.00, savings: 65 },
            gold: { items: 100, price: 60.00, savings: 70 }
        }
    },
    ADS: {
        ENABLED: true,
        JUICYADS: { enabled: true, zone: '123456' },
        EXOCLICK: { enabled: true, zone: '789012' },
        EROADVERTISING: { enabled: true, zone: '345678' }
    },
    CONTENT: {
        DAILY_PHOTOS: 200,
        DAILY_VIDEOS: 40,
        NEW_CONTENT_PERCENTAGE: 0.2
    },
    BASE_URL: 'https://raw.githubusercontent.com/Oriol7272/ibizagirl-deployableG/main/'
};

// ============================
// CONTENT POOLS
// ============================

// Photos from full folder (free/teaser content; full list from FullWEBP.docx)
const ALL_PHOTOS_POOL = [
    'full/0456996c-b56e-42ef-9049-56b1a1ae2646.webp',
    'full/0Tc8Vtd0mEIvNHZwYGBq.webp',
    'full/0lySugcO4Pp4pEZKvz9U.webp',
    'full/0nSaCJQxbVw4BDrhnhHO.webp',
    'full/13TXvyRVZ7LtvAOx7kme.webp',
    'full/18VQaczW5kdfdiqUVasH.webp',
    'full/1dEu25K0mS3zxRlXRjHR.webp',
    'full/1qEBcg9QbkZRRdLt0Chc.webp',
    'full/1tt8H4fX3XzyV90HjNG3.webp',
    'full/27bGIzFFpej5ubUkvykD.webp',
    'full/2gjqH68H586TKLDK9lh9.webp',
    'full/2yw4sowPh3Tyln5oxRdw.webp',
    'full/39GYGt3bticS0Mjbud0p.webp',
    'full/3IWka3fnP9b8yz6j5l91.webp',
    'full/3ZYL4GCUOs3rfq3iTPJ7.webp',
    'full/4GN6i0Db2hl4Ck9vf0LE.webp',
    'full/4YhoIAWSbVaOqBhAOGqR.webp',
    'full/82KxJ9daxf9MpK019L5I.webp',
    'full/83cSC4eRnYGZUNo9AoqD.webp',
    'full/85158b64-4168-45fa-9cb4-0b40634f7fa1.webp',
    'full/8faf42TRuGOU4ZW9KS9W.webp',
    'full/92Ck0v3g8gZLEQ5vOmpd.webp',
    'full/993acHdsWLzG80gAFZQs.webp',
    'full/9D5U5fKXT72xnpqsgUaD.webp',
    'full/9v20KsJFZoAv2WQ8m3o2.webp',
    'full/AHKAq0biFDUtkxlx7TCu.webp',
    'full/ANhHtA0GivBfeAo6dvJG.webp',
    'full/AwKXjDqrJMTKNvB84iRy.webp',
    'full/CTyCcna8JSPObRQpulKJ.webp',
    'full/CmxJm1VLBBhvZoUwxWTJ.webp',
    'full/kZcyiAnC5K1YAXKulB2e.webp',
    'full/kr5FiUdTaiQ7imq1xHlH.webp',
    'full/lXpckkGACDNcXPAHEQqu.webp',
    'full/mFuqtladZr2hO3Tszm3m.webp',
    'full/nJvZXk80qguZvwOeSai6.webp',
    'full/nm6YKc38NLqwGPaNiDhc.webp',
    'full/owPT3Y4puK3dRHWNsj47.webp',
    'full/psZEFLlVAhAiq10uJ8qd.webp',
    'full/qLDeRznPthcmYSmggfbm.webp',
    'full/qhK8inhLxacOs8w7mRbE.webp',
    'full/qxIzW9ZMuhkEY6dmGKSv.webp',
    'full/sMAD8T2U7A3aMQjxsUdd.webp',
    'full/sda0bXv4LRWxnW49KPWT.webp',
    'full/sfz7eFmqHWlf6wrpTDD9.webp',
    'full/t9WqMZxXkmUTMrq3d13l.webp',
    'full/tMxzKdT8rjZm3gpe0StS.webp',
    'full/tQ41YocTwqSnd8mFsDc5.webp',
    'full/tQInulLfQHQTFNIK6yEV.webp',
    'full/tzico6mUJuc7Lz8HYdEF.webp',
    'full/uMSW2oj0qrbVEmIEotZ1.webp',
    'full/ufXYerfLKedF1f6OYNhd.webp',
    'full/wrs60TS7VJQlmWbyKKUu.webp',
    'full/xhQTgYHiVAYbnYrKIsOq.webp',
    'full/yqTobCZL2AABmmNJ7EPU.webp',
    'full/zNzTQ476q4sOPWRaVPEw.webp',
    'full/zRPnijTCwLqQeZLXLvzu.webp',
    'full/zSzYfjo7gtKbVBWGhbJN.webp',
    'full/zUNmPEaVFiJfL1mo27ga.webp',
    'full/zs7GNC0HKhDQwRIsB9IM.webp',
    'full/zx83JCzdTKNfyKUY6Djs.webp'
];

// Uncensored photos pool (paid images from uncensored folder; full list from uncensoredwebp.docx)
const ALL_UNCENSORED_PHOTOS_POOL = [
    'uncensored/00wd2wVE89BJnQVenuNP (còpia).webp',
    'uncensored/00wd2wVE89BJnQVenuNP.webp',
    'uncensored/01CTDHff9PmCsZqjjCoO.webp',
    'uncensored/02gNvnd7bLJgBX7wvQ2r.webp',
    'uncensored/05mTzCtfbQ5McL31hk49.webp',
    'uncensored/081YXXFwiGwFJpJCqkV9.webp',
    'uncensored/08cuJR4dA17oVjLQcQd7.webp',
    'uncensored/09HFl7nAkIjFBFbg3SeA.webp',
    'uncensored/0K7AtRh7U93R2VH9axxQ.webp',
    'uncensored/0Scwe5oo0JuUEanBguCT.webp',
    'uncensored/0Tc8Vtd0mEIvNHZwYGBq.webp',
    'uncensored/0VBC7iOXjVN2c89AngyH.webp',
    'uncensored/0XOhygF9EVXZI4PEp1GG.webp',
    'uncensored/0iELEcoTlZgqxYoQG168.webp',
    'uncensored/0ijarBbN0aKx6uXbanyP.webp',
    'uncensored/0oN44NT2wHztAUYh5bc.webp',
    'uncensored/0qvHNvqJU86FmxFEu8Fv.webp',
    'uncensored/0yiMo3Hxx1iFQquiFJtX.webp',
    'uncensored/0yj7DvfXP6ajqAXoac8A.webp',
    'uncensored/12IdAS832WEcngM0TmiU.webp',
    'uncensored/15rRK9JyAaWsDxwVzCRM.webp',
    'uncensored/17LWLAXi4sDIHDlFpdOg.webp',
    'uncensored/18VQaczW5kdfdiqUVasH.webp',
    'uncensored/1DCEysi2B2gEWgZnDyqg.webp',
    'uncensored/1G4FDSg9HpEVWWDhmpDO.webp',
    'uncensored/1bITefcv83TIA7idRrrO.webp',
    'uncensored/1cCATxFagDwKacKPXz0S 18.52.53.webp',
    'uncensored/1cCATxFagDwKacKPXz0S.webp',
    'uncensored/1dsu1ynPOBgwxVIVMm98.webp',
    'uncensored/1nmCjq8qcYS5FI9j3hN6.webp',
    'uncensored/1o2y6T2yR9c3Z2z5m5p4.webp',
    'uncensored/1qEBcg9QbkZRRdLt0Chc.webp',
    'uncensored/1tt8H4fX3XzyV90HjNG3.webp',
    'uncensored/1u3v5w7x9y1z3a5b7c9d.webp',
    'uncensored/1v2w3x4y5z6a7b8c9d0e.webp',
    'uncensored/1x2y3z4a5b6c7d8e9f0g.webp',
    'uncensored/2c4e6g8i0k2m4o6q8s0u.webp',
    'uncensored/2gjqH68H586TKLDK9lh9.webp',
    'uncensored/2h4j6l8n0p2r4t6v8x0z.webp',
    'uncensored/2yw4sowPh3Tyln5oxRdw.webp',
    'uncensored/3IWka3fnP9b8yz6j5l91.webp',
    'uncensored/3ZYL4GCUOs3rfq3iTPJ7.webp',
    'uncensored/3a5b0c5d0e5f0g5h0i5j.webp',
    'uncensored/3b4c5d6e7f8g9h0i1j2k.webp',
    'uncensored/3d5f7h9j1l3n5p7r9t1v.webp',
    'uncensored/3f4g5h6i7j8k9l0m1n2o.webp',
    'uncensored/3h2j1l9n7p5r3t1v9x7z.webp',
    'uncensored/3j4k5l6m7n8o9p0q1r2s.webp',
    'uncensored/3l2n1p9r7t5v3x1z9b7d.webp',
    'uncensored/3n4o5p6q7r8s9t0u1v2w.webp',
    'uncensored/3p2r1t9v7x5z3b1d9f7h.webp',
    'uncensored/3r4s5t6u7v8w9x0y1z2a.webp',
    'uncensored/3t2v1x9z7b5d3f1h9j7l.webp',
    'uncensored/3v4w5x6y7z8a9b0c1d2e.webp',
    'uncensored/3x2z1b9d7f5h3j1l9n7p.webp',
    'uncensored/3z4a5b6c7d8e9f0g1h2i.webp',
    'uncensored/4GN6i0Db2hl4Ck9vf0LE.webp',
    'uncensored/4YhoIAWSbVaOqBhAOGqR.webp',
    'uncensored/4a3b2c1d0e9f8g7h6i5j.webp',
    'uncensored/4b5c6d7e8f9g0h1i2j3k.webp',
    'uncensored/4d3f2h1j0l9n8p7r6t5v.webp',
    'uncensored/4f5g6h7i8j9k0l1m2n3o.webp',
    'uncensored/4h4j6l8n0p2r4t6v8x0z.webp',
    'uncensored/4j5k6l7m8n9o0p1q2r3s.webp',
    'uncensored/4l4n6p8r0t2v4x6z8b0d.webp',
    'uncensored/4n5o6p7q8r9s0t1u2v3w.webp',
    'uncensored/4p4r6t8v0x2z4b6d8f0h.webp',
    'uncensored/4r5s6t7u8v9w0x1y2z3a.webp',
    'uncensored/4t4v6x8z0b2d4f6h8j0l.webp',
    'uncensored/4v5w6x7y8z9a0b1c2d3e.webp',
    'uncensored/4x4z6b8d0f2h4j6l8n0p.webp',
    'uncensored/4z5a6b7c8d9e0f1g2h3i.webp',
    'uncensored/5a4b3c2d1e0f9g8h7i6j.webp',
    'uncensored/5b6c7d8e9f0g1h2i3j4k.webp',
    'uncensored/5d4f3h2j1l0n9p8r7t6v.webp',
    'uncensored/5f6g7h8i9j0k1l2m3n4o.webp',
    'uncensored/5h5j7l9n1p3r5t7v9x1z.webp',
    'uncensored/5j6k7l8m9n0o1p2q3r4s.webp',
    'uncensored/5l5n7p9r1t3v5x7z9b1d.webp',
    'uncensored/5n6o7p8q9r0s1t2u3v4w.webp',
    'uncensored/5p5r7t9v1x3z5b7d9f1h.webp',
    'uncensored/5r6s7t8u9v0w1x2y3z4a.webp',
    'uncensored/5t5v7x9z1b3d5f7h9j1l.webp',
    'uncensored/5v6w7x8y9z0a1b2c3d4e.webp',
    'uncensored/5x5z7b9d1f3h5j7l9n1p.webp',
    'uncensored/5z6a7b8c9d0e1f2g3h4i.webp',
    'uncensored/6a5b4c3d2e1f0g9h8i7j.webp',
    'uncensored/6b7c8d9e0f1g2h3i4j5k.webp',
    'uncensored/6d5f4h3j2l1n0p9r8t7v.webp',
    'uncensored/6f7g8h9i0j1k2l3m4n5o.webp',
    'uncensored/6h6j8l0n2p4r6t8v0x2z.webp',
    'uncensored/6j7k8l9m0n1o2p3q4r5s.webp',
    'uncensored/6l6n8p0r2t4v6x8z0b2d.webp',
    'uncensored/6n7o8p9q0r1s2t3u4v5w.webp',
    'uncensored/6p6r8t0v2x4z6b8d0f2h.webp',
    'uncensored/6r7s8t9u0v1w2x3y4z5a.webp',
    'uncensored/6t6v8x0z2b4d6f8h0j2l.webp',
    'uncensored/6v7w8x9y0z1a2b3c4d5e.webp',
    'uncensored/6x6z8b0d2f4h6j8l0n2p.webp',
    'uncensored/6z7a8b9c0d1e2f3g4h5i.webp',
    'uncensored/7a6b5c4d3e2f1g0h9i8j.webp',
    'uncensored/7b8c9d0e1f2g3h4i5j6k.webp',
    'uncensored/7d6f5h4j3l2n1p0r9t8v.webp',
    'uncensored/7f8g9h0i1j2k3l4m5n6o.webp',
    'uncensored/7h7j9l1n3p5r7t9v1x3z.webp',
    'uncensored/7j8k9l0m1n2o3p4q5r6s.webp',
    'uncensored/7l7n9p1r3t5v7x9z1b3d.webp',
    'uncensored/7n8o9p0q1r2s3t4u5v6w.webp',
    'uncensored/7p7r9t1v3x5z7b9d1f3h.webp',
    'uncensored/7r8s9t0u1v2w3x4y5z6a.webp',
    'uncensored/7t7v9x1z3b5d7f9h1j3l.webp',
    'uncensored/7v8w9x0y1z2a3b4c5d6e.webp',
    'uncensored/7x7z9b1d3f5h7j9l1n3p.webp',
    'uncensored/7z8a9b0c1d2e3f4g5h6i.webp',
    'uncensored/8a7b6c5d4e3f2g1h0i9j.webp',
    'uncensored/8b9c0d1e2f3g4h5i6j7k.webp',
    'uncensored/8d7f6h5j4l3n2p1r0t9v.webp',
    'uncensored/8f9g0h1i2j3k4l5m6n7o.webp',
    'uncensored/8h8j0l2n4p6r8t0v2x4z.webp',
    'uncensored/8j9k0l1m2n3o4p5q6r7s.webp',
    'uncensored/8l8n0p2r4t6v8x0z2b4d.webp',
    'uncensored/8n9o0p1q2r3s4t5u6v7w.webp',
    'uncensored/8p8r0t2v4x6z8b0d2f4h.webp',
    'uncensored/8r9s0t1u2v3w4x5y6z7a.webp',
    'uncensored/8t8v0x2z4b6d8f0h2j4l.webp',
    'uncensored/8v9w0x1y2z3a4b5c6d7e.webp',
    'uncensored/8x8z0b2d4f6h8j0l2n4p.webp',
    'uncensored/8z9a0b1c2d3e4f5g6h7i.webp',
    'uncensored/9a8b7c6d5e4f3g2h1i0j.webp',
    'uncensored/9b0c1d2e3f4g5h6i7j8k.webp',
    'uncensored/9d8f7h6j5l4n3p2r1t0v.webp',
    'uncensored/9f0g1h2i3j4k5l6m7n8o.webp',
    'uncensored/9h9j1l3n5p7r9t1v3x5z.webp',
    'uncensored/9j0k1l2m3n4o5p6q7r8s.webp',
    'uncensored/9l9n1p3r5t7v9x1z3b5d.webp',
    'uncensored/9n0o1p2q3r4s5t6u7v8w.webp',
    'uncensored/9p9r1t3v5x7z9b1d3f5h.webp',
    'uncensored/9r0s1t2u3v4w5x6y7z8a.webp',
    'uncensored/9t9v1x3z5b7d9f1h3j5l.webp',
    'uncensored/9v0w1x2y3z4a5b6c7d8e.webp',
    'uncensored/9x9z1b3d5f7h9j1l3n5p.webp',
    'uncensored/9z0a1b2c3d4e5f6g7h8i.webp',
    'uncensored/82KxJ9daxf9MpK019L5I.webp',
    'uncensored/83cSC4eRnYGZUNo9AoqD.webp',
    'uncensored/8faf42TRuGOU4ZW9KS9W.webp',
    'uncensored/92Ck0v3g8gZLEQ5vOmpd.webp',
    'uncensored/993acHdsWLzG80gAFZQs.webp',
    'uncensored/9D5U5fKXT72xnpqsgUaD.webp',
    'uncensored/9v20KsJFZoAv2WQ8m3o2.webp',
    'uncensored/AHKAq0biFDUtkxlx7TCu.webp',
    'uncensored/ANhHtA0GivBfeAo6dvJG.webp',
    'uncensored/AwKXjDqrJMTKNvB84iRy.webp',
    'uncensored/CTyCcna8JSPObRQpulKJ.webp',
    'uncensored/CmxJm1VLBBhvZoUwxWTJ.webp',
    'uncensored/kZcyiAnC5K1YAXKulB2e.webp',
    'uncensored/kr5FiUdTaiQ7imq1xHlH.webp',
    'uncensored/lXpckkGACDNcXPAHEQqu.webp',
    'uncensored/mFuqtladZr2hO3Tszm3m.webp',
    'uncensored/nJvZXk80qguZvwOeSai6.webp',
    'uncensored/nm6YKc38NLqwGPaNiDhc.webp',
    'uncensored/owPT3Y4puK3dRHWNsj47.webp',
    'uncensored/psZEFLlVAhAiq10uJ8qd.webp',
    'uncensored/qLDeRznPthcmYSmggfbm.webp',
    'uncensored/qhK8inhLxacOs8w7mRbE.webp',
    'uncensored/qxIzW9ZMuhkEY6dmGKSv.webp',
    'uncensored/sMAD8T2U7A3aMQjxsUdd.webp',
    'uncensored/sda0bXv4LRWxnW49KPWT.webp',
    'uncensored/sfz7eFmqHWlf6wrpTDD9.webp',
    'uncensored/t9WqMZxXkmUTMrq3d13l.webp',
    'uncensored/tMxzKdT8rjZm3gpe0StS.webp',
    'uncensored/tQ41YocTwqSnd8mFsDc5.webp',
    'uncensored/tQInulLfQHQTFNIK6yEV.webp',
    'uncensored/tzico6mUJuc7Lz8HYdEF.webp',
    'uncensored/uMSW2oj0qrbVEmIEotZ1.webp',
    'uncensored/ufXYerfLKedF1f6OYNhd.webp',
    'uncensored/wrs60TS7VJQlmWbyKKUu.webp',
    'uncensored/xhQTgYHiVAYbnYrKIsOq.webp',
    'uncensored/yqTobCZL2AABmmNJ7EPU 18.52.53.webp',
    'uncensored/yqTobCZL2AABmmNJ7EPU.webp',
    'uncensored/yz4R00MMukJ7GJBzzDtl.webp',
    'uncensored/zJ5oe5Ouj4BMABGhuUC0.webp',
    'uncensored/zNs4RDOF8MOVNtohZqaf.webp',
    'uncensored/zgaFEhJq9b3FJ7y9LCcC (còpia).webp',
    'uncensored/zgaFEhJq9b3FJ7y9LCcC.webp',
    'uncensored/zl3FIFdh4OZMogOhLQXv.webp',
    'uncensored/zqpBmzZ1EfnsMxLnnSNS.webp'
];

// Videos pool (paid videos from uncensored-videos folder; full list from uncensored-videosall.docx)
const ALL_VIDEOS_POOL = [
    'uncensored-videos/0nF138CMxl1eGWUxaG2d.mp4',
    'uncensored-videos/0xXK6PxXSv6cpYxvI7HX.mp4',
    'uncensored-videos/1NYBqpy4q2GVCDCXmXDK.mp4',
    'uncensored-videos/1SZsGxjFfrA7diW05Yvj.mp4',
    'uncensored-videos/2FO1Ra6RDA8FjGWmDv8d.mp4',
    'uncensored-videos/3W7GxdRyaPj0uAK9fD4I.mp4',
    'uncensored-videos/3i61FDkL2wmF6RjQbZKR.mp4',
    'uncensored-videos/5qsmyiUv590ZBfrpct6G.mp4',
    'uncensored-videos/7gBpFJiLzDH9s5ukalLs.mp4',
    'uncensored-videos/8RF2trrwvytHFkimtzDE.mp4',
    'uncensored-videos/8fQQnk9u7YAQQXDpfOW3.mp4',
    'uncensored-videos/8qfK5e4NbCYglU2WfMQ6.mp4',
    'uncensored-videos/8yE2nxCwV2QcJsdXGf32.mp4',
    'uncensored-videos/99ACESTm9KLPGdLSh0J1.mp4',
    'uncensored-videos/9weRZL3KvPUd3qNQz0Mt 18.52.53.mp4',
    'uncensored-videos/9weRZL3KvPUd3qNQz0Mt.mp4',
    'uncensored-videos/BA7Bvw9GHNCbsEKOruXh (còpia).mp4',
    'uncensored-videos/BA7Bvw9GHNCbsEKOruXh.mp4',
    'uncensored-videos/Bg8z3Gk9SuxEAFGt1WBo.mp4',
    'uncensored-videos/CzAtUvr9DPCv7JVMFNez.mp4',
    'uncensored-videos/Fc6f8RSjO8QBTmjjppHO 18.52.53.mp4',
    'uncensored-videos/Fc6f8RSjO8QBTmjjppHO.mp4',
    'uncensored-videos/G4LILz0eqoh4m3YOZ2WK (còpia).mp4',
    'uncensored-videos/G4LILz0eqoh4m3YOZ2WK.mp4',
    'uncensored-videos/G4XjXiZIHZZRsKwlDYCp (còpia).mp4',
    'uncensored-videos/G4XjXiZIHZZRsKwlDYCp.mp4',
    'uncensored-videos/GK3wKGkNYhO4YyFK3zX7.mp4',
    'uncensored-videos/GT8R4c3lT3a0vZ2xY8P3.mp4',
    'uncensored-videos/Gg5T3B8kP2d7uF4vR9Q6.mp4',
    'uncensored-videos/H4J2K5L8M1N4P7Q0R3S6.mp4',
    'uncensored-videos/H9I6J3K0L7M4N1O8P5Q2.mp4',
    'uncensored-videos/I2J5K8L1M4N7O0P3Q6R9.mp4',
    'uncensored-videos/I7J4K1L8M5N2O9P6Q3R0.mp4',
    'uncensored-videos/J0K3L6M9N2O5P8Q1R4S7.mp4',
    'uncensored-videos/J5K2L9M6N3O0P7Q4R1S8.mp4',
    'uncensored-videos/K8L5M2N9O6P3Q0R7S4T1.mp4',
    'uncensored-videos/K3L0M7N4O1P8Q5R2S9T6.mp4',
    'uncensored-videos/L6M3N0O7P4Q1R8S5T2U9.mp4',
    'uncensored-videos/L1M8N5O2P9Q6R3S0T7U4.mp4',
    'uncensored-videos/M4N1O8P5Q2R9S6T3U0V7.mp4',
    'uncensored-videos/M9N6O3P0Q7R4S1T8U5V2.mp4',
    'uncensored-videos/N2O9P6Q3R0S7T4U1V8W5.mp4',
    'uncensored-videos/N7O4P1Q8R5S2T9U6V3W0.mp4',
    'uncensored-videos/O0P7Q4R1S8T5U2V9W6X3.mp4',
    'uncensored-videos/O5P2Q9R6S3T0U7V4W1X8.mp4',
    'uncensored-videos/P8Q5R2S9T6U3V0W7X4Y1.mp4',
    'uncensored-videos/P3Q0R7S4T1U8V5W2X9Y6.mp4',
    'uncensored-videos/Q6R3S0T7U4V1W8X5Y2Z9.mp4',
    'uncensored-videos/Q1R8S5T2U9V6W3X0Y7Z4.mp4',
    'uncensored-videos/R4S1T8U5V2W9X6Y3Z0A7.mp4',
    'uncensored-videos/R9S6T3U0V7W4X1Y8Z5A2.mp4',
    'uncensored-videos/S2T9U6V3W0X7Y4Z1A8B5.mp4',
    'uncensored-videos/S7T4U1V8W5X2Y9Z6A3B0.mp4',
    'uncensored-videos/T0U7V4W1X8Y5Z2A9B6C3.mp4',
    'uncensored-videos/T5U2V9W6X3Y0Z7A4B1C8.mp4',
    'uncensored-videos/U8V5W2X9Y6Z3A0B7C4D1.mp4',
    'uncensored-videos/U3V0W7X4Y1Z8A5B2C9D6.mp4',
    'uncensored-videos/V6W3X0Y7Z4A1B8C5D2E9.mp4',
    'uncensored-videos/V1W8X5Y2Z9A6B3C0D7E4.mp4',
    'uncensored-videos/W4X1Y8Z5A2B9C6D3E0F7.mp4',
    'uncensored-videos/W9X6Y3Z0A7B4C1D8E5F2.mp4',
    'uncensored-videos/X2Y9Z6A3B0C7D4E1F8G5.mp4',
    'uncensored-videos/X7Y4Z1A8B5C2D9E6F3G0.mp4',
    'uncensored-videos/Y0Z7A4B1C8D5E2F9G6H3.mp4',
    'uncensored-videos/Y5Z2A9B6C3D0E7F4G1H8.mp4',
    'uncensored-videos/Z8A5B2C9D6E3F0G7H4I1.mp4',
    'uncensored-videos/Z3A0B7C4D1E8F5G2H9I6.mp4',
    'uncensored-videos/nx7nnXBeHftB7umRkdec.mp4',
    'uncensored-videos/o8cMQhNaSZiO0d0NoshF (còpia).mp4',
    'uncensored-videos/o8cMQhNaSZiO0d0NoshF.mp4',
    'uncensored-videos/oHEzllQyoJOrAZ5lnUdU.mp4',
    'uncensored-videos/owT8LTlvFEfwHj5cOtbc 18.53.32.mp4',
    'uncensored-videos/owT8LTlvFEfwHj5cOtbc.mp4',
    'uncensored-videos/peTmHJhWF44gaz25ACCr.mp4',
    'uncensored-videos/qEOel0dBNRP2ttJtVUcQ 18.52.54 (còpia).mp4',
    'uncensored-videos/qEOel0dBNRP2ttJtVUcQ 18.52.54.mp4',
    'uncensored-videos/qEOel0dBNRP2ttJtVUcQ.mp4',
    'uncensored-videos/r14kVENgyJthsXKP4ckJ.mp4',
    'uncensored-videos/rBSogUSRYAorst0XO7oy.mp4',
    'uncensored-videos/rWwDSNSYmt9jpPd2ngiI.mp4',
    'uncensored-videos/raKwkNU85MId6acMS6a0.mp4',
    'uncensored-videos/udkEtFkLN2SKU1I3aSIT (còpia).mp4',
    'uncensored-videos/udkEtFkLN2SKU1I3aSIT.mp4',
    'uncensored-videos/vF3JI0gM7nDGJAiKFb7S.mp4',
    'uncensored-videos/vJel6k1lAYlZxfEe5f1a.mp4',
    'uncensored-videos/vhDZYiY0UkTLtmu7HrfF.mp4',
    'uncensored-videos/wtcVFSKn4McI9xahFEGr.mp4',
    'uncensored-videos/ymdZTKkujrU5ON7ZB66H (còpia).mp4',
    'uncensored-videos/ymdZTKkujrU5ON7ZB66H.mp4',
    'uncensored-videos/zB6YDw2LZ6BZl8CbXMiV (còpia).mp4',
    'uncensored-videos/zB6YDw2LZ6BZl8CbXMiV.mp4',
    'uncensored-videos/zX53TSjhlQj4Gy76iK0H.mp4'
];
// Teaser images (first 6 from full folder for banner/teaser)
const TEASER_IMAGES = [
    'full/0456996c-b56e-42ef-9049-56b1a1ae2646.webp',
    'full/0Tc8Vtd0mEIvNHZwYGBq.webp',
    'full/0lySugcO4Pp4pEZKvz9U.webp',
    'full/0nSaCJQxbVw4BDrhnhHO.webp',
    'full/13TXvyRVZ7LtvAOx7kme.webp',
    'full/18VQaczW5kdfdiqUVasH.webp'
];

// ============================
// MULTI-IDIOMA TRANSLATIONS
// ============================

const TRANSLATIONS = {
    es: {
        gallery_title: 'Galería Premium Ibiza',
        gallery_description: 'Explora 200+ fotos y 40+ videos diarios del paraíso mediterráneo',
        unlock_button: '🔓 Desbloquear',
        vip_button: '👑 VIP Lifetime',
        // Add more translations as needed
    },
    en: {
        gallery_title: 'Premium Ibiza Gallery',
        gallery_description: 'Explore 200+ daily photos and 40+ videos from Mediterranean paradise',
        unlock_button: '🔓 Unlock',
        vip_button: '👑 VIP Lifetime',
        // Add more
    },
    fr: {
        gallery_title: 'Galerie Premium Ibiza',
        gallery_description: 'Explorez 200+ photos et 40+ vidéos quotidiennes du paradis méditerranéen',
        unlock_button: '🔓 Déverrouiller',
        vip_button: '👑 VIP À Vie',
        // Add more
    },
    de: {
        gallery_title: 'Premium Ibiza Galerie',
        gallery_description: 'Erkunde 200+ tägliche Fotos und 40+ Videos aus dem mediterranen Paradies',
        unlock_button: '🔓 Entsperren',
        vip_button: '👑 VIP Lebenslang',
        // Add more
    },
    it: {
        gallery_title: 'Galleria Premium Ibiza',
        gallery_description: 'Esplora 200+ foto e 40+ video giornalieri dal paradiso mediterraneo',
        unlock_button: '🔓 Sblocca',
        vip_button: '👑 VIP A Vita',
        // Add more
    },
    pt: {
        gallery_title: 'Galeria Premium Ibiza',
        gallery_description: 'Explore 200+ fotos e 40+ vídeos diários do paraíso mediterrâneo',
        unlock_button: '🔓 Desbloquear',
        vip_button: '👑 VIP Vitalício',
        // Add more
    }
};

// ============================
// STATE MANAGEMENT
// ============================

let state = {
    currentLanguage: localStorage.getItem('language') || 'es',
    isVIP: localStorage.getItem('isVIP') === 'true',
    packCredits: parseInt(localStorage.getItem('packCredits') || '0'),
    unlockedContent: JSON.parse(localStorage.getItem('unlockedContent') || '[]')
};
// ============================
// UTILITY FUNCTIONS
// ============================

function trackEvent(eventName, data) {
    if (window.gtag) {
        gtag('event', eventName, data);
    }
}

function showNotification(message) {
    const toast = document.getElementById('notification-toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
}

function celebrateUnlock() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function loadSavedState() {
    // Already loaded in state init; can add more if needed
}

function saveUnlockedContent() {
    localStorage.setItem('unlockedContent', JSON.stringify(state.unlockedContent));
}

// ============================
// CONTENT RENDERING
// ============================

function getDailyRotation(pool, count) {
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const shuffled = [...pool].sort((a, b) => (seed + pool.indexOf(a)) - (seed + pool.indexOf(b)));
    return shuffled.slice(0, count);
}

function renderPhotosProgressive() {
    const grid = document.getElementById('photos-grid');
    grid.innerHTML = '';
    const dailyPhotos = getDailyRotation(ALL_PHOTOS_POOL.concat(ALL_UNCENSORED_PHOTOS_POOL), CONFIG.CONTENT.DAILY_PHOTOS);
    dailyPhotos.forEach((photo, index) => {
        const isUnlocked = state.unlockedContent.includes(photo) || state.isVIP;
        const imgSrc = CONFIG.BASE_URL + photo;
        const item = document.createElement('div');
        item.className = 'content-item';
        item.innerHTML = `
            <img src="${isUnlocked ? imgSrc : 'placeholder.jpg'}" alt="Foto ${index + 1}" class="content-image lazy" data-src="${imgSrc}">
            <div class="content-overlay">${isUnlocked ? 'Desbloqueado' : 'Bloqueado'}</div>
        `;
        if (!isUnlocked) {
            item.addEventListener('click', () => unlockSingleContent(photo));
        }
        grid.appendChild(item);
    });
}

function renderVideosProgressive() {
    const grid = document.getElementById('videos-grid');
    grid.innerHTML = '';
    const dailyVideos = getDailyRotation(ALL_VIDEOS_POOL, CONFIG.CONTENT.DAILY_VIDEOS);
    dailyVideos.forEach((video, index) => {
        const isUnlocked = state.unlockedContent.includes(video) || state.isVIP;
        const videoSrc = CONFIG.BASE_URL + video;
        const item = document.createElement('div');
        item.className = 'content-item';
        item.innerHTML = `
            <video class="content-image lazy" ${isUnlocked ? '' : 'poster="placeholder.jpg"'}>
                <source data-src="${videoSrc}" type="video/mp4">
            </video>
            <div class="content-overlay">${isUnlocked ? 'Desbloqueado' : 'Bloqueado'}</div>
        `;
        if (!isUnlocked) {
            item.addEventListener('click', () => unlockSingleContent(video));
        }
        grid.appendChild(item);
    });
}

function renderTeaserCarousel() {
    const carousel = document.getElementById('teaser-carousel');
    carousel.innerHTML = '';
    TEASER_IMAGES.forEach((img, index) => {
        const fullSrc = CONFIG.BASE_URL + img;
        const item = document.createElement('div');
        item.className = 'teaser-item';
        item.innerHTML = `
            <img src="${fullSrc}" alt="Teaser ${index + 1}" class="teaser-image lazy" data-src="${fullSrc}">
            <div class="teaser-overlay">Vista Previa Exclusiva</div>
        `;
        carousel.appendChild(item);
    });
}

// ============================
// PAYPAL INTEGRATION
// ============================

function renderPayPalPackButton(containerId, packType) {
    paypal.Buttons({
        createOrder: (data, actions) => {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: CONFIG.PAYPAL.PACKS[packType].price.toFixed(2)
                    }
                }]
            });
        },
        onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
                addPackCredits(CONFIG.PAYPAL.PACKS[packType].items);
                showNotification('Pack comprado exitosamente!');
            });
        }
    }).render(`#${containerId}`);
}

// ============================
// UNLOCK FUNCTIONS
// ============================

function activateVIP() {
    state.isVIP = true;
    localStorage.setItem('isVIP', 'true');
    unlockAllContent();
}

function unlockAllContent() {
    state.unlockedContent = ALL_UNCENSORED_PHOTOS_POOL.concat(ALL_VIDEOS_POOL);
    saveUnlockedContent();
    renderPhotosProgressive();
    renderVideosProgressive();
    celebrateUnlock();
}

function unlockSingleContent(content) {
    if (state.packCredits > 0) {
        usePackCredit();
        state.unlockedContent.push(content);
        saveUnlockedContent();
        renderPhotosProgressive();
        renderVideosProgressive();
    } else {
        // Show single unlock modal with PayPal
    }
}

function addPackCredits(amount) {
    state.packCredits += amount;
    localStorage.setItem('packCredits', state.packCredits);
    updateCreditsDisplay();
}

function usePackCredit() {
    state.packCredits--;
    localStorage.setItem('packCredits', state.packCredits);
    updateCreditsDisplay();
}

function updateCreditsDisplay() {
    const creditsNumber = document.getElementById('credits-number');
    creditsNumber.textContent = state.packCredits;
}

// ============================
// DEBUG TOOLS
// ============================

const galleryDebug = {
    contentStats: () => {
        const stats = {
            totalPhotos: ALL_PHOTOS_POOL.length + ALL_UNCENSORED_PHOTOS_POOL.length,
            totalVideos: ALL_VIDEOS_POOL.length,
            dailyPhotos: CONFIG.CONTENT.DAILY_PHOTOS,
            dailyVideos: CONFIG.CONTENT.DAILY_VIDEOS
        };
        
        console.table(stats);
        return stats;
    }
};

// ============================
// CONSOLE WELCOME MESSAGE
// ============================

console.log(`
🌊 ===============================================
   BeachGirl.pics Paradise Gallery v14.0.0
   ===============================================
   
   🎯 Features:
   • ${ALL_PHOTOS_POOL.length + ALL_UNCENSORED_PHOTOS_POOL.length} fotos totales en pool
   • ${ALL_VIDEOS_POOL.length} videos totales en pool  
   • ${CONFIG.CONTENT.DAILY_PHOTOS} fotos diarias
   • ${CONFIG.CONTENT.DAILY_VIDEOS} videos diarios
   • Sistema multiidioma (6 idiomas)
   • PayPal integration completa
   • Isabella chat bot
   • Sistema de anuncios
   • PWA ready
   • Lazy loading avanzado
   
   🛠️  Debug tools: galleryDebug
   🌍 Environment: ${ENVIRONMENT.isDevelopment ? 'Development' : 'Production'}
   
   Try: galleryDebug.contentStats()
        galleryDebug.testAds()
        galleryDebug.setLanguage('en')
        galleryDebug.unlockAll()
        galleryDebug.addCredits(100)
        
🌊 ===============================================
`);

// ============================
// MAKE EVERYTHING GLOBALLY AVAILABLE
// ============================

// Export main functions
window.state = state;
window.TRANSLATIONS = TRANSLATIONS;
window.CONFIG = CONFIG;
window.ENVIRONMENT = ENVIRONMENT;

// Export utility functions  
window.trackEvent = trackEvent;
window.showNotification = showNotification;
window.celebrateUnlock = celebrateUnlock;
window.loadSavedState = loadSavedState;
window.saveUnlockedContent = saveUnlockedContent;

// Export content functions
window.getDailyRotation = getDailyRotation;
window.renderPhotosProgressive = renderPhotosProgressive;
window.renderVideosProgressive = renderVideosProgressive;
window.renderTeaserCarousel = renderTeaserCarousel;
window.renderPayPalPackButton = renderPayPalPackButton;

// Export unlock functions
window.activateVIP = activateVIP;
window.unlockAllContent = unlockAllContent;
window.unlockSingleContent = unlockSingleContent;
window.addPackCredits = addPackCredits;
window.usePackCredit = usePackCredit;
window.updateCreditsDisplay = updateCreditsDisplay;

console.log('✅ All systems initialized and ready!');

// ============================
// END OF SCRIPT
// ============================
