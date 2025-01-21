import liff from '@line/liff';

export const initLiff = async () => {
  try {
    await liff.init({ liffId: '2006800965-yAQbLLr3' });
  } catch (error) {
    console.error('LIFF initialization failed', error);
  }
};

export const getLineProfile = async () => {
  try {
    if (!liff.isLoggedIn()) {
      await liff.login()
    }
    const profile = await liff.getProfile()
    return profile
  } catch (error) {
    console.error('Error in getLineProfile:', error)
    throw error // Re-throw to handle in calling function
  }
}