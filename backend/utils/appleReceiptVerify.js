import axios from 'axios';

/**
 * Verifies an Apple App Store In-App Purchase receipt.
 * Handles automatic fallback from Production to Sandbox.
 * 
 * @param {string} receiptData - Base64-encoded receipt data from the app.
 * @returns {Promise<object>} Verification result containing { success, receipt, error }
 */
export async function verifyAppleReceipt(receiptData) {
  const sharedSecret = process.env.APPLE_IAP_SHARED_SECRET || null;
  const payload = {
    'receipt-data': receiptData,
  };
  if (sharedSecret) {
    payload.password = sharedSecret;
  }

  const productionUrl = 'https://buy.itunes.apple.com/verifyReceipt';
  const sandboxUrl = 'https://sandbox.itunes.apple.com/verifyReceipt';

  try {
    // 1. Try production verification first
    let response = await axios.post(productionUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    // 2. If status is 21007, it means sandbox receipt was sent to production; retry on sandbox
    if (response.data && response.data.status === 21007) {
      console.log('Sandbox receipt detected. Retrying with sandbox endpoint...');
      response = await axios.post(sandboxUrl, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (response.data && response.data.status === 0) {
      return {
        success: true,
        receipt: response.data.receipt,
      };
    } else {
      const statusCode = response.data ? response.data.status : 'unknown';
      console.error(`Apple verifyReceipt returned error status: ${statusCode}`);
      return {
        success: false,
        error: `Apple verifyReceipt failed with status: ${statusCode}`,
      };
    }
  } catch (error) {
    console.error('Network or server error during Apple receipt verification:', error.message);
    return {
      success: false,
      error: `Network or server error: ${error.message}`,
    };
  }
}
