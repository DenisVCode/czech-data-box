import ISDSBox from '../src/lib/ISDSBox.js';

// Replace these with actual values
const loginname = '';
const password = '';

async function getReceivedMessages() {
  const isdsBox = new ISDSBox().loginWithUsernameAndPassword(
    loginname,
    password,
    true, // Set to true for production environment
  );

  console.log('Logged in');

  try {
    const messages = await isdsBox.getReceivedMessages({
      dmFromTime: '2023-01-01T00:00:00.000Z',
      dmToTime: new Date().toISOString(),
      dmStatusFilter: 5, // 5 = delivered
      dmOffset: 1,
      dmLimit: 10,
    });
    console.log('Received Messages:', messages);
    return messages;
  } catch (error) {
    console.error('Error fetching received messages:', error);
    throw new Error(error);
  }
}

try {
  await getReceivedMessages();
} catch (error) {
  console.error('Error:', error);
}
