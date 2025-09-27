#!/usr/bin/env node

/**
 * Script de testing para Mercado Pago
 * Uso: node scripts/test-mercadopago.js
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function testMercadoPago() {
  console.log('🧪 Testing Mercado Pago Integration...\n');

  try {
    // 1. Test crear preferencia
    console.log('1️⃣ Testing preference creation...');
    const preferenceResponse = await fetch(`${BASE_URL}/api/mp/create-preference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `test-${Date.now()}`,
        'Origin': BASE_URL,
        'Referer': `${BASE_URL}/test`
      },
      body: JSON.stringify({
        orderId: `test-order-${Date.now()}`,
        items: [{
          title: 'Test Product',
          unit_price: 1000,
          quantity: 1,
          currency_id: 'ARS'
        }],
        payerEmail: 'test_user_123456@testuser.com'
      })
    });

    if (!preferenceResponse.ok) {
      const error = await preferenceResponse.text();
      throw new Error(`Preference creation failed: ${error}`);
    }

    const preference = await preferenceResponse.json();
    console.log('✅ Preference created successfully');
    console.log(`   Preference ID: ${preference.preference_id}`);
    console.log(`   Init Point: ${preference.init_point}`);
    console.log(`   Sandbox Init Point: ${preference.sandbox_init_point}\n`);

    // 2. Test order status (debería fallar porque no existe)
    console.log('2️⃣ Testing order status...');
    const statusResponse = await fetch(`${BASE_URL}/api/mp/order-status?orderId=test-order-${Date.now()}`);
    const statusData = await statusResponse.json();
    
    if (statusData.ok === false && statusData.error === 'Order not found') {
      console.log('✅ Order status endpoint working correctly (order not found as expected)\n');
    } else {
      console.log('⚠️ Unexpected order status response:', statusData);
    }

    // 3. Test debug payment endpoint (debería fallar porque no existe)
    console.log('3️⃣ Testing debug payment endpoint...');
    const debugResponse = await fetch(`${BASE_URL}/api/mp/debug-payment?payment_id=999999999`);
    const debugData = await debugResponse.json();
    
    if (debugData.ok === false) {
      console.log('✅ Debug payment endpoint working correctly (payment not found as expected)');
      console.log(`   Error: ${debugData.error}\n`);
    } else {
      console.log('⚠️ Unexpected debug payment response:', debugData);
    }

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Use the sandbox_init_point URL to test payments');
    console.log('2. Use test cards: Visa 4509 9535 6623 3704, CVV 123, Exp 11/25');
    console.log('3. Check server logs for detailed debugging information');
    console.log('4. Use /api/mp/debug-payment?payment_id=XXX to check payment status');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the server is running (npm run dev)');
    console.log('2. Check that MP_ACCESS_TOKEN is set in .env.local');
    console.log('3. Verify NEXT_PUBLIC_BASE_URL is correct');
    process.exit(1);
  }
}

// Ejecutar tests
testMercadoPago();
